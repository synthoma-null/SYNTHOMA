import re
p = r'C:\SYNTHOMA\apps\web\src\styles\components.css'
with open(p, 'r', encoding='utf-8') as f:
    t = f.read()

# Remove the .fx-glitch block from components.css since it's now in effects-primitives
start = t.find('\n  .fx-glitch {')
if start != -1:
    # find the start of the next block/comment after this one
    next_block = t.find('\n  .', start + 1)
    if next_block == -1:
        next_block = len(t)
    t = t[:start] + '\n' + t[next_block:]
    print('removed fx-glitch block')
else:
    print('fx-glitch block not found')

with open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write(t)
print('saved')
