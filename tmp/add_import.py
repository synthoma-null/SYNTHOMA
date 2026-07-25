import re
p = r'C:\SYNTHOMA\apps\web\app\layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    t = f.read()
t = re.sub(
    r'(import "\.\./src/styles/base\.css";\n)(import "\.\./src/styles/components\.css";)',
    r'\1import "../src/styles/effects-primitives.css";\n\2',
    t
)
with open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write(t)
print('done')
