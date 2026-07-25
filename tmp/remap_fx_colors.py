import re, pathlib

repls = [
    ('var(--accent-secondary, #0ff)', 'var(--fx-memory-primary)'),
    ('var(--accent-primary, #f0f)', 'var(--fx-memory-secondary)'),
    ('var(--accent-error, #ff1744)', 'var(--fx-danger)'),
    ('var(--accent-warning, #ffea00)', 'var(--fx-warning)'),
    ('var(--text-primary, #f2f2f2)', 'var(--fx-silence)'),
]

files = [
    r'C:\SYNTHOMA\apps\web\src\styles\effects-semantic.css',
    r'C:\SYNTHOMA\apps\web\src\styles\effects-books\null.css',
    r'C:\SYNTHOMA\apps\web\src\styles\effects-books\konec-podpory.css',
    r'C:\SYNTHOMA\apps\web\src\styles\effects-books\neon-0.css',
    r'C:\SYNTHOMA\apps\web\src\styles\effects-atmosphere.css',
]

for f in files:
    t = pathlib.Path(f).read_text(encoding='utf-8')
    for old, new in repls:
        t = t.replace(old, new)
    pathlib.Path(f).write_text(t, encoding='utf-8', newline='\n')
    print(f, 'ok')
