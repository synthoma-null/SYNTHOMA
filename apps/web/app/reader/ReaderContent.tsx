"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ReaderContent.module.css";

interface ChoiceItem {
  text: string;
  tags: string[];
  href?: string;
}

interface BlockText {
  type: 'text';
  content: string;
}

interface BlockTitle {
  type: 'title';
  content: string;
}

interface BlockChoices {
  type: 'choices';
  items: ChoiceItem[];
}

type Block = BlockText | BlockTitle | BlockChoices;

interface Scores {
  I: number;
  E: number;
  N: number;
  S: number;
  F: number;
  T: number;
  J: number;
  P: number;
}

interface BackgroundSettings {
  image: string;
  color: string;
  opacity: number;
  blur: number;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="animate-pulse text-2xl">Příprava obsahu...</div>
    </div>
  );
}

export default function ReaderContent() {
  const params = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const effectiveUrl = params?.get("u") || defaultUrl;

  // State management
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [scores, setScores] = useState<Scores>({ 
    I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 
  });
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  const [background, setBackground] = useState<BackgroundSettings>({
    image: '',
    color: '#1f2937',
    opacity: 0.9,
    blur: 0
  });
  
  const contentRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const ttsSpeakingRef = useRef(false);
  
  const handleBackgroundChange = (property: keyof BackgroundSettings, value: string | number) => {
    setBackground(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const backgroundStyle = {
    backgroundImage: background.image ? `url(${background.image})` : 'none',
    backgroundColor: background.color,
    opacity: background.opacity,
    filter: background.blur > 0 ? `blur(${background.blur}px)` : 'none',
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    
    // Clean up speech synthesis on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Scroll to top when content loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blocks]);

  // Load chapter content
  useEffect(() => {
    const loadChapter = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(effectiveUrl.startsWith('/') ? effectiveUrl : `/${effectiveUrl}`);
        
        if (!response.ok) {
          throw new Error(`Nepodařilo se načíst kapitolu: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Parse blocks from HTML
        const parsedBlocks: Block[] = [];
        
        // Find all elements that are direct children of body
        const elements = Array.from(doc.body.children);
        
        let currentTextBlock: string[] = [];
        
        const flushTextBlock = () => {
          if (currentTextBlock.length > 0) {
            const block: BlockText = {
              type: 'text',
              content: currentTextBlock.join('\n')
            };
            parsedBlocks.push(block);
            currentTextBlock = [];
          }
        };
        
        for (const element of elements) {
          if (element.classList.contains('choice')) {
            // Flush any pending text block
            flushTextBlock();
            
            // Add choice block
            const choiceBlock: BlockChoices = {
              type: 'choices',
              items: [{
                text: element.textContent?.trim() || '',
                tags: element.getAttribute('data-tags')?.split(',').map(t => t.trim()).filter(Boolean) || []
              }]
            };
            parsedBlocks.push(choiceBlock);
          } else if (element.classList.contains('text') || 
                    element.classList.contains('dialog') ||
                    element.tagName === 'P') {
            // Add to current text block
            currentTextBlock.push(element.outerHTML);
          } else if (element.classList.contains('log')) {
            // Skip log messages
            continue;
          } else if (element.classList.contains('title') || 
                    element.tagName.match(/^H[1-6]$/i)) {
            // Flush current text block and add title as separate block
            flushTextBlock();
            const titleBlock: BlockTitle = {
              type: 'title',
              content: element.outerHTML
            };
            parsedBlocks.push(titleBlock);
          } else {
            // For any other element, add to current text block
            currentTextBlock.push(element.outerHTML);
          }
        }
        
        // Flush any remaining text
        flushTextBlock();
        
        setBlocks(parsedBlocks);
        setError(null);
      } catch (err) {
        console.error('Error loading chapter:', err);
        setError(err instanceof Error ? err.message : 'Neznámá chyba při načítání kapitoly');
      } finally {
        setIsLoading(false);
      }
    };

    loadChapter();
  }, [effectiveUrl]);

  // Handle back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // TTS logic
  const speakTTS = (text: string) => {
    if (!synthRef.current) return;
    
    stopTTS();
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'cs-CZ';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        ttsSpeakingRef.current = false;
      };
      
      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        ttsSpeakingRef.current = false;
      };
      
      synthRef.current.speak(utterance);
      ttsSpeakingRef.current = true;
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      ttsSpeakingRef.current = false;
    }
  };

  const stopTTS = () => {
    try { synthRef.current?.cancel(); } catch {}
    ttsSpeakingRef.current = false;
  };

  // Handle choice selection
  const handleChoice = (choice: ChoiceItem) => {
    if (choice.href) {
      // Update URL without page reload
      window.history.pushState({}, '', `/reader?u=${encodeURIComponent(choice.href)}`);
      
      // Scroll to top when making a choice
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Load new content
      const loadContent = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch(choice.href.startsWith('/') ? choice.href : `/${choice.href}`);
          
          if (!response.ok) {
            throw new Error(`Nepodařilo se načíst kapitolu: ${response.status} ${response.statusText}`);
          }
          
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Parse blocks from HTML
          const parsedBlocks: Block[] = [];
          
          // Find all elements that are direct children of body
          const elements = Array.from(doc.body.children);
          
          let currentTextBlock: string[] = [];
          
          const flushTextBlock = () => {
            if (currentTextBlock.length > 0) {
              const block: BlockText = {
                type: 'text',
                content: currentTextBlock.join('\n')
              };
              parsedBlocks.push(block);
              currentTextBlock = [];
            }
          };
          
          for (const element of elements) {
            if (element.classList.contains('choice')) {
              // Flush any pending text block
              flushTextBlock();
              
              // Add choice block
              const choiceBlock: BlockChoices = {
                type: 'choices',
                items: [{
                  text: element.textContent?.trim() || '',
                  tags: element.getAttribute('data-tags')?.split(',').map(t => t.trim()).filter(Boolean) || []
                }]
              };
              parsedBlocks.push(choiceBlock);
            } else if (element.classList.contains('text') || 
                      element.classList.contains('dialog') ||
                      element.tagName === 'P') {
              // Add to current text block
              currentTextBlock.push(element.outerHTML);
            } else if (element.classList.contains('log')) {
              // Skip log messages
              continue;
            } else if (element.classList.contains('title') || 
                      element.tagName.match(/^H[1-6]$/i)) {
              // Flush current text block and add title as separate block
              flushTextBlock();
              const titleBlock: BlockTitle = {
                type: 'title',
                content: element.outerHTML
              };
              parsedBlocks.push(titleBlock);
            } else {
              // For any other element, add to current text block
              currentTextBlock.push(element.outerHTML);
            }
          }
          
          // Flush any remaining text
          flushTextBlock();
          
          setBlocks(parsedBlocks);
          setError(null);
        } catch (err) {
          console.error('Error loading chapter:', err);
          setError(err instanceof Error ? err.message : 'Neznámá chyba při načítání kapitoly');
        } finally {
          setIsLoading(false);
        }
      };
      loadContent();
      
      // Update scores based on choice tags
      const newScores = { ...scores };
      choice.tags?.forEach(tag => {
        if (tag in newScores) {
          newScores[tag as keyof Scores]++;
        }
      });
      setScores(newScores);
    }
  };

  // Keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or textareas
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          // go(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          // go(1);
          break;
        case 'Escape':
          e.preventDefault();
          if (ttsSpeakingRef.current) {
            stopTTS();
          }
          break;
        case ' ':
        case 'Spacebar':
          // Toggle play/pause with space, but not when focused on a button
          if (document.activeElement?.tagName !== 'BUTTON') {
            e.preventDefault();
            if (ttsSpeakingRef.current) {
              stopTTS();
            } else {
              // setTtsOn(true);
              if (blocks[0]?.type === 'text') {
                const text = new DOMParser()
                  .parseFromString(blocks[0].content, 'text/html')
                  .body.textContent || '';
                speakTTS(text);
              }
            }
          }
          break;
        case 'm':
        case 'M':
          // Toggle dark/light mode with 'm' key
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            document.documentElement.classList.toggle('dark');
          }
          break;
        case '?':
          // Toggle help with '?' key
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      // Show help on first visit
      const hasSeenHelp = localStorage.getItem('hasSeenReaderHelp');
      if (!hasSeenHelp) {
        setShowHelp(true);
        localStorage.setItem('hasSeenReaderHelp', 'true');
      }
    }
  }, []);

  // Render background control panel
  const renderBackgroundPanel = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setShowBackgroundPanel(!showBackgroundPanel)}
        className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-full shadow-lg"
        aria-label="Nastavení pozadí"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>
      
      {showBackgroundPanel && (
        <div className="absolute bottom-full right-0 mb-4 w-72 bg-neutral-800/90 backdrop-blur-sm rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-bold mb-4">Nastavení pozadí</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Všechny volby se zobrazují najednou. Přejděte dolů pro další možnosti.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Barva pozadí</label>
              <input 
                type="color" 
                value={background.color}
                onChange={(e) => handleBackgroundChange('color', e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Průhlednost: {Math.round(background.opacity * 100)}%
              </label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={background.opacity}
                onChange={(e) => handleBackgroundChange('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Rozmazání: {background.blur}px
              </label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1"
                value={background.blur}
                onChange={(e) => handleBackgroundChange('blur', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Obrázek (URL)</label>
              <input 
                type="text" 
                value={background.image}
                onChange={(e) => handleBackgroundChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 rounded bg-neutral-700 text-white text-sm"
              />
            </div>
            
            <button 
              onClick={() => setShowBackgroundPanel(false)}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Hotovo
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render content blocks
  const renderContent = () => {
    if (isLoading) {
      return <LoadingFallback />;
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-500">
          <p>Chyba při načítání obsahu: {error}</p>
        </div>
      );
    }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return (
              <div 
                key={index} 
                className="text-gray-100 mb-6 leading-relaxed animate-fade-in"
                dangerouslySetInnerHTML={{ __html: block.content }} 
              />
            );
          case 'title':
            return (
              <h2 
                key={index}
                className="text-3xl font-bold text-blue-400 my-8 animate-fade-in"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            );
          case 'choices':
            return (
              <div key={index} className="my-8 space-y-4 animate-fade-in">
                {block.items.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href ? `/reader?u=${encodeURIComponent(item.href)}` : '#'}
                    className="block p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-lg"
                    onClick={(e) => {
                      if (!item.href) e.preventDefault();
                      handleChoice(item);
                    }}
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

// ...

return (
  <div className="min-h-screen text-gray-100 p-4 md:p-8 relative" style={backgroundStyle}>
    {renderBackgroundPanel()}
    
    <div className="max-w-4xl mx-auto bg-neutral-800/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">SYNTHOMA Reader</h1>
          <button 
            onClick={() => setShowHelp(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Zobrazit nápovědu"
            title="Zobrazit nápovědu (klávesa ?)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
        
        {/* Footer */}
        <div className="bg-neutral-900 p-4 border-t border-neutral-700 text-sm text-gray-400 text-center">
          <p>SYNTHOMA {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
);
}
