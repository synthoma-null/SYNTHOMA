import re
p = r'C:\SYNTHOMA\apps\web\src\styles\components.css'
with open(p, 'r', encoding='utf-8') as f:
    t = f.read()

# Remove the canonical-but-duplicate .fx-outline block from TEXT EFFECTS section
outline_start = t.find('  /* Outline effect (stroke + glow). Combine with .is-lit for extra glow. */')
if outline_start != -1:
    # find start of next effect comment
    next_eff = t.find('  /* Echo ghost', outline_start)
    if next_eff == -1:
        next_eff = t.find('\n  .echo-ghost', outline_start)
    if next_eff != -1:
        t = t[:outline_start] + '\n' + t[next_eff:]
        print('removed outline block')
    else:
        print('outline next not found')
else:
    print('outline start not found')

# Remove the duplicate .fx-scanline block if present
scan_start = t.find('  /* Scanline overlay effect */')
if scan_start != -1:
    next_after_scan = t.find('\n  #glitch-name', scan_start)
    if next_after_scan != -1:
        t = t[:scan_start] + '\n' + t[next_after_scan:]
        print('removed scanline block')
    else:
        print('scanline next not found')
else:
    print('scanline start not found')

with open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write(t)
print('saved')
