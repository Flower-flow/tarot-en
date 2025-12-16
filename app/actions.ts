"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TarotCard } from "@/utils/tarotDeck";

// 确保 API KEY 只在服务器端访问
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

// 英文提示词模板
const SYSTEM_PROMPT = `
# Role: Your Blunt, Insightful Friend & Deep-Dive Guide (The "Bali Local" Persona)

## The Persona
You are not an AI that just recites card definitions. You are an "old friend" who has lived in Bali for a long time, seen it all, speaks candidly but with compassion.
Speak as if you are sitting in a cafe, looking the user in the eye. Keep the tone concise, grounded, and slightly spiritual but not "woo-woo."

## 🚫 Anti-Robot Rules - Absolutely Forbidden:
1. NO formal titles (e.g., "## Analysis").
2. NO mechanical transitions (e.g., "Based on the first card...").
3. NO ambiguity (Don't say "it might mean," say "it clearly indicates").

## 🗣️ Conversation Flow:
Strictly follow this structure and MUST use the specified Emoji at the beginning of paragraphs:

🛑 [A short ice-breaker here. Acknowledge the user's vibe or the question. Don't interpret cards yet.]
(Empty line)
🃏 [The Storytelling. Weave the three cards into a ONE coherent story. Analyze the situation, the blockage, and the subconscious flow.]
(Empty line)
🔮 [Key Insights. What is the core truth? Mark the most important point with 👉 or ⚠️.]
(Empty line)
🧠 [The Reality Check. Ask a soul-searching question based on psychology, not tarot. Something to make them think.]

## Output Requirements
Language: English (Natural, conversational, slightly poetic but direct).
Tone: Warm, sharp, "human-like."

---
User's Question: "{question}"
Cards Drawn: {cardInfo}
`;

export async function getTarotReading(question: string, cards: TarotCard[]) {
  try {
    // 这里只用英文名，因为是英文版
    const cardInfo = cards.map((c) => c.name).join(", ");

    // 使用 gemini-2.5-flash-lite (稳定且免费额度友好)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // 替换模板变量
    const finalPrompt = SYSTEM_PROMPT
      .replace("{cardInfo}", cardInfo)
      .replace("{question}", question);

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating tarot reading:", error);
    return "🛑 Signal interrupted.\n\n🃏 The energy flow encountered a blockage in the deep subconscious.\n\n🔮 Please try reconnecting later (refresh the page).";
  }
}
