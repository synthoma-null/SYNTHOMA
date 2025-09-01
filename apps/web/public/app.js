/* global React, ReactDOM */
const { useState, useMemo } = React;
const { Link, Route, Switch, useLocation } = window.Wouter;

// --- Dummy data (MVP seed) ---
const demoChapter = {
  title: 'NULL-1: Prolog v Mokřadu',
  paid: false, // 2+ stránky zdarma, pak paywall
  content: `Kap.1\n\nNeon stéká po listech, když Glitchka šeptá do ozónu.\n\nKap.2\n\nSarkasma přepíná filtry reality.\n\nKap.3\n\nNULL-1 se nadechuje ticha.`,
};

const wikiSeed = [
  { slug: 'null-1', title: 'NULL-1', type: 'postava', teaser: 'Fragment, co odmítl zmizet.' },
  { slug: 'glitchka', title: 'Glitchka', type: 'postava', teaser: 'Šum v lidským tvaru.' },
  { slug: 'neonovy-mokrad', title: 'Neonový mokřad', type: 'misto', teaser: 'Ticho svítí. Bahno dýchá.' },
];

// --- Layout ---
function Nav() {
  const [location] = useLocation();
  return (
    <nav className="flex items-center justify-between p-4 border-b border-pink-500/20">
      <Link href="/" className="font-bold glitch" data-text="Synthoma">Synthoma</Link>
      <div className="flex gap-4 text-sm">
        <Link href="/reader" className={location === '/reader' ? 'text-neon-magenta' : ''}>Čtečka</Link>
        <Link href="/reader/null-1" className={location === '/reader/null-1' ? 'text-neon-magenta' : ''}>Čtečka (HTML)</Link>
        <Link href="/books" className={location === '/books' ? 'text-neon-magenta' : ''}>Knihovna</Link>
        <Link href="/wiki" className={location === '/wiki' ? 'text-neon-magenta' : ''}>Wiki</Link>
        <Link href="/mbti" className={location === '/mbti' ? 'text-neon-magenta' : ''}>MBTI</Link>
      </div>
    </nav>
  );
}

function Shell({ children }) {
  return (
    <div className="bg-lines min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto p-4">{children}</main>
      <footer className="opacity-60 text-xs p-6 text-center">© {new Date().getFullYear()} Synthoma. Neon tě vidí. 👁️</footer>
    </div>
  );
}

// --- Pages ---
function Home() {
  return (
    <Shell>
      <h1 className="text-3xl md:text-4xl font-extrabold glitch" data-text="Neonový mokřad příběhů">Neonový mokřad příběhů</h1>
      <p className="mt-4 neon-text">Cyberpunk, interaktivní čtení a MBTI hack. 2 kapitoly zdarma, pak zaplať a pokračuj – nebo se utop v Prázdnotě. 😈</p>
      <div className="mt-6 flex gap-3">
        <Link href="/reader" className="btn-neon px-4 py-2 rounded">Spustit čtečku</Link>
        <Link href="/reader/null-1" className="btn-neon px-4 py-2 rounded">Číst HTML kapitolu</Link>
        <Link href="/books" className="btn-neon px-4 py-2 rounded">Knihovna</Link>
        <Link href="/mbti" className="btn-neon px-4 py-2 rounded">Interaktivní příběh MBTI</Link>
      </div>
    </Shell>
  );
}

function Reader({ chapter = demoChapter }) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => chapter.content.split('\n\n'), [chapter]);
  const showPaywall = !chapter.paid && page >= 2;
  return (
    <Shell>
      <div className="neon-reader p-6">
        <h2 className="text-2xl font-bold glitch" data-text={chapter.title}>{chapter.title}</h2>
        <p className="neon-text whitespace-pre-wrap mt-4 min-h-[10rem]">{pages[page]}</p>
        <div className="mt-4 flex gap-2">
          <button className="btn-neon px-3 py-2 rounded" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Předchozí 📖</button>
          <button className="btn-neon px-3 py-2 rounded" onClick={() => setPage(Math.min(pages.length - 1, page + 1))} disabled={page === pages.length - 1 || showPaywall}>Další 🚀</button>
        </div>
        {showPaywall && (
          <div className="paywall mt-6 p-4 rounded">
            <p>Chceš pokračovat? Kup si přístup, nebo zůstaň v Prázdnotě! 😈</p>
            <button className="btn-neon px-3 py-2 rounded mt-2" onClick={() => alert('Přesměrování na Stripe...')}>Zaplatit 💸</button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Wiki() {
  return (
    <Shell>
      <h2 className="text-2xl font-bold glitch" data-text="Archiv (Wiki)">Archiv (Wiki)</h2>
      <ul className="mt-4 space-y-2">
        {wikiSeed.map((e) => (
          <li key={e.slug} className="p-3 rounded border border-pink-500/20">
            <div className="text-sm uppercase opacity-70">{e.type}</div>
            <div className="font-semibold">{e.title}</div>
            <div className="opacity-80">{e.teaser}</div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function MBTI() {
  const [scores, setScores] = useState({ I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 });
  const [step, setStep] = useState(0);
  const q = [
    { t: 'Glitchka tě volá do šumu, jdeš?', a: { I: 1 }, b: { E: 1 } },
    { t: 'Hledáš vzorce nebo fakta?', a: { N: 1 }, b: { S: 1 } },
    { t: 'NULL-1 pláče, řešíš empatií nebo logikou?', a: { F: 1 }, b: { T: 1 } },
    { t: 'Plánuješ výpad, nebo improvizuješ?', a: { J: 1 }, b: { P: 1 } },
  ];
  const pick = (delta) => {
    const next = { ...scores };
    for (const k in delta) next[k] += delta[k];
    setScores(next);
    setStep(step + 1);
  };
  const result = useMemo(() => {
    const type = `${scores.I >= scores.E ? 'I' : 'E'}${scores.N >= scores.S ? 'N' : 'S'}${scores.F >= scores.T ? 'F' : 'T'}${scores.J >= scores.P ? 'J' : 'P'}`;
    return type;
  }, [scores]);

  return (
    <Shell>
      <h2 className="text-2xl font-bold glitch" data-text="Interaktivní příběh (MBTI)">Interaktivní příběh (MBTI)</h2>
      {step < q.length ? (
        <div className="mt-4 p-4 border border-pink-500/20 rounded">
          <p className="neon-text">{q[step].t}</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-neon px-3 py-2 rounded" onClick={() => pick(q[step].a)}>A: Ano</button>
            <button className="btn-neon px-3 py-2 rounded" onClick={() => pick(q[step].b)}>B: Ne</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 border border-pink-500/20 rounded">
          <p className="text-lg">Tvoje vibrační typologie: <span className="font-bold">{result}</span></p>
          <p className="opacity-80 mt-2">Neboj, víme, že MBTI je pseudověda. Tady je to jen stylovej kompas v mokřadu. 🧭</p>
          <Link href="/reader" className="btn-neon inline-block mt-3 px-3 py-2 rounded">Pokračuj do čtečky</Link>
        </div>
      )}
    </Shell>
  );
}

// --- HTML Chapter Reader (parsing choices -> MBTI) ---
function HTMLChapterReader({ url }) {
  // resolve URL from query string ?u=... fallback to default chapter
  const defaultUrl = '/books/SYNTHOMA-NULL/0-∞ [RESTART].html';
  const [location] = useLocation();
  const query = React.useMemo(() => {
    try {
      const q = new URLSearchParams(location.split('?')[1] || '');
      return q;
    } catch { return new URLSearchParams(''); }
  }, [location]);
  const effectiveUrl = React.useMemo(() => query.get('u') || url || defaultUrl, [query, url]);
  const [blocks, setBlocks] = useState([]); // { type: 'text', html } | { type: 'choices', items: [{text, tags: ['E','I']}] }
  const [i, setI] = useState(0);
  const [scores, setScores] = useState({ I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 });
  const [ttsOn, setTtsOn] = useState(false);
  const synth = window.speechSynthesis;

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(encodeURI(effectiveUrl));
        const txt = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, 'text/html');
        const out = [];
        let choiceRun = [];
        const pushChoiceRun = () => {
          if (choiceRun.length) {
            out.push({ type: 'choices', items: choiceRun });
            choiceRun = [];
          }
        };
        const nodes = doc.body ? Array.from(doc.body.children) : [];
        for (const n of nodes) {
          const cls = n.getAttribute('class') || '';
          if (cls.includes('choice')) {
            const tagsAttr = n.getAttribute('data-tags') || '';
            const tags = tagsAttr.split(',').map((s) => s.trim()).filter(Boolean);
            const text = n.textContent?.replace(/^\s*▼\s*/,'').trim() || '';
            choiceRun.push({ text, tags });
          } else {
            pushChoiceRun();
            const tag = n.tagName.toLowerCase();
            const html = n.innerHTML || '';
            out.push({ type: 'text', tag, html });
          }
        }
        pushChoiceRun();
        setBlocks(out);
        setI(0);
      } catch (e) {
        console.error('Load HTML failed', e);
      }
    })();
  }, [effectiveUrl]);

  // Keyboard controls ←/→
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') {
        if (blocks[i] && blocks[i].type !== 'choices') go(+1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, blocks]);

  const onPick = (item) => {
    if (Array.isArray(item.tags) && item.tags.length) {
      const next = { ...scores };
      // Heuristika: první tag v pořadí posílíme +1
      const first = item.tags[0];
      if (next[first] != null) next[first] += 1;
      setScores(next);
    }
    setI((x) => Math.min(blocks.length - 1, x + 1));
  };

  const go = (d) => setI((x) => Math.max(0, Math.min(blocks.length - 1, x + d)));

  // TTS helpers
  const getCurrentPlainText = () => {
    const b = blocks[i];
    if (!b) return '';
    if (b.type === 'text') {
      const div = document.createElement('div');
      div.innerHTML = b.html;
      return div.textContent || '';
    }
    if (b.type === 'choices') {
      return 'Vyber si možnost.';
    }
    return '';
  };
  const stopTTS = () => {
    try { synth && synth.cancel(); } catch {}
  };
  const speakTTS = () => {
    try {
      if (!synth) return;
      stopTTS();
      const utter = new SpeechSynthesisUtterance(getCurrentPlainText());
      utter.lang = 'cs-CZ';
      synth.speak(utter);
    } catch {}
  };
  React.useEffect(() => {
    if (!ttsOn) return;
    speakTTS();
    // stop when leaving component or disabling
    return () => stopTTS();
  }, [i, ttsOn]);

  const type = useMemo(() => {
    const s = scores;
    return `${s.I >= s.E ? 'I' : 'E'}${s.N >= s.S ? 'N' : 'S'}${s.F >= s.T ? 'F' : 'T'}${s.J >= s.P ? 'J' : 'P'}`;
  }, [scores]);

  const done = i >= blocks.length - 1;

  return (
    <Shell>
      <div className="neon-reader p-6">
        <h2 className="text-2xl font-bold glitch" data-text="SYNTHOMA: HTML kapitola">SYNTHOMA: HTML kapitola</h2>
        {blocks.length === 0 ? (
          <p className="opacity-80">Načítám kapitolu… pokud to trvá, asi ji žere Prázdnota.</p>
        ) : (
          <div className="mt-4 min-h-[10rem] space-y-3">
            {blocks[i].type === 'text' ? (
              <div className="neon-text" dangerouslySetInnerHTML={{ __html: blocks[i].html }} />
            ) : (
              <div>
                <p className="opacity-80 mb-2">Zvol si, nebo tě zvolí šum:</p>
                <div className="flex flex-col gap-2">
                  {blocks[i].items.map((it, idx) => (
                    <button key={idx} className="btn-neon px-3 py-2 rounded text-left" onClick={() => onPick(it)}>
                      {it.text}
                      <span className="ml-2 opacity-50 text-xs">[{(it.tags||[]).join('/')}]</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 flex gap-2 items-center">
          <button className="btn-neon px-3 py-2 rounded" onClick={() => go(-1)} disabled={i === 0}>Předchozí</button>
          <button className="btn-neon px-3 py-2 rounded" onClick={() => go(+1)} disabled={i >= blocks.length - 1 || (blocks[i] && blocks[i].type === 'choices')}>Další</button>
          <button
            className={`btn-neon px-3 py-2 rounded ${ttsOn ? 'text-neon-magenta' : ''}`}
            onClick={() => setTtsOn((v) => {
              const nv = !v; if (!nv) stopTTS(); else speakTTS(); return nv;
            })}
            title="Přečíst nahlas"
          >{ttsOn ? 'TTS: Zapnuto 🔊' : 'TTS: Vypnuto 🔇'}</button>
          <span className="opacity-70 text-sm">{blocks.length ? `${i + 1}/${blocks.length}` : ''}</span>
        </div>
        {done && (
          <div className="mt-6 p-4 border border-pink-500/20 rounded">
            <p className="text-lg">Tvoje MBTI vibrace: <span className="font-bold">{type}</span></p>
            <p className="opacity-80 mt-2">Klid, věda to není. Ale styl to má. 😈</p>
            <Link href="/mbti" className="btn-neon inline-block mt-3 px-3 py-2 rounded">Detailní výklad</Link>
          </div>
        )}
      </div>
    </Shell>
  );
}

// --- Books (manifest listing) ---
function Books() {
  const [data, setData] = useState({ collections: [] });
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/books/manifest.json');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('manifest failed', e);
      }
    })();
  }, []);

  return (
    <Shell>
      <h2 className="text-2xl font-bold glitch" data-text="Knihovna">Knihovna</h2>
      {!data.collections.length ? (
        <p className="opacity-80 mt-4">Prázdnota. Nahraj kapitoly do <code>/public/books/</code> a zapiš je do <code>manifest.json</code>.</p>
      ) : (
        <div className="mt-4 space-y-6">
          {data.collections.map((col, i) => (
            <section key={i} className="border border-pink-500/20 rounded p-4">
              <h3 className="text-xl font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {(col.chapters || []).map((ch, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/reader/null-1?u=${encodeURIComponent(ch.path)}`}
                      className="btn-neon inline-block px-3 py-2 rounded"
                    >
                      {ch.title} {ch.free ? <span className="opacity-60">(zdarma)</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reader" component={Reader} />
      <Route path="/reader/null-1" component={HTMLChapterReader} />
      <Route path="/books" component={Books} />
      <Route path="/wiki" component={Wiki} />
      <Route path="/mbti" component={MBTI} />
      <Route> 
        {(params) => (
          <Shell>
            <h2 className="text-2xl font-bold">404</h2>
            <p className="opacity-80">Zabloudil jsi v prázdnotě rout. Vrať se do neonů.</p>
            <Link href="/" className="btn-neon inline-block mt-3 px-3 py-2 rounded">Domů</Link>
          </Shell>
        )}
      </Route>
    </Switch>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
