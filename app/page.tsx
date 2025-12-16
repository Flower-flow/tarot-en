"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw, CopyPlus, Quote } from "lucide-react";
import { getShuffledDeck, getFullImageUrl, TarotCard } from "@/utils/tarotDeck";
import { getTarotReading } from "./actions";

// Types for parsing the response
type ReadingSection = {
  type: "connection" | "story" | "insight" | "reality";
  content: string;
};

const TEMPLATE_TEXT = "我想要【目标/渴望】、但是我的卡点是【具体的恐惧/障碍】，我应该【行动选项】吗？";

export default function Home() {
  const [question, setQuestion] = useState("");
  // New step 'picking' added
  const [step, setStep] = useState<"input" | "picking" | "reading" | "result">("input");
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [readingRaw, setReadingRaw] = useState("");
  const [parsedReading, setParsedReading] = useState<ReadingSection[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (!question.trim()) return;
    // Initialize a shuffled deck for the user to pick from
    setDeck(getShuffledDeck());
    setSelectedCards([]);
    setStep("picking");
  };

  const handleCardPick = (card: TarotCard) => {
    // If already picking or already picked 3, ignore
    if (selectedCards.find(c => c.id === card.id) || selectedCards.length >= 3) return;

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 3) {
      // Small delay to let user see the 3rd card selection
      setTimeout(() => {
        handleReading(newSelection);
      }, 800);
    }
  };

  const handleReading = async (drawnCards: TarotCard[]) => {
    setStep("reading");
    
    // Call server action
    const text = await getTarotReading(question, drawnCards);
    setReadingRaw(text);
    parseResponse(text);
    
    setStep("result");
  };

  const parseResponse = (text: string) => {
    const sections: ReadingSection[] = [];
    const lines = text.split('\n');
    let currentType: ReadingSection['type'] = "connection";
    let currentContent = "";

    const flush = () => {
      if (currentContent.trim()) {
        sections.push({ type: currentType, content: currentContent.trim() });
        currentContent = "";
      }
    };

    lines.forEach(line => {
      if (line.includes("🛑")) {
        flush();
        currentType = "connection";
        currentContent = line.replace("🛑", "").trim();
      } else if (line.includes("🃏")) {
        flush();
        currentType = "story";
        currentContent = line.replace("🃏", "").trim();
      } else if (line.includes("🔮")) {
        flush();
        currentType = "insight";
        currentContent = line.replace("🔮", "").trim();
      } else if (line.includes("🧠")) {
        flush();
        currentType = "reality";
        currentContent = line.replace("🧠", "").trim();
      } else {
        currentContent += "\n" + line;
      }
    });
    flush();
    setParsedReading(sections);
  };

  const reset = () => {
    setQuestion("");
    setSelectedCards([]);
    setStep("input");
    setReadingRaw("");
    setParsedReading([]);
  };

  const fillTemplate = () => {
    setQuestion(TEMPLATE_TEXT);
  };

  // Scroll to results when they appear
  useEffect(() => {
    if (step === "result" && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 font-sans overflow-x-hidden relative text-mystic-100">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/30 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-6 mt-8 md:mt-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold-500" />
            <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200 drop-shadow-lg">
              行动塔罗
            </h1>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold-500" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-2 text-mystic-100/90 font-light tracking-wide max-w-xl mx-auto"
          >
            <p className="text-lg md:text-xl font-medium text-gold-500/90">
              看见此刻的暗流 · 信任你的直觉
            </p>
            <p className="text-sm md:text-base text-mystic-100/70 leading-relaxed italic">
              不仅是占卜，是关于如何从舒适区走向深水区的行动指南
            </p>
          </motion.div>
        </header>

        {/* INPUT PHASE */}
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="w-full max-w-xl"
            >
              <div className="bg-mystic-800/40 backdrop-blur-xl p-1 rounded-2xl border border-mystic-600/30 shadow-2xl ring-1 ring-white/10">
                <div className="bg-mystic-900/60 rounded-xl p-6 md:p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gold-500/90 mb-2 uppercase tracking-wider">
                      你的困惑
                    </label>
                    
                    {/* Input Text Area */}
                    <div className="relative">
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={`例如：我想要离职创业，我的卡点是担心存款不够，我应该辞职吗？\n\n(越具体，洞察越深)`}
                        className="w-full h-32 md:h-40 bg-mystic-100 border-0 rounded-lg p-4 text-black placeholder-gray-500 focus:ring-4 focus:ring-purple-500/30 outline-none resize-none shadow-inner transition-all text-base md:text-lg leading-relaxed"
                      />
                    </div>
                    
                    {/* Formula Display & Template Button */}
                    <div className="mt-4 bg-mystic-950/30 rounded-lg p-3 border border-mystic-700/50">
                      <div className="flex items-start space-x-2 text-xs md:text-sm text-mystic-100/80 mb-2">
                        <Quote className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <span className="font-mono leading-relaxed">
                          <span className="text-gold-500 font-bold">提问公式：</span>
                          我想要【目标/渴望】、但是我的卡点是【具体的恐惧/障碍】，我应该【行动选项】吗？
                        </span>
                      </div>
                      <button 
                        onClick={fillTemplate}
                        className="w-full text-xs md:text-sm py-2 bg-mystic-800 hover:bg-mystic-700 text-gold-500/90 hover:text-gold-400 rounded transition-colors flex items-center justify-center space-x-2 border border-mystic-600/50"
                      >
                        <CopyPlus className="w-3 h-3 md:w-4 md:h-4" />
                        <span>点击此处自动填入模版</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStart}
                    disabled={!question.trim()}
                    className="group w-full py-4 px-6 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:grayscale rounded-lg font-bold text-white shadow-lg shadow-purple-900/50 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    <span className="tracking-widest">开始抽牌</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PICKING PHASE */}
          {step === "picking" && (
            <motion.div
              key="picking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-8 w-full max-w-5xl"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif text-gold-500">
                  请凭直觉抽取 3 张牌
                </h3>
                <p className="text-mystic-100/50 text-sm">
                  已选择 {selectedCards.length} / 3
                </p>
              </div>

              {/* Grid of Cards */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 perspective-1000 px-4">
                {deck.map((card, idx) => {
                  const isSelected = selectedCards.find(c => c.id === card.id);
                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isSelected ? 0 : 1, // Hide if selected (or we could move it)
                        scale: 1 
                      }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ y: -10, scale: 1.05 }}
                      onClick={() => handleCardPick(card)}
                      className={`w-14 h-24 md:w-20 md:h-32 bg-mystic-800 rounded border border-gold-600/20 cursor-pointer shadow-lg relative group ${isSelected ? 'pointer-events-none' : ''}`}
                    >
                      {/* Card Back Pattern */}
                      <div className="absolute inset-0 bg-[url('https://www.sacred-texts.com/tarot/pkt/img/cardback.jpg')] bg-cover bg-center rounded opacity-90 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Display Selected Slots */}
              <div className="flex justify-center gap-6 mt-8 min-h-[160px]">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className="w-24 h-40 md:w-32 md:h-52 rounded-lg border-2 border-dashed border-mystic-600/30 flex items-center justify-center relative bg-mystic-900/30"
                  >
                    {selectedCards[i] && (
                      <motion.div
                        layoutId={`card-${selectedCards[i].id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full absolute inset-0 bg-mystic-800 rounded-lg shadow-xl overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-[url('https://www.sacred-texts.com/tarot/pkt/img/cardback.jpg')] bg-cover bg-center" />
                      </motion.div>
                    )}
                    {!selectedCards[i] && (
                      <span className="text-mystic-600/50 text-2xl font-bold">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* READING LOADING PHASE */}
          {step === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-8 py-12"
            >
              <div className="flex justify-center gap-6">
                {[0, 1, 2].map((i) => (
                   <motion.div
                    key={i}
                    initial={{ rotateY: 180 }}
                    animate={{ 
                       rotateY: [180, 0, 180],
                       scale: [1, 1.05, 1],
                       boxShadow: ["0px 0px 0px rgba(255,215,0,0)", "0px 0px 30px rgba(255,215,0,0.5)", "0px 0px 0px rgba(255,215,0,0)"]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3, 
                      delay: i * 0.5, 
                      ease: "easeInOut" 
                    }}
                    className="w-24 h-40 md:w-32 md:h-52 bg-mystic-800 rounded-lg border border-gold-500/30"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                     <div className="absolute inset-0 bg-[url('https://www.sacred-texts.com/tarot/pkt/img/cardback.jpg')] bg-cover bg-center rounded-lg backface-hidden" />
                     <div className="absolute inset-0 bg-mystic-900 rounded-lg backface-hidden" style={{ transform: "rotateY(180deg)" }} />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif text-gold-500 animate-pulse">
                  正在深入潜意识...
                </h3>
                <p className="text-mystic-100/50 text-sm">
                  解析牌面符号与现实困境的关联
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS PHASE */}
        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-16 pb-20"
          >
            {/* Cards Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {selectedCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: idx * 0.3, type: "spring", stiffness: 100 }}
                  className="group flex flex-col items-center space-y-4"
                >
                  <div className="relative w-48 h-80 md:w-full md:aspect-[3/5] rounded-xl overflow-hidden shadow-2xl border-2 border-mystic-700 transition-transform duration-500 group-hover:scale-105 group-hover:border-gold-500/50 group-hover:shadow-gold-500/20">
                    <img
                      src={getFullImageUrl(card.image)}
                      alt={card.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-gold-500 font-serif text-2xl tracking-wide flex flex-col items-center">
                      <span className="text-lg md:text-xl">{card.nameCN}</span>
                      <span className="text-xs md:text-sm text-mystic-100/40 font-sans tracking-widest uppercase">{card.name}</span>
                    </h3>
                    <p className="text-xs text-mystic-100/50 uppercase tracking-[0.2em] font-medium pt-1">
                      {idx === 0 ? "Situation" : idx === 1 ? "Challenge" : "Advice"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reading Content */}
            <div ref={scrollRef} className="space-y-8 max-w-3xl mx-auto">
              {parsedReading.map((section, idx) => {
                let borderColor = "border-mystic-700";
                let bgGradient = "bg-mystic-800/40";
                let textColor = "text-mystic-100";
                let title = "";

                if (section.type === "connection") {
                  borderColor = "border-red-500/30";
                  bgGradient = "from-red-950/30 to-purple-900/30";
                  textColor = "text-red-100";
                  title = "破冰";
                } else if (section.type === "story") {
                  borderColor = "border-indigo-500/30";
                  bgGradient = "from-indigo-950/30 to-purple-900/30";
                  textColor = "text-indigo-100";
                  title = "牌面解析"; // Changed from 牌面故事 to match professional tone
                } else if (section.type === "insight") {
                  borderColor = "border-gold-600/30";
                  bgGradient = "from-amber-950/30 to-purple-900/30";
                  textColor = "text-amber-100";
                  title = "关键洞察";
                } else if (section.type === "reality") {
                  borderColor = "border-emerald-500/30";
                  bgGradient = "from-emerald-950/30 to-purple-900/30";
                  textColor = "text-emerald-100";
                  title = "行动指引"; // Changed from 灵魂拷问 to match professional tone
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.15 }}
                    className={`group relative overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} backdrop-blur-md p-8 md:p-10 shadow-lg`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-bold text-6xl md:text-8xl font-serif select-none pointer-events-none text-white">
                      {title}
                    </div>
                    <div className={`prose prose-invert prose-p:text-lg prose-p:leading-8 ${textColor} max-w-none`}>
                      <p className="whitespace-pre-wrap">{section.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={reset}
                className="group flex items-center space-x-3 px-8 py-4 rounded-full bg-mystic-800 hover:bg-mystic-700 border border-mystic-600 transition-all hover:scale-105 shadow-xl"
              >
                <RotateCcw className="w-5 h-5 text-gold-500 group-hover:-rotate-180 transition-transform duration-500" />
                <span className="text-mystic-100 font-medium tracking-wide">开始新的探索</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}