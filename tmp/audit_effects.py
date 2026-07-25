import os
import re
import csv
import json
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

CSS_FILES = []
CODE_FILES = []

def scan():
    for d in CSS_DIRS:
        if not d.exists():
            continue
        for p in d.rglob('*.css'):
            if any(part in IGNORE_DIRS for part in p.parts):
                continue
            CSS_FILES.append(p)
    for d in CODE_DIRS:
        if not d.exists():
            continue
        for p in d.rglob('*'):
            if any(part in IGNORE_DIRS for part in p.parts):
                continue
            if p.suffix in {'.html', '.tsx', '.ts', '.jsx', '.js'}:
                CODE_FILES.append(p)

def extract_css():
    class_defs = defaultdict(lambda: {'files': set(), 'selectors': [], 'keyframes': []})
    keyframes = defaultdict(lambda: {'files': set(), 'count': 0})
    all_classes = set()
    for css in CSS_FILES:
        text = css.read_text(encoding='utf-8', errors='ignore')
        # find keyframes
        for m in KEYFRAMES_RE.finditer(text):
            k = m.group(1)
            keyframes[k]['files'].add(str(css.relative_to(ROOT)))
            keyframes[k]['count'] += 1
        # simple extraction of class-like tokens and surrounding selector block
        for m in CLASS_RE.finditer(text):
            cls = m.group(1)
            all_classes.add(cls)
            class_defs[cls]['files'].add(str(css.relative_to(ROOT)))
            # capture selector line for context
            start = max(0, text.rfind('\n', 0, m.start()))
            end = text.find('\n', m.end())
            selector = text[start:end].strip()
            if selector and len(selector) < 240:
                class_defs[cls]['selectors'].append((str(css.relative_to(ROOT)), selector))
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
                # context line
                line_start = max(0, text.rfind('\n', 0, m.start()))
                line_end = text.find('\n', m.end())
                line = text[line_start:line_end].strip()
                if len(line) < 240:
                    usage[cls]['contexts'].append((str(f.relative_to(ROOT)), line))
    return usage

def main():
    scan()
    class_defs, keyframes = extract_css()
    usage = extract_usage()
    all_classes = set(class_defs.keys()) | set(usage.keys())

    # summary stats
    used = {c for c in all_classes if usage.get(c, {}).get('count', 0) > 0}
    defined = {c for c in all_classes if class_defs.get(c, {}).get('files')}
    unused = defined - used
    broken = used - defined
    dupe_kfs = [k for k, v in keyframes.items() if v['count'] > 1]

    # Write 00 summary
    with open(OUT_DIR / '00-effects-summary.md', 'w', encoding='utf-8') as f:
        f.write('# SYNTHOMA Effects Audit Summary\n\n')
        f.write(f'- Audit date: {datetime.now().isoformat()}\n')
        f.write(f'- CSS files scanned: {len(CSS_FILES)}\n')
        f.write(f'- Code/HTML files scanned: {len(CODE_FILES)}\n')
        f.write(f'- Unique class-like tokens found: {len(all_classes)}\n')
        f.write(f'- Defined in CSS: {len(defined)}\n')
        f.write(f'- Used in content/components: {len(used)}\n')
        f.write(f'- Defined but unused: {len(unused)}\n')
        f.write(f'- Used but not defined in CSS (broken/unknown): {len(broken)}\n')
        f.write(f'- @keyframes found: {len(keyframes)}\n')
        f.write(f'- Duplicate keyframe names: {len(dupe_kfs)}\n')
        f.write('\n## Broken/unknown classes (used but not defined)\n\n')
        for c in sorted(broken):
            files = ', '.join(sorted(usage[c]['files']))
            f.write(f'- `.{c}` — used {usage[c]["count"]}× in {files}\n')
        f.write('\n## Defined but unused classes\n\n')
        for c in sorted(unused):
            files = ', '.join(sorted(class_defs[c]['files']))
            f.write(f'- `.{c}` — defined in {files}\n')

    # Write 01 catalog
    with open(OUT_DIR / '01-effects-catalog.md', 'w', encoding='utf-8') as f:
        f.write('# SYNTHOMA Effects Catalog\n\n')
        for c in sorted(all_classes):
            d = class_defs.get(c, {})
            u = usage.get(c, {})
            f.write(f'## `.{c}`\n\n')
            f.write(f'**Defined in:** {", ".join(sorted(d.get("files", set()))) or "_not found_"}\n\n')
            f.write(f'**Used in:** {len(u.get("files", set()))} files, {u.get("count", 0)} occurrences\n\n')
            if u.get('files'):
                for fl in sorted(u['files'])[:10]:
                    f.write(f'- `{fl}`\n')
            if d.get('selectors'):
                f.write('\n**Selectors (sample):**\n')
                for fl, sel in d['selectors'][:5]:
                    f.write(f'- `{fl}`: `{sel}`\n')
            f.write('\n---\n\n')

    # Write 02 chapter matrix CSV
    chapters = [p for p in CODE_FILES if p.suffix == '.html']
    with open(OUT_DIR / '02-chapter-effects-matrix.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['book', 'chapter_file', 'classes_used', 'usage_json'])
        for ch in chapters:
            text = ch.read_text(encoding='utf-8', errors='ignore')
            classes = set()
            for m in CLASS_ATTR_RE.finditer(text):
                classes.update(m.group(1).split())
            rel = str(ch.relative_to(ROOT))
            parts = rel.split('/')
            book = parts[2] if len(parts) > 2 and parts[1] == 'books' else ''
            w.writerow([book, rel, ' '.join(sorted(classes)), json.dumps(sorted(classes))])

    # Write 04 animations
    with open(OUT_DIR / '04-animation-and-keyframes.md', 'w', encoding='utf-8') as f:
        f.write('# Animations & Keyframes\n\n')
        f.write(f'Total keyframes: {len(keyframes)}\n\n')
        f.write('## Duplicate keyframes\n\n')
        for k in sorted(dupe_kfs):
            files = ', '.join(sorted(keyframes[k]['files']))
            f.write(f'- `{k}` appears {keyframes[k]["count"]}× in {files}\n')
        f.write('\n## All keyframes\n\n')
        for k in sorted(keyframes.keys()):
            files = ', '.join(sorted(keyframes[k]['files']))
            f.write(f'- `{k}` — {files}\n')

    # Write 05 unused & broken
    with open(OUT_DIR / '05-unused-and-broken-effects.md', 'w', encoding='utf-8') as f:
        f.write('# Unused and Broken Effects\n\n')
        f.write('## Used but not defined (likely broken / typos)\n\n')
        for c in sorted(broken):
            f.write(f'- `.{c}` — {usage[c]["count"]} uses: {", ".join(sorted(usage[c]["files"]))}\n')
        f.write('\n## Defined but not used\n\n')
        for c in sorted(unused):
            f.write(f'- `.{c}` — defined in: {", ".join(sorted(class_defs[c]["files"]))}\n')

    # Console stats
    print(f'CSS files: {len(CSS_FILES)}')
    print(f'Code files: {len(CODE_FILES)}')
    print(f'Unique classes: {len(all_classes)}')
    print(f'Defined: {len(defined)}')
    print(f'Used: {len(used)}')
    print(f'Unused: {len(unused)}')
    print(f'Broken: {len(broken)}')
    print(f'Keyframes: {len(keyframes)}')
    print(f'Duplicate keyframes: {len(dupe_kfs)}')
    print(f'Output: {OUT_DIR}')

if __name__ == '__main__':
    main()
