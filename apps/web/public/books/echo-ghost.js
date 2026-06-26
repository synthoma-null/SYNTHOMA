/**
 * echo-ghost.js - Interaktivni profiluji mechanika pro SYNTHOMA
 *
 * Dva rezimy:
 *   1. Toggle (vychozi) - klik pouze prohodi textContent <-> data-echo
 *      Aktivuje se u kazdeho .echo-ghost s atributem data-echo.
 *      Profilovani pres data-profile-key + data-profile-map.
 *      Pametovy zamek pres data-answer (viditelne slovo === data-answer -> puzzle splnen).
 *
 *   2. Picker (explicitni) - otevre nabidku vice variant
 *      Aktivuje se POUZE pokud span ma:
 *        data-echo-mode="picker"  nebo  data-echo-picker="true"
 *      Vyzaduje data-echo-options="a|b|c".
 *
 * localStorage:
 *   Klic: data-profile-key
 *   Hodnota: { visible: "...", echo: "..." }
 *
 * API POST /api/me/choices - payload:
 *   { type: "echo-toggle", key, selected, profileDeltas }
 *   Tichy fail pri nedostupnosti nebo 4xx/5xx.
 */
(function () {
  'use strict';

  /* -- Helpers ---------------------------------------------------------- */

  function parseProfileMap(mapStr, chosenValue) {
    if (!mapStr || !chosenValue) return {};
    var deltas = {};
    var entries = mapStr.split(';');
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var colonIdx = entry.indexOf(':');
      if (colonIdx < 0) continue;
      var matchKey = entry.slice(0, colonIdx).trim();
      var dstr = entry.slice(colonIdx + 1).trim();
      if (!matchKey || !dstr || matchKey !== chosenValue) continue;
      var m = dstr.match(/^(.+?)([+-]\d+)$/);
      if (!m || !m[1] || !m[2]) continue;
      var deltaKey = m[1].trim();
      var deltaVal = parseInt(m[2], 10);
      if (deltaKey && isFinite(deltaVal)) deltas[deltaKey] = deltaVal;
    }
    return deltas;
  }

  function saveLocal(profileKey, visible, echo) {
    if (!profileKey) return;
    try {
      var store = JSON.parse(localStorage.getItem('synthoma_echo') || '{}');
      store[profileKey] = { visible: visible, echo: echo };
      localStorage.setItem('synthoma_echo', JSON.stringify(store));
    } catch (e) {}
  }

  function sendToApi(profileKey, selected, profileDeltas) {
    try {
      fetch('/api/me/choices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'echo-toggle',
          key: profileKey,
          selected: selected,
          profileDeltas: profileDeltas,
        }),
        credentials: 'same-origin',
      }).catch(function () {});
    } catch (e) {}
  }

  /* -- Toggle - vychozi rezim ------------------------------------------- */

  function doToggle(span) {
    var currentVisible = (span.textContent || '').trim();
    var currentEcho = span.getAttribute('data-echo') || '';

    span.textContent = currentEcho;
    span.setAttribute('data-echo', currentVisible);

    var newVisible = currentEcho;
    var newEcho = currentVisible;

    var profileKey = span.getAttribute('data-profile-key');
    var mapStr = span.getAttribute('data-profile-map');

    if (profileKey) {
      saveLocal(profileKey, newVisible, newEcho);
      var deltas = parseProfileMap(mapStr, newVisible);
      sendToApi(profileKey, newVisible, deltas);
    }

    checkAnswer(span, newVisible);
    checkPuzzle(span);
  }

  /* -- Picker - explicitni rezim ---------------------------------------- */

  var activePicker = null;

  function closePicker() {
    if (activePicker) {
      activePicker.remove();
      activePicker = null;
    }
  }

  function openPicker(span, options) {
    closePicker();
    var currentValue = (span.textContent || '').trim();

    var picker = document.createElement('div');
    picker.className = 'echo-picker';
    picker.setAttribute('role', 'listbox');
    picker.setAttribute('aria-label', 'Vyberte variantu slova');

    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'echo-picker-opt' + (opt === currentValue ? ' is-current' : '');
      btn.textContent = opt;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', opt === currentValue ? 'true' : 'false');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        applyPickerChoice(span, opt, options);
        closePicker();
      });
      picker.appendChild(btn);
    });

    span.appendChild(picker);
    activePicker = picker;
    var first = picker.querySelector('.echo-picker-opt');
    if (first) first.focus();
  }

  function applyPickerChoice(span, chosenValue, options) {
    var profileKey = span.getAttribute('data-profile-key');
    var mapStr = span.getAttribute('data-profile-map');
    var prevVisible = (span.textContent || '').trim();

    span.textContent = chosenValue;
    var otherOpt = options.find(function (o) { return o !== chosenValue; }) || prevVisible;
    span.setAttribute('data-echo', otherOpt);
    span.setAttribute('data-echo-chosen', chosenValue);

    if (profileKey) {
      saveLocal(profileKey, chosenValue, otherOpt);
      var deltas = parseProfileMap(mapStr, chosenValue);
      sendToApi(profileKey, chosenValue, deltas);
    }

    checkAnswer(span, chosenValue);
    checkPuzzle(span);
  }

  /* -- Pametovy zamek - data-answer ------------------------------------- */

  function checkAnswer(span, visibleWord) {
    var answer = span.getAttribute('data-answer');
    if (!answer) return;
    var correct = visibleWord.trim() === answer.trim();
    span.setAttribute('data-echo-chosen', correct ? visibleWord : '');
    checkPuzzle(span);
  }

  /* -- Pametovy zamek - data-puzzle-id ---------------------------------- */

  function checkPuzzle(span) {
    var wrapper = span.closest('[data-puzzle-id]');
    if (!wrapper) return;

    var allEchos = Array.from(wrapper.querySelectorAll('.echo-ghost'));
    var allDone = allEchos.every(function (el) { return el.getAttribute('data-echo-chosen'); });
    if (!allDone) return;

    wrapper.classList.add('puzzle-complete');
    var puzzleId = wrapper.getAttribute('data-puzzle-id');

    document.querySelectorAll('[data-puzzle-unlock="' + puzzleId + '"]').forEach(function (el) {
      el.classList.remove('hidden');
      el.classList.add('puzzle-unlocked');
    });

    try {
      fetch('/api/me/choices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'puzzle-complete',
          puzzleId: puzzleId,
          choices: allEchos.map(function (el) {
            return { key: el.getAttribute('data-profile-key'), value: el.getAttribute('data-echo-chosen') };
          }),
        }),
        credentials: 'same-origin',
      }).catch(function () {});
    } catch (e) {}
  }

  /* -- Obnoveni ulozenych voleb ze localStorage ------------------------- */

  function restoreChoices(root) {
    var scope = (root instanceof Element) ? root : document;
    try {
      var store = JSON.parse(localStorage.getItem('synthoma_echo') || '{}');
      scope.querySelectorAll('.echo-ghost[data-profile-key]').forEach(function (span) {
        var key = span.getAttribute('data-profile-key');
        var saved = store[key];
        if (!saved) return;
        if (saved && typeof saved === 'object' && 'visible' in saved) {
          span.textContent = saved.visible;
          span.setAttribute('data-echo', saved.echo || '');
          span.setAttribute('data-echo-chosen', saved.visible);
        } else if (typeof saved === 'string') {
          span.setAttribute('data-echo', saved);
          span.setAttribute('data-echo-chosen', saved);
        }
        checkAnswer(span, (span.textContent || '').trim());
      });
    } catch (e) {}
  }

  /* -- Hlavni click handler --------------------------------------------- */

  if (!window.__echoGhostBound) {
    window.__echoGhostBound = true;

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;

      if (t.closest('.echo-picker')) return;

      var span = t.closest('.echo-ghost');

      if (!span) {
        closePicker();
        return;
      }

      e.stopPropagation();

      if (activePicker && span.contains(activePicker)) {
        closePicker();
        return;
      }

      var isPickerMode = span.getAttribute('data-echo-mode') === 'picker'
        || span.getAttribute('data-echo-picker') === 'true';

      if (isPickerMode) {
        var optStr = span.getAttribute('data-echo-options') || '';
        var options = optStr.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        if (options.length > 0) openPicker(span, options);
        return;
      }

      if (span.hasAttribute('data-echo')) {
        doToggle(span);
      }
    }, false);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePicker();
    }, false);

  }

  /* -- Init ------------------------------------------------------------- */

  function init() { restoreChoices(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* -- Verejne API ------------------------------------------------------- */

  window.EchoGhost = {
    refresh: restoreChoices,
    apply: function (profileKey, visible) {
      var span = document.querySelector('.echo-ghost[data-profile-key="' + profileKey + '"]');
      if (!span) return;
      var currentVisible = (span.textContent || '').trim();
      if (currentVisible !== visible) doToggle(span);
    },
    getChoices: function () {
      try { return JSON.parse(localStorage.getItem('synthoma_echo') || '{}'); } catch (e) { return {}; }
    },
  };
})();