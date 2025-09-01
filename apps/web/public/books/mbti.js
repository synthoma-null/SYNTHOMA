(function(){
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }

  function getStore(){
    const key = "mbtiScores";
    let data = null;
    try { data = JSON.parse(localStorage.getItem(key)); } catch(e) { data = null; }
    if(!data){
      try { data = JSON.parse(sessionStorage.getItem(key)); } catch(e) { data = null; }
    }
    if(!data || typeof data !== 'object') data = {};
    return { key, data };
  }

  function saveStore(key, data){
    const str = JSON.stringify(data);
    try { localStorage.setItem(key, str); } catch(e) {}
    try { sessionStorage.setItem(key, str); } catch(e) {}
  }

  function toast(msg){
    let box = document.getElementById('mbti-toast');
    if(!box){
      box = document.createElement('div');
      box.id = 'mbti-toast';
      box.setAttribute('role','status');
      box.setAttribute('aria-live','polite');
      box.style.position = 'fixed';
      box.style.left = '50%';
      box.style.bottom = '1.2rem';
      box.style.transform = 'translateX(-50%)';
      box.style.zIndex = '2147483647';
      box.style.maxWidth = '80vw';
      box.style.padding = '0.5rem 0.8rem';
      box.style.borderRadius = '8px';
      box.style.font = '600 0.9rem system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      box.style.color = 'white';
      box.style.background = 'rgba(20,20,28,0.9)';
      box.style.boxShadow = '0 2px 20px rgba(0,255,255,0.25), 0 0 0 1px rgba(255,0,180,0.25)';
      box.style.pointerEvents = 'none';
      box.style.opacity = '0';
      box.style.transition = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'opacity 0.01s linear' : 'opacity 220ms ease';
      document.body.appendChild(box);
    }
    box.textContent = msg;
    requestAnimationFrame(function(){ box.style.opacity = '1'; });
    clearTimeout(box._t);
    box._t = setTimeout(function(){ box.style.opacity = '0'; }, 1600);
  }

  function onClick(e){
    e.preventDefault();
    const a = e.currentTarget;
    const letter = a && a.dataset ? a.dataset.mbti : null;
    if(!letter){ return; }
    const { key, data } = getStore();
    data[letter] = (data[letter] || 0) + 1;
    saveStore(key, data);
    console.log('[MBTI]', `+${letter}`, data);
    toast(`+${letter} přidáno do profilu`);
  }

  ready(function(){
    const links = document.querySelectorAll('.choice-link[data-mbti]');
    links.forEach(function(a){ a.addEventListener('click', onClick, false); });

    // Support for <p class="choice" data-tags="E,I"> used in RESTART pages
    function handleChoiceElementActivate(target){
      if(!target || !target.dataset) return;
      // data-tags like "E,I" or "I,E" -> take the first as primary signal
      const tags = (target.dataset.tags || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
      if(tags.length === 0) return;
      const letter = tags[0];
      const { key, data } = getStore();
      data[letter] = (data[letter] || 0) + 1;
      saveStore(key, data);
      console.log('[MBTI]', `+${letter}`, data, '(from data-tags)');
      toast(`+${letter} přidáno do profilu`);

      // Visual feedback: mark selected and disable siblings within the contiguous choice block
      try {
        // find block bounds: walk up to parent, then traverse previous/next siblings while they are p.choice
        var parent = target.parentElement;
        if(parent){
          var sib;
          // backward
          sib = target.previousElementSibling;
          while(sib && sib.tagName && sib.tagName.toLowerCase() === 'p' && sib.classList.contains('choice')){
            sib.classList.remove('selected');
            sib.classList.add('disabled');
            sib = sib.previousElementSibling;
          }
          // forward
          sib = target.nextElementSibling;
          while(sib && sib.tagName && sib.tagName.toLowerCase() === 'p' && sib.classList.contains('choice')){
            sib.classList.remove('selected');
            sib.classList.add('disabled');
            sib = sib.nextElementSibling;
          }
        }
        // mark the clicked one
        target.classList.add('selected');
        target.classList.remove('disabled');
        target.setAttribute('aria-pressed','true');
      } catch(_) { /* ignore visual errors */ }
    }

    // Click support
    document.querySelectorAll('p.choice[data-tags]').forEach(function(el){
      // Make it focusable and button-like for a11y
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if(!el.hasAttribute('role')) el.setAttribute('role','button');
      el.setAttribute('aria-pressed','false');
      el.addEventListener('click', function(e){ e.preventDefault(); handleChoiceElementActivate(el); }, false);
      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleChoiceElementActivate(el); }
      }, false);
    });
  });
})();
