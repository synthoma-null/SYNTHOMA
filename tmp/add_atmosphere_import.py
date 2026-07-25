import re
p = r'C:\SYNTHOMA\apps\web\app\layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    t = f.read()
# insert after effects-semantic.css import
t = re.sub(
    r'(import "\.\./src/styles/effects-semantic\.css";\n)(import "\.\./src/styles/effects-books/null\.css";)',
    r'\1import "../src/styles/effects-atmosphere.css";\n\2',
    t
)
with open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write(t)
print('done')
