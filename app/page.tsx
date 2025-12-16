"use client";

import { useState, useRef } from "react";
import { deck, TarotCard } from "@/utils/tarotDeck";
import { getTarotReading } from "./actions";
import ReactMarkdown from "react-markdown";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

export default function Home() {
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // 抽牌逻辑
  function drawThreeCards() {
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  // 处理点击开始
  async function handleDraw() {
    if (!question.trim()) return;
    setLoading(true);
    setOutput("");
    const cards = drawThreeCards();
    setDrawnCards(cards);

    const reading = await getTarotReading(question, cards);
    setOutput(reading);
    setLoading(false);
  }

  // 处理分享图片
  const handleShareBtnClick = async () => {
    if (resultRef.current === null) return;
    setIsCapturing(true);

    try {
      setTimeout(async () => {
          const dataUrl = await toPng(resultRef.current!, { 
              cacheBust: true, 
              backgroundColor: '#1a1a1a',
              style: { maxHeight: 'none', overflow: 'visible' }
          });
          const fileName = `tarot-reading-${new Date().toISOString().slice(0, 10)}.png`;
          saveAs(dataUrl, fileName);
          setIsCapturing(false);
      }, 500);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setIsCapturing(false);
      alert("Failed to generate image. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Deep Tarot
        </h1>
        <p className="text-gray-400 mt-2 tracking-wide">
          Dialogue with the Subconscious
        </p>
      </header>

      {/* Input Section */}
      <section className="w-full max-w-md flex flex-col gap-3 mb-8 z-10 relative">
        <textarea
          className="w-full p-4 rounded-lg bg-[#2a2a2a] border border-gray-700 focus:border-purple-500 outline-none resize-none text-base transition-colors"
          rows={3}
          // 英文占位符
          placeholder="What's weighing on your mind right now?..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={handleDraw}
          disabled={loading || !question.trim()}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 font-medium disabled:opacity-50 hover:opacity-90 transition-opacity text-base shadow-lg shadow-purple-500/20"
        >
          {loading ? "Connecting to the flow..." : "Draw Cards & Reveal"}
        </button>
      </section>

      {/* Card Placeholders (Animation) */}
      {drawnCards.length > 0 && loading && (
        <div className="flex gap-2 mb-6 animate-pulse opacity-50">
            {[1,2,3].map((i) => (
                <div key={i} className="w-16 h-24 bg-gray-800 rounded border border-gray-700"></div>
            ))}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <section className="w-full max-w-2xl animate-fade-in">
          
          {/* Capture Area */}
          <div 
            ref={resultRef} 
            className="bg-[#2a2a2a] p-6 sm:p-8 rounded-xl border border-purple-500/30 shadow-2xl"
          >
            {/* User Question Display */}
            <div className="mb-6 pb-4 border-b border-gray-700/50">
              <h3 className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-2">Your Question</h3>
              <p className="text-lg font-serif italic text-gray-200">“{question}”</p>
            </div>

            {/* Cards Display */}
            <div className="flex justify-center gap-4 mb-8 pb-6 border-b border-gray-700/50">
              {drawnCards.map((card) => (
                <div key={card.name} className="flex flex-col items-center text-center w-24">
                  <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg border border-gray-600 mb-2 flex items-center justify-center text-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent"></div>
                    {card.suit ? '🎴' : '🎭'}
                  </div>
                  <span className="text-xs font-medium text-purple-300 leading-tight">
                    {card.name}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Response */}
            <div className="prose prose-invert prose-purple max-w-none prose-p:leading-relaxed prose-li:marker:text-purple-400">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
            
            <div className="text-center text-gray-600 text-[10px] mt-8 pt-4 border-t border-gray-800/50 uppercase tracking-widest">
              Generated by Deep Tarot AI
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleShareBtnClick}
            disabled={isCapturing}
            className="mt-6 w-full sm:w-auto mx-auto block px-6 py-3 rounded-full bg-[#333] hover:bg-[#444] border border-gray-600 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isCapturing ? (
               <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              // Download Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15"/><line x1="12" x2="3" y1="3"/></svg>
            )}
            {isCapturing ? "Generating Image..." : "Save Reading as Image"}
          </button>

        </section>
      )}
    </main>
  );
}
