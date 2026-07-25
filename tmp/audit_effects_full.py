import os, re, csv, json, textwrap
from collections import defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(r'C:\SYNTHOMA\apps\web')
OUT_DIR = Path(r'C:\SYNTHOMA\audit\effects\2026-07-25')
OUT_DIR.mkdir(parents=True, exist_ok=True)

CSS_DIRS = [ROOT / 'src' / 'styles', ROOT / 'public', ROOT / 'app']
CODE_DIRS = [ROOT / 'public' / 'books', ROOT / 'src', ROOT / 'app']
IGNORE_DIRS = {'node_modules', '.next', '.swc', 'tmp'}

CLASS_RE = re.compile(r'\.([a-zA-Z_-][a-zA-Z0-9_-]*)')
KEYFRAMES_RE = re.compile(r'@keyframes\s+([a-zA-Z_-][a-zA-Z0-9_-]*)', re.IGNORECASE)
CLASS_ATTR_RE = re.compile(r'class(?:Name)?=["\']([^"\']+)["\']')
STYLE_ATTR_RE = re.compile(r'style=["\']([^"\']+)["\']')
CSS_RULE_RE = re.compile(r'([^{]+)\{([^}]*)\}', re.DOTALL)
ANIMATION_USE_RE = re.compile(r'animation:\s*([a-zA-Z0-9_-]+)')

EFFECT_PATTERNS = re.compile(r'(text-shadow|box-shadow|animation|filter|backdrop-filter|mix-blend-mode|-webkit-background-clip|background-clip|color-mix|transition|transform)')

DIALOG_CLASSES = {'dialog','dialogN','dialogS','dialogG','dialogD','log','title','text','textV','fx-gradient','halo','datastream'}

CSS_FILES = []
CODE_FILES = []

def scan():
    for d in CSS_DIRS:
        if not d.exists(): continue
        for p in d.rglob('*.css'):
            if any(part in IGNORE_DIRS for part in p.parts): continue
            CSS_FILES.append(p)
    for d in CODE_DIRS:
        if not d.exists(): continue
        for p in d.rglob('*'):
            if any(part in IGNORE_DIRS for part in p.parts): continue
            if p.suffix in {'.html','.tsx','.ts','.jsx','.js'}:
                CODE_FILES.append(p)

def extract_css():
    class_defs = defaultdict(lambda: {'files': set(), 'blocks': []})
    keyframes = defaultdict(lambda: {'files': set(), 'count': 0})
    for css in CSS_FILES:
        text = css.read_text(encoding='utf-8', errors='ignore')
        for m in KEYFRAMES_RE.finditer(text):
            k = m.group(1)
            keyframes[k]['files'].add(str(css.relative_to(ROOT)))
            keyframes[k]['count'] += 1
        # rule blocks
        for m in CSS_RULE_RE.finditer(text):
            selector = m.group(1).strip()
            body = m.group(2).strip()
            if not selector or not body: continue
            for cm in CLASS_RE.finditer(selector):
                cls = cm.group(1)
                class_defs[cls]['files'].add(str(css.relative_to(ROOT)))
                class_defs[cls]['blocks'].append({'file': str(css.relative_to(ROOT)), 'selector': selector, 'body': body})
    return class_defs, keyframes

def extract_usage():
    usage = defaultdict(lambda: {'files': set(), 'count': 0, 'contexts': []})
    for f in CODE_FILES:
        text = f.read_text(encoding='utf-8', errors='ignore')
        for m in CLASS_ATTR_RE.finditer(text):
            classes = m.group(1).split()
            for cls in classes:
                usage[cls]['files'].add(str(f.relative_to(ROOT)))
                usage[cls]['count'] += 1
                ls = max(0, text.rfind('\n', 0, m.start()))
                le = text.find('\n', m.end())
                line = text[ls:le].strip()
                if len(line) < 260:
                    usage[cls]['contexts'].append((str(f.relative_to(ROOT)), line))
    return usage

def is_effect(cls, class_defs):
    # known namespace classes / visual markers
    if any(cls.startswith(p) or cls == p for p in ['fx-','effect-','glitch','neon','dialog','log','title','textV','halo','datastream','echo-ghost','corrupt','redacted','bios-warning','memory-leak','overheat','static-noise','quantum-blur','neon-blood','alarm-emote','scramble','blink','choice','lib-','synth-gate']):
        return True
    # any class whose CSS blocks contain effect properties
    for b in class_defs.get(cls, {}).get('blocks', []):
        if EFFECT_PATTERNS.search(b['body']):
            return True
    return False

def book_and_chapter(rel):
    if 'public/books/' in rel:
        parts = rel.split('/')
        if len(parts) >= 3:
            return parts[2], parts[-1]
    return '', rel

def chapters_info():
    res = []
    for f in CODE_FILES:
        if f.suffix != '.html': continue
        rel = str(f.relative_to(ROOT))
        text = f.read_text(encoding='utf-8', errors='ignore')
        classes = []
        for m in CLASS_ATTR_RE.finditer(text):
            classes.extend(m.group(1).split())
        classes = list(dict.fromkeys(classes))
        book, ch = book_and_chapter(rel)
        dialog_classes = [c for c in classes if c.startswith('dialog') or c == 'dialog']
        fx_classes = [c for c in classes if c.startswith('fx-') or c in {'halo','corrupt','redacted','bios-warning','memory-leak','overheat','static-noise','quantum-blur','neon-blood','alarm-emote','echo-ghost','glitchy','glitching'}]
        res.append({'rel': rel, 'book': book, 'chapter': ch, 'classes': classes, 'dialogs': dialog_classes, 'fx': fx_classes})
    return res

def describe_class(cls, class_defs, usage, keyframes):
    blocks = class_defs.get(cls, {}).get('blocks', [])
    files = class_defs.get(cls, {}).get('files', set())
    ufiles = usage.get(cls, {}).get('files', set())
    count = usage.get(cls, {}).get('count', 0)
    
    # Prefer blocks whose selector starts with the class and contain effect props
    def score(b):
        sel = b['selector']
        s = 1 if (sel.startswith('.'+cls) or sel.startswith('p.'+cls) or sel.startswith('span.'+cls)) else 0
        s += 2 if EFFECT_PATTERNS.search(b['body']) else 0
        return s
    ranked = sorted(blocks, key=score, reverse=True)
    primary = ranked[0] if ranked else None
    body_text = ' '.join(b['body'] for b in blocks)
    primary_body = primary['body'] if primary else ''
    
    props = []
    if 'text-shadow' in primary_body: props.append('text-shadow')
    if 'box-shadow' in primary_body: props.append('box-shadow')
    if 'animation' in primary_body: props.append('animation')
    if re.search(r'\bfilter\s*:', primary_body): props.append('filter')
    if 'backdrop-filter' in primary_body: props.append('backdrop-filter')
    if 'mix-blend-mode' in primary_body: props.append('blend-mode')
    if '-webkit-background-clip: text' in primary_body or 'background-clip: text' in primary_body: props.append('text-clip/gradient')
    if 'transition' in primary_body: props.append('transition')
    if 'transform' in primary_body: props.append('transform')
    if '::before' in primary_body or '::after' in primary_body: props.append('pseudo-element')
    if 'color-mix' in primary_body: props.append('color-mix')
    
    anims = ANIMATION_USE_RE.findall(primary_body)
    
    return {
        'defined': bool(blocks),
        'files': files,
        'usage_count': count,
        'usage_files': ufiles,
        'props': props,
        'animations': anims,
        'selectors': [b['selector'] for b in blocks],
        'bodies': [b['body'] for b in blocks],
        'primary_body': primary_body,
        'primary_selector': primary['selector'] if primary else '',
    }

def main():
    scan()
    class_defs, keyframes = extract_css()
    usage = extract_usage()
    chapters = chapters_info()
    all_classes = set(class_defs.keys()) | set(usage.keys())
    
    used = {c for c in all_classes if usage.get(c,{}).get('count',0)>0}
    defined = {c for c in all_classes if class_defs.get(c,{}).get('files')}
    unused = defined - used
    broken = used - defined
    dupe_kfs = [k for k,v in keyframes.items() if v['count']>1]
    effect_classes = sorted([c for c in all_classes if is_effect(c, class_defs)], key=lambda s: s.lower())
    
    # --- 00 summary ---
    with open(OUT_DIR/'00-effects-summary.md','w',encoding='utf-8') as f:
        f.write('# SYNTHOMA Effects Audit — Summary\n\n')
        f.write(f'- **Audit date:** `{datetime.now().isoformat()}`\n')
        f.write(f'- **CSS files scanned:** {len(CSS_FILES)}\n')
        f.write(f'- **Code/HTML files scanned:** {len(CODE_FILES)}\n')
        f.write(f'- **Unique class tokens found:** {len(all_classes)}\n')
        f.write(f'- **Effect-class candidates:** {len(effect_classes)}\n')
        f.write(f'- **Defined in CSS:** {len(defined)}\n')
        f.write(f'- **Used in project:** {len(used)}\n')
        f.write(f'- **Defined but unused:** {len(unused)}\n')
        f.write(f'- **Used but not defined (broken/unknown):** {len(broken)}\n')
        f.write(f'- **@keyframes found:** {len(keyframes)}\n')
        f.write(f'- **Duplicate keyframes:** {len(dupe_kfs)}\n')
        f.write('\n## Quick problem list\n\n')
        f.write('### Broken / unknown (sample)\n\n')
        for c in sorted(broken)[:60]:
            f.write(f'- `.{c}` — {usage[c]["count"]}× in {", ".join(sorted(usage[c]["files"])[:3])}\n')
        if len(broken)>60: f.write(f'- … and {len(broken)-60} more\n')
        f.write('\n### Defined but unused (sample)\n\n')
        for c in sorted(unused)[:60]:
            f.write(f'- `.{c}` — in {", ".join(sorted(class_defs[c]["files"])[:2])}\n')
        if len(unused)>60: f.write(f'- … and {len(unused)-60} more\n')
    
    # --- 01 catalog ---
    with open(OUT_DIR/'01-effects-catalog.md','w',encoding='utf-8') as f:
        f.write('# SYNTHOMA Effects Catalog\n\n')
        f.write('Kompletní technický katalog efektových tříd nalezených v projektu.\n\n')
        for cls in effect_classes:
            info = describe_class(cls, class_defs, usage, keyframes)
            f.write(f'## `.{cls}`\n\n')
            f.write(f'- **Status:** {"defined" if info["defined"] else "BROKEN / not defined"}\n')
            f.write(f'- **CSS files:** {", ".join(sorted(info["files"])) or "_none_"}\n')
            f.write(f'- **Used in:** {info["usage_count"]} occurrences across {len(info["usage_files"])} files\n')
            if info['props']:
                f.write(f'- **Effect properties:** {", ".join(info["props"])}\n')
            if info['animations']:
                f.write(f'- **Animations:** {", ".join(set(info["animations"]))}\n')
            if info['selectors']:
                f.write(f'- **Selectors (sample):** `{"`, `".join(info["selectors"][:3])}`\n')
            if info['usage_files']:
                f.write('- **Usage sample:**\n')
                for fl in sorted(info['usage_files'])[:5]:
                    f.write(f'  - `{fl}`\n')
            if info['primary_body']:
                body = info['primary_body']
                if len(body)>600: body = body[:600] + '…'
                f.write(f'- **Selector:** `{info["primary_selector"].strip()}`\n')
                f.write(f'- **CSS body (primary):**\n```css\n.{cls} {{\n{body}\n}}\n```\n')
            f.write('\n---\n\n')
    
    # --- 02 chapter matrix ---
    with open(OUT_DIR/'02-chapter-effects-matrix.csv','w',newline='',encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['book','chapter','total_classes','dialog_classes','fx_classes','all_classes','risk_flag'])
        for ch in chapters:
            risk = ''
            heavy = sum(1 for c in ch['classes'] if c.startswith('fx-') or c in {'flicker','shake','blur','glitch','neon'})
            if heavy>15: risk='high-fx-density'
            elif heavy>8: risk='medium-fx-density'
            w.writerow([ch['book'], ch['chapter'], len(ch['classes']), ' '.join(ch['dialogs']), ' '.join(ch['fx']), ' '.join(ch['classes']), risk])
    
    # --- 03 dialog effects ---
    with open(OUT_DIR/'03-dialog-effects.md','w',encoding='utf-8') as f:
        f.write('# Dialog & Speaker Effects\n\n')
        for cls in sorted(DIALOG_CLASSES):
            info = describe_class(cls, class_defs, usage, keyframes)
            f.write(f'## `.{cls}`\n\n')
            f.write(f'- **Used:** {info["usage_count"]}×\n')
            f.write(f'- **Defined:** {info["defined"]}\n')
            f.write(f'- **Properties:** {", ".join(info["props"]) or "—"}\n')
            if info['primary_body']:
                body = info['primary_body']
                if len(body)>500: body = body[:500]+'…'
                f.write(f'```css\n{info["primary_selector"].strip()} {{\n{body}\n}}\n```\n')
            f.write('\n')
        f.write('## Emoji rule check (Glitchka)\n\n')
        glitchka_files = [ch for ch in chapters if any('dialogG' in c for c in ch['classes'])]
        f.write(f'Chapters containing `.dialogG`: {len(glitchka_files)}\n\n')
        for ch in glitchka_files:
            f.write(f'- `{ch["rel"]}` ({len([c for c in ch["classes"] if c=="dialogG"])} `.dialogG` occurrences)\n')
    
    # --- 04 animations ---
    with open(OUT_DIR/'04-animation-and-keyframes.md','w',encoding='utf-8') as f:
        f.write('# Animations & Keyframes\n\n')
        f.write(f'**Total @keyframes:** {len(keyframes)}\n\n')
        f.write('## Duplicate keyframe names\n\n')
        for k in sorted(dupe_kfs):
            f.write(f'- `@{k}` — {keyframes[k]["count"]} definitions in {", ".join(sorted(keyframes[k]["files"]))}\n')
        f.write('\n## All keyframes\n\n')
        for k in sorted(keyframes.keys()):
            f.write(f'- `{k}` — {", ".join(sorted(keyframes[k]["files"]))}\n')
    
    # --- 05 unused & broken ---
    with open(OUT_DIR/'05-unused-and-broken-effects.md','w',encoding='utf-8') as f:
        f.write('# Unused & Broken Effects\n\n')
        f.write('## Used but not defined in CSS (likely typos / generated at runtime)\n\n')
        for c in sorted(broken):
            f.write(f'- `.{c}` — {usage[c]["count"]}× in {", ".join(sorted(usage[c]["files"]))}\n')
        f.write('\n## Defined but unused\n\n')
        for c in sorted(unused)[:300]:
            f.write(f'- `.{c}` — in {", ".join(sorted(class_defs[c]["files"])[:2])}\n')
        if len(unused)>300: f.write(f'\n… and {len(unused)-300} more.\n')
    
    # --- 06 theme compatibility ---
    with open(OUT_DIR/'06-theme-compatibility.md','w',encoding='utf-8') as f:
        f.write('# Theme Compatibility\n\n')
        f.write('Classes with explicit theme references (var(...)) and classes using hard-coded colors.\n\n')
        f.write('## Classes using CSS variables (theme-aware)\n\n')
        for cls in effect_classes[:300]:
            info = describe_class(cls, class_defs, usage, keyframes)
            if any('var(--' in b for b in info['bodies']):
                f.write(f'- `.{cls}` — {", ".join(info["props"]) or "—"}\n')
        f.write('\n## Classes with hard-coded colors / !important\n\n')
        for cls in effect_classes:
            info = describe_class(cls, class_defs, usage, keyframes)
            if any(re.search(r'#(?:[0-9a-fA-F]{3,8})|rgba?\(|!important', b) for b in info['bodies']):
                f.write(f'- `.{cls}`\n')
    
    # --- 07 accessibility & performance ---
    with open(OUT_DIR/'07-accessibility-and-performance.md','w',encoding='utf-8') as f:
        f.write('# Accessibility & Performance Notes\n\n')
        f.write('## Reduced motion overrides found\n\n')
        for css in CSS_FILES:
            text = css.read_text(encoding='utf-8', errors='ignore')
            if 'prefers-reduced-motion' in text:
                f.write(f'- `{css.relative_to(ROOT)}`\n')
        f.write('\n## Classes with filters / blur (performance caution)\n\n')
        for cls in effect_classes:
            info = describe_class(cls, class_defs, usage, keyframes)
            if 'filter' in info['props'] or 'backdrop-filter' in str(info['bodies']):
                f.write(f'- `.{cls}`\n')
        f.write('\n## Classes with layout-animation risk\n\n')
        for cls in effect_classes:
            info = describe_class(cls, class_defs, usage, keyframes)
            if any('width' in b or 'height' in b or 'top' in b or 'left' in b for b in info['bodies']):
                f.write(f'- `.{cls}`\n')
    
    # --- 08 usage guide ---
    with open(OUT_DIR/'08-effects-usage-guide.md','w',encoding='utf-8') as f:
        f.write('# SYNTHOMA Effects Usage Guide\n\n')
        f.write('## Recommended intensity\n\n')
        f.write('- Běžný odstavec: 0–1 jemný inline efekt.\n')
        f.write('- Klíčová věta: 1 hlavní efekt.\n')
        f.write('- Systémová událost: `LOG` + max 1 animace.\n')
        f.write('- Dialog: speaker třída, případně 1 významový efekt.\n')
        f.write('- Vrchol kapitoly: silnější kombinace, ale krátce.\n\n')
        f.write('## Speaker cheat sheet\n\n')
        f.write('- `.dialog` — T-AI / systém\n')
        f.write('- `.dialogN` — NULL-1\n')
        f.write('- `.dialogS` — Sarkasma (červený glow)\n')
        f.write('- `.dialogG` — Glitchka (modro-růžový gradient) — **vždy 2 emoji**\n')
        f.write('- `.dialogD` — Dvanáctník / mýtná entita\n')
        f.write('- `.dialog.fx-gradient` — Glitchena (červená)\n\n')
        f.write('## Safe combinations\n\n')
        f.write('- `dialogS` + jemný `.glitchy`\n')
        f.write('- `log fx-scanline` + `.datastream`\n')
        f.write('- `span class="fx-neon"` na fragment písmena\n\n')
        f.write('## Avoid\n\n')
        f.write('- `flicker + shake + blur + gradient + neon` na celém odstavci.\n')
        f.write('- `.fx-rainbow` ve vážné/hororové scéně.\n')
        f.write('- Chybějící `data-echo` u `.echo-ghost`.\n\n')
        f.write('## Color meaning map\n\n')
        f.write('- **cyan** — systém, data, T-AI\n')
        f.write('- **magenta** — glitch, emoce, přepis\n')
        f.write('- **žlutá** — varování, restart, systémová pozornost\n')
        f.write('- **červená** — Sarkasma, touha, obrana, Glitchena\n')
        f.write('- **modrá/růžová** — Glitchka, bezpečí, dětství\n')
    
    used_effects = {c for c in effect_classes if usage.get(c,{}).get('count',0)>0}
    non_theme_effects = [c for c in effect_classes if not any('var(--' in b for b in describe_class(c, class_defs, usage, keyframes)['bodies'])]
    risky_chapters = [ch for ch in chapters if any(c.startswith('fx-') for c in ch['classes']) and sum(1 for c in ch['classes'] if c.startswith('fx-'))>=5]
    
    print(json.dumps({
        'css_files': len(CSS_FILES),
        'code_files': len(CODE_FILES),
        'unique_classes': len(all_classes),
        'effect_classes': len(effect_classes),
        'effect_classes_used': len(used_effects),
        'defined': len(defined),
        'used': len(used),
        'unused': len(unused),
        'broken': len(broken),
        'keyframes': len(keyframes),
        'duplicate_keyframes': len(dupe_kfs),
        'non_theme_effect_classes': len(non_theme_effects),
        'risky_chapters': len(risky_chapters),
        'output': str(OUT_DIR),
    }))

if __name__ == '__main__':
    main()
