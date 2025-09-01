"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ChoiceItem {
  text: string;
  tags: string[]; // e.g. ["E","I"]
}

interface BlockText { type: "text"; tag: string; html: string; }
interface BlockChoices { type: "choices"; items: ChoiceItem[]; }

type Block = BlockText | BlockChoices;
type Scores = { I: number; E: number; N: number; S: number; F: number; T: number; J: number; P: number };

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="animate-pulse text-2xl">Načítání čtečky...</div>
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
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const ttsIndexRef = useRef<number>(0);
  const ttsSpeakingRef = useRef<boolean>(false);
  
  // Per-chapter media
  const [chapterVideo, setChapterVideo] = useState<string | undefined>(undefined);
  const [chapterAudio, setChapterAudio] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Navigation to next chapter
  const [nextHref, setNextHref] = useState<string | undefined>(undefined);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Load chapter content
  useEffect(() => {
    let canceled = false;
    
    const loadChapter = async () => {
      try {
        const res = await fetch(encodeURI(effectiveUrl));
        const txt = await res.text();
        if (canceled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, 'text/html');
        
        // Extract media metadata
        const videoMeta = doc.querySelector('meta[property="og:video"]');
        const audioMeta = doc.querySelector('meta[property="og:audio"]');
        const nextLink = doc.querySelector('link[rel="next"]');
        
        setChapterVideo(videoMeta?.getAttribute('content') || undefined);
        setChapterAudio(audioMeta?.getAttribute('content') || undefined);
        setNextHref(nextLink?.getAttribute('href') || undefined);

        // Process content
        const content = doc.querySelector('.chapter-content');
        if (!content) {
          console.error('No .chapter-content found');
          return;
        }

        // Process content into blocks
        const newBlocks: Block[] = [];
        let currentText = '';
        let currentTag = 'p';

        const processNode = (node: ChildNode) => {
          // Skip script/style/iframe elements
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (['SCRIPT', 'STYLE', 'IFRAME', 'NOSCRIPT'].includes(el.tagName)) {
              return;
            }

            // Handle choice buttons
            if (el.classList.contains('choice-button')) {
              // Save any accumulated text
              if (currentText.trim()) {
                newBlocks.push({
                  type: 'text',
                  tag: currentTag,
                  html: currentText.trim()
                });
                currentText = '';
              }

              // Add choice
              const choiceText = el.textContent?.trim() || '';
              const tags = Array.from(el.classList)
                .filter(cls => ['E', 'I', 'N', 'S', 'F', 'T', 'J', 'P'].includes(cls));
              
              newBlocks.push({
                type: 'choices',
                items: [{
                  text: choiceText,
                  tags
                }]
              });
              return;
            }

            // Handle headers
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
              if (currentText.trim()) {
                newBlocks.push({
                  type: 'text',
                  tag: currentTag,
                  html: currentText.trim()
                });
                currentText = '';
              }
              currentTag = el.tagName.toLowerCase();
            }
          }

          // Process child nodes
          if (node.hasChildNodes()) {
            node.childNodes.forEach(processNode);
          } else if (node.nodeType === Node.TEXT_NODE) {
            currentText += node.textContent || '';
          }
        };

        content.childNodes.forEach(processNode);

        // Add any remaining text
        if (currentText.trim()) {
          newBlocks.push({
            type: 'text',
            tag: currentTag,
            html: currentText.trim()
          });
        }

        setBlocks(newBlocks);
        setI(0);
        ttsIndexRef.current = 0;
      } catch (err) {
        console.error('Error loading chapter:', err);
      }
    };

    loadChapter();

    return () => {
      canceled = true;
      // Stop any ongoing speech
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, [effectiveUrl]);

  // Auto-play video/audio when they load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn('Video autoplay failed:', e));
    }
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Audio autoplay failed:', e));
    }
  }, [chapterVideo, chapterAudio]);

  // TTS functionality
  useEffect(() => {
    if (!ttsOn || !synthRef.current || blocks.length === 0 || i >= blocks.length) return;

    const block = blocks[i];
    if (block.type !== 'text') return;

    const text = block.html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'cs-CZ';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        ttsIndexRef.current = event.charIndex;
      }
    };

    utterance.onend = () => {
      ttsSpeakingRef.current = false;
      // Auto-advance to next block after a short delay
      setTimeout(() => {
        if (i < blocks.length - 1) {
          setI(i + 1);
        }
      }, 500);
    };

    ttsSpeakingRef.current = true;
    synthRef.current.speak(utterance);

    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, [ttsOn, blocks, i]);

  // Clean up TTS on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Pause TTS when component is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && synthRef.current?.speaking) {
        synthRef.current.pause();
      } else if (!document.hidden && synthRef.current?.paused) {
        synthRef.current.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          if (i < blocks.length - 1) {
            setI(i + 1);
            e.preventDefault();
          }
          break;
        case 'ArrowLeft':
          if (i > 0) {
            setI(i - 1);
            e.preventDefault();
          }
          break;
        case 't':
          setTtsOn(!ttsOn);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [i, blocks.length, ttsOn]);

  // Calculate MBTI score percentages
  const totalResponses = Object.values(scores).reduce((a, b) => a + Math.abs(b), 0) || 1;
  const scorePercentages = useMemo(() => ({
    I: Math.round((scores.I / totalResponses) * 100) || 0,
    E: Math.round((scores.E / totalResponses) * 100) || 0,
    N: Math.round((scores.N / totalResponses) * 100) || 0,
    S: Math.round((scores.S / totalResponses) * 100) || 0,
    F: Math.round((scores.F / totalResponses) * 100) || 0,
    T: Math.round((scores.T / totalResponses) * 100) || 0,
    J: Math.round((scores.J / totalResponses) * 100) || 0,
    P: Math.round((scores.P / totalResponses) * 100) || 0,
  }), [scores, totalResponses]);

  // Determine MBTI type
  const mbtiType = useMemo(() => {
    const type = [
      scores.I > scores.E ? 'I' : 'E',
      scores.N > scores.S ? 'N' : 'S',
      scores.F > scores.T ? 'F' : 'T',
      scores.J > scores.P ? 'J' : 'P'
    ].join('');

    const confidence = [
      Math.abs(scorePercentages.I - scorePercentages.E),
      Math.abs(scorePercentages.N - scorePercentages.S),
      Math.abs(scorePercentages.F - scorePercentages.T),
      Math.abs(scorePercentages.J - scorePercentages.P)
    ].reduce((a, b) => a + b, 0) / 4;

    return { type, confidence: Math.round(confidence) };
  }, [scores, scorePercentages]);

  // Get type description (simplified)
  const typeDescription = useMemo(() => {
    const descriptions: Record<string, string> = {
      INTJ: 'Architekt - Strategický myslitel s plánem na všechno',
      INTP: 'Logik - Inovativní vynálezce s neukojitelnou chutí po znalostech',
      ENTJ: 'Velitel - Odvážný, představivostí obdařený a silně vůdčí osobnost',
      ENTP: 'Dohadovač - Chytrý a zvídavý myslitel, který miluje intelektuální výzvy',
      // Add more types as needed
    };
    return descriptions[mbtiType.type] || `Typ ${mbtiType.type} - ${mbtiType.confidence}% jistota`;
  }, [mbtiType]);

  // Get color based on MBTI type
  const typeColor = useMemo(() => {
    const colors: Record<string, string> = {
      I: 'text-blue-400',
      E: 'text-yellow-400',
      N: 'text-purple-400',
      S: 'text-green-400',
      F: 'text-pink-400',
      T: 'text-orange-400',
      J: 'text-red-400',
      P: 'text-teal-400'
    };
    return mbtiType.type.split('').map(c => colors[c] || 'text-white').join(' ');
  }, [mbtiType]);

  // Get icon based on MBTI type
  const typeIcon = useMemo(() => {
    const icons: Record<string, string> = {
      I: '👤', E: '👥', N: '🔮', S: '👁️',
      F: '❤️', T: '🧠', J: '📅', P: '🔄'
    };
    return mbtiType.type.split('').map(c => icons[c] || '❓').join('');
  }, [mbtiType]);

  // Handle choice selection
  const handleChoice = (choice: ChoiceItem) => {
    // Update scores based on choice tags
    const newScores = { ...scores };
    choice.tags.forEach(tag => {
      if (tag in newScores) {
        // @ts-ignore - We know the tag is a valid key
        newScores[tag] += 1;
      }
    });
    setScores(newScores);

    // Auto-advance to next block if available
    if (i < blocks.length - 1) {
      setI(i + 1);
    } else if (nextHref) {
      // If this was the last block and there's a next chapter, navigate there
      window.location.href = `/reader?u=${encodeURIComponent(nextHref)}`;
    }
  };

  // Toggle TTS
  const toggleTts = () => {
    if (ttsOn && synthRef.current?.speaking) {
      synthRef.current.cancel();
    }
    setTtsOn(!ttsOn);
  };

  // Progress to next chapter
  const goToNextChapter = () => {
    if (nextHref) {
      window.location.href = `/reader?u=${encodeURIComponent(nextHref)}`;
    }
  };

  // Render current block
  const currentBlock = blocks[i];
  const isLastBlock = i === blocks.length - 1;
  const progress = blocks.length > 0 ? ((i + 1) / blocks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-900 text-white relative overflow-hidden">
      {/* Background video */}
      {chapterVideo && (
        <video
          ref={videoRef}
          src={chapterVideo}
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
          loop
          muted
          playsInline
        />
      )}

      {/* Background audio */}
      {chapterAudio && (
        <audio
          ref={audioRef}
          src={chapterAudio}
          loop
          className="hidden"
        />
      )}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress bar */}
        <div className="mb-6 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current block */}
        <div className="min-h-[50vh] flex flex-col justify-center">
          {currentBlock?.type === 'text' ? (
            <div 
              className="prose prose-invert max-w-none mb-8 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentBlock.html }}
            />
          ) : currentBlock?.type === 'choices' ? (
            <div className="space-y-3 mt-8">
              {currentBlock.items.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 bg-black bg-opacity-50 hover:bg-opacity-70 border border-gray-800 rounded-lg transition-all duration-200 hover:border-blue-500 hover:shadow-lg"
                >
                  {choice.text}
                  {choice.tags.length > 0 && (
                    <span className="ml-2 text-xs opacity-60">
                      {choice.tags.join(', ')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>Načítání obsahu...</p>
            </div>
          )}
        </div>

        {/* Navigation controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Předchozí
          </button>
          
          <button
            onClick={toggleTts}
            className={`p-2 rounded-full ${ttsOn ? 'bg-red-500' : 'bg-gray-700'}`}
            title={`Přehrát/pauznout (${ttsOn ? 'vypnout' : 'zapnout'})`}
          >
            {ttsOn ? '⏸️' : '▶️'}
          </button>
          
          {isLastBlock && nextHref ? (
            <button
              onClick={goToNextChapter}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Další kapitola →
            </button>
          ) : (
            <button
              onClick={() => setI(Math.min(blocks.length - 1, i + 1))}
              disabled={isLastBlock}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Další →
            </button>
          )}
        </div>
      <div className="reader-content">
        {/* Your content rendering logic */}
      </div>
    </div>
  );
}
