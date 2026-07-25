import re
p = r'C:\SYNTHOMA\apps\web\src\styles\components.css'
with open(p, 'r', encoding='utf-8') as f:
    t = f.read()

# Remove old TEXT FX block (from comment through .fx-noise ending before .fx-uppercase-wide)
pattern = r"  /\* =+\n     TEXT FX \(utilities\) – sjednoceno, bez duplicit\.\n     =+\n     \*/\n"

# Safer: find start and end markers and replace with a short note
start = t.find('/* =========================\n     TEXT FX (utilities)')
if start == -1:
    print('start not found')
else:
    # find end of .fx-noise block - look for the next class definition that is not related
    end = t.find('\n  .fx-uppercase-wide', start)
    if end == -1:
        print('end not found')
    else:
        t = t[:start] + '  /* TEXT FX primitives moved to effects-primitives.css */\n' + t[end:]
        with open(p, 'w', encoding='utf-8', newline='\n') as f:
            f.write(t)
        print('removed old block')
