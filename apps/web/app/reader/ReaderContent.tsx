"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ChoiceItem {
  text: string;
  tags: string[]; // e.g. ["E","I"]
}

interface BlockChoices {
  type: "choices";
  items: ChoiceItem[];
}

type Block = BlockChoices | { type: string; [key: string]: any };

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

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="animate-pulse text-2xl">Příprava obsahu...</div>
    </div>
  );
}

// Main content component
export default function ReaderContent() {
  const params = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const effectiveUrl = params?.get("u") || defaultUrl;

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<Scores>({ I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 });
  const [ttsOn, setTtsOn] = useState(false);
  const [nextHref, setNextHref] = useState<string | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const ttsSpeakingRef = useRef(false);
  const ttsIndexRef = useRef(0);

  // Load chapter content
  useEffect(() => {
    const loadChapter = async () => {
      try {
        const response = await fetch(`/data${effectiveUrl}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Parse blocks from HTML
        const parsedBlocks: Block[] = [];
        // ... (your block parsing logic here)
        
        setBlocks(parsedBlocks);
      } catch (error) {
        console.error('Error loading chapter:', error);
      }
    };

    loadChapter();
  }, [effectiveUrl]);

  // TTS logic
  const speakTTS = () => {
    // ... (your TTS logic here)
  };

  const stopTTS = () => {
    try { synthRef.current?.cancel(); } catch {}
    ttsSpeakingRef.current = false;
  };

  // Navigation
  const go = (delta: number) => {
    setI(prev => Math.max(0, Math.min(prev + delta, blocks.length - 1)));
  };

  // Handle choice selection
  const onPick = (item: ChoiceItem, blockIdx: number) => {
    // ... (your choice handling logic here)
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Escape') stopTTS();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blocks.length]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopTTS();
    };
  }, []);

  // Render current block
  const renderBlock = (block: Block, idx: number) => {
    switch (block.type) {
      case 'choices':
        return (
          <div key={idx} className="choices">
            {block.items.map((item, i) => (
              <button 
                key={i}
                className="choice"
                onClick={() => onPick(item, idx)}
              >
                {item.text}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div 
            key={idx} 
            className="text-block" 
            dangerouslySetInnerHTML={{ __html: (block as any).html || '' }}
          />
        );
    }
  };

  return (
    <div className="reader-container">
      <div className="reader-header">
        <h1>SYNTHOMA Reader</h1>
        <div className="controls">
          <button onClick={() => go(-1)} disabled={i <= 0}>
            ← Předchozí
          </button>
          <button onClick={() => setTtsOn(!ttsOn)}>
            {ttsOn ? '⏹️ Zastavit čtení' : '▶️ Přehrát'}
          </button>
          <button onClick={() => go(1)} disabled={i >= blocks.length - 1}>
            Další →
          </button>
        </div>
      </div>
      
      <div className="reader-content">
        {blocks.slice(0, i + 1).map((block, idx) => (
          <div key={idx} className={idx === i ? 'current-block' : 'previous-block'}>
            {renderBlock(block, idx)}
          </div>
        ))}
      </div>
      
      {nextHref && i >= blocks.length - 1 && (
        <div className="next-chapter">
          <a href={nextHref} className="next-chapter-btn">
            Pokračovat v příští kapitole →
          </a>
        </div>
      )}
    </div>
  );
}
