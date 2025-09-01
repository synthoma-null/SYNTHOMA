"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<BackgroundSettings>({
    image: '',
    color: '#1f2937',
    opacity: 0.9,
    blur: 0
  });
  
  const contentRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Load chapter content
  useEffect(() => {
    const loadChapter = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(effectiveUrl);
        if (!response.ok) throw new Error('Nepodařilo se načíst kapitolu');
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Parse content into blocks
        const parsedBlocks: Block[] = [];
        const contentElement = doc.querySelector('.content');
        
        if (contentElement) {
          contentElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              parsedBlocks.push({
                type: 'text',
                content: node.textContent.trim()
              });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.tagName === 'H1' || element.tagName === 'H2') {
                parsedBlocks.push({
                  type: 'title',
                  content: element.innerHTML
                });
              } else if (element.tagName === 'DIV' && element.classList.contains('choices')) {
                const choices = Array.from(element.querySelectorAll('a')).map(choice => ({
                  text: choice.innerHTML,
                  href: choice.getAttribute('href') || undefined,
                  tags: Array.from(choice.classList)
                }));
                parsedBlocks.push({
                  type: 'choices',
                  items: choices
                });
              } else if (element.innerHTML.trim()) {
                parsedBlocks.push({
                  type: 'text',
                  content: element.innerHTML
                });
              }
            }
          });
        }
        
        setBlocks(parsedBlocks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznámá chyba');
      } finally {
        setIsLoading(false);
      }
    };

    loadChapter();
  }, [effectiveUrl]);

  // Handle choice selection
  const handleChoice = (choice: ChoiceItem) => {
    if (choice.href) {
      window.history.pushState({}, '', `/reader?u=${encodeURIComponent(choice.href)}`);
      window.scrollTo(0, 0);
    }
  };

  // Render content blocks
  const renderContent = () => {
    if (isLoading) return <LoadingFallback />;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
      <div className="p-6 md:p-8 space-y-6">
        {blocks.map((block, index) => {
          switch (block.type) {
            case 'text':
              return (
                <div 
                  key={index}
                  className="text-gray-100 mb-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              );
            case 'title':
              return (
                <h2 
                  key={index}
                  className="text-3xl font-bold text-blue-400 my-8"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              );
            case 'choices':
              return (
                <div key={index} className="my-8 space-y-4">
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

  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8 relative" style={{
      backgroundImage: background.image ? `url(${background.image})` : 'none',
      backgroundColor: background.color,
      opacity: background.opacity,
      filter: background.blur > 0 ? `blur(${background.blur}px)` : 'none',
    }}>
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
        
        {/* Content */}
        {renderContent()}
        
        {/* Footer */}
        <div className="bg-neutral-900 p-4 border-t border-neutral-700 text-sm text-center text-gray-400">
          <p>SYNTHOMA {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
