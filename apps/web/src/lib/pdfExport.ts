'use client';

/**
 * Static HTML Export utility for SYNTHOMA chapters.
 * Creates a standalone HTML file with all CSS effects preserved
 * exactly as they appear in the reader, with black background.
 */

export async function downloadChapterAsHtml(
  containerSelector: string,
  filename?: string
): Promise<void> {
  const container = document.querySelector(containerSelector) as HTMLElement | null;
  if (!container) {
    console.error('[htmlExport] Container not found:', containerSelector);
    return;
  }

  // Get the full chapter content from the original source URL
  const srcUrl = (container as any).__srcUrl || 
                 container.getAttribute('data-src-url') ||
                 new URL(window.location.href).searchParams.get('u') ||
                 '/books/SYNTHOMA-NULL/0-∞ [RESTART].html';
  
  let fullContent: string = '';
  
  try {
    // Fetch the complete chapter content
    const response = await fetch(srcUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.status}`);
    }
    fullContent = await response.text();
  } catch (error) {
    console.error('[htmlExport] Failed to fetch full content:', error);
    // Fallback to current container content
    fullContent = container.innerHTML;
  }

  // Show loading state
  const loadingMsg = document.createElement('div');
  loadingMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff00ff;
    color: #000;
    padding: 15px 20px;
    font-family: monospace;
    z-index: 9999;
    border: 2px solid #ff00ff;
    box-shadow: 0 0 20px #ff00ff;
  `;
  loadingMsg.textContent = '📄 Generování HTML...';
  document.body.appendChild(loadingMsg);

  try {
    // Create a temporary container for the full content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = fullContent;
    
    // Remove UI elements that shouldn't be in the static export
    const elementsToRemove = [
      // Left sidebar panels
      '.control-panel',
      '.panel',
      '.sidebar',
      // Choice buttons and interactive elements
      '.choice',
      '.choice-link',
      '.gateway-btn',
      '.btn',
      'button',
      // Navigation and controls
      '.navigation',
      '.controls',
      '.toolbar',
      // Debug elements
      '.debug-panel',
      '.debug',
      // Hidden elements that shouldn't be visible
      '.sr-only',
      '[aria-hidden="true"]'
    ];
    
    elementsToRemove.forEach(selector => {
      const elements = tempContainer.querySelectorAll(selector);
      elements.forEach((el: Element) => el.remove());
    });
    
    // Also remove elements with specific classes or attributes
    const additionalRemovals = tempContainer.querySelectorAll([
      '[class*="choice"]',
      '[class*="button"]',
      '[class*="control"]',
      '[class*="panel"]',
      '[class*="sidebar"]',
      '[role="button"]',
      '[role="navigation"]',
      '[role="toolbar"]'
    ].join(','));
    
    additionalRemovals.forEach((el: Element) => el.remove());
    
    // Get all CSS stylesheets
    const allStyles: string[] = [];
    
    // Get inline styles from style tags
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach(tag => {
      if (tag.textContent) {
        allStyles.push(tag.textContent);
      }
    });
    
    // Get CSS from stylesheets
    const styleSheets = Array.from(document.styleSheets);
    for (const sheet of styleSheets) {
      try {
        if (sheet.cssRules) {
          for (let i = 0; i < sheet.cssRules.length; i++) {
            const rule = sheet.cssRules[i];
            if (rule && rule.cssText) {
              allStyles.push(rule.cssText);
            }
          }
        }
      } catch (e) {
        // Skip cross-origin stylesheets
        console.warn('Skipping stylesheet due to CORS:', e);
      }
    }
    
    // Get computed styles for all elements
    const allElements = tempContainer.querySelectorAll('*');
    const elementStyles: { selector: string; styles: string }[] = [];
    
    allElements.forEach((el: Element, index: number) => {
      const computedStyle = getComputedStyle(el);
      const importantStyles: string[] = [];
      
      // Collect most important visual properties
      const properties = [
        'color', 'background', 'background-color', 'font-family', 'font-size',
        'font-weight', 'text-shadow', 'text-decoration', 'opacity',
        'display', 'position', 'margin', 'padding', 'border', 'width', 'height',
        'transform', 'animation', 'filter'
      ];
      
      properties.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'normal') {
          importantStyles.push(`${prop}: ${value}`);
        }
      });
      
      if (importantStyles.length > 0) {
        const className = `synthoma-el-${index}`;
        el.classList.add(className);
        elementStyles.push({
          selector: `.${className}`,
          styles: importantStyles.join('; ')
        });
      }
    });
    
    // Generate filename
    const chapterTitle =
      tempContainer.querySelector('h1, h2, .title')?.textContent?.trim() || 'chapter';
    const safeName = (filename || chapterTitle)
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF -]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 60);

    // Create complete HTML document
    const htmlContent = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYNTHOMA - ${chapterTitle}</title>
    <style>
        /* Base reset */
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 20px;
            background: #000000;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
            min-height: 100vh;
        }
        
        /* All collected styles */
        ${allStyles.join('\n\n')}
        
        /* Element-specific computed styles */
        ${elementStyles.map(({ selector, styles }) => 
            `${selector} { ${styles}; }`
        ).join('\n')}
        
        /* Ensure readability */
        .chapter-content {
            max-width: 800px;
            margin: 0 auto;
            background: #000000;
            padding: 40px;
            border-radius: 8px;
        }
        
        /* Preserve glitch effects */
        .glitch-fake1, .glitch-fake2 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            z-index: -1;
        }
        
        .glitch-fake1 {
            color: #ff00ff;
            transform: translateX(-2px);
        }
        
        .glitch-fake2 {
            color: #00b6f1;
            transform: translateX(2px);
        }
        
        /* Remove neon blocks and panels from export */
        .chapter-content {
            padding-left: 0 !important;
        }
        
        .chapter-content .text,
        .chapter-content .textV,
        .chapter-content .textN,
        .chapter-content .log,
        .chapter-content .dialog,
        .chapter-content .dialogS,
        .chapter-content .dialogN,
        .chapter-content .dialogG,
        .chapter-content .title {
            margin-left: 0 !important;
            padding-left: 1.5rem !important;
            line-height: 1.35;
            box-sizing: border-box;
            border-left: none !important;
            text-shadow: none !important;
            left: 0 !important;
        }
        
        /* Remove all pseudo-elements that create glowing blocks */
        .chapter-content .text::before,
        .chapter-content .textV::before,
        .chapter-content .textN::before,
        .chapter-content .log::before,
        .chapter-content .dialog::before,
        .chapter-content .dialogS::before,
        .chapter-content .dialogN::before,
        .chapter-content .dialogG::before,
        .chapter-content .title::before,
        .chapter-content .text::after,
        .chapter-content .textV::after,
        .chapter-content .textN::after,
        .chapter-content .log::after,
        .chapter-content .dialog::after,
        .chapter-content .dialogS::after,
        .chapter-content .dialogN::after,
        .chapter-content .dialogG::after,
        .chapter-content .title::after {
            display: none !important;
            content: none !important;
        }
        
        /* Neon effects preservation */
        .fx-neon,
        .neon-blood {
            padding-left: 0.12em;
        }
        
        .neon-word {
            display: inline-flex;
            gap: 0.02em;
            letter-spacing: 0;
            align-items: baseline;
        }
        
        .neon-word > .neon-char {
            display: inline-block;
            margin-right: 0;
        }
        
        .neon-word > .neon-char.flickering-off {
            margin-right: 0.18em;
        }
        
        /* Print styles */
        @media print {
            body {
                background: white !important;
                color: black !important;
            }
            
            .glitch-fake1, .glitch-fake2 {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="chapter-content">
        ${tempContainer.innerHTML}
    </div>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SYNTHOMA_${safeName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Update loading message
    loadingMsg.textContent = '✅ HTML uloženo!';
    setTimeout(() => {
      document.body.removeChild(loadingMsg);
    }, 2000);
    
  } catch (error) {
    console.error('[HTML Export] Error:', error);
    
    // Update loading message with error
    loadingMsg.style.background = '#ff0000';
    loadingMsg.style.borderColor = '#ff0000';
    loadingMsg.style.boxShadow = '0 0 20px #ff0000';
    loadingMsg.textContent = `❌ Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
    
    setTimeout(() => {
      document.body.removeChild(loadingMsg);
    }, 5000);
  }
}
