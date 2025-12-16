export interface TarotCard {
  name: string;
  nameCN: string;
  id: string;
  image: string;
  meaningUp: string;
  meaningRev: string;
}

// 帮助函数：直接返回完整路径
export const getFullImageUrl = (imagePath: string) => {
  if (!imagePath.startsWith("http")) {
     return "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg"; 
  }
  return imagePath;
};

// 使用维基百科的高清 RWS 塔罗牌源
const MAJOR_ARCANA: TarotCard[] = [
  { name: "The Fool", nameCN: "愚人", id: "ar00", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", meaningUp: "New beginnings, innocence", meaningRev: "Recklessness" },
  { name: "The Magician", nameCN: "魔术师", id: "ar01", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", meaningUp: "Manifestation, power", meaningRev: "Manipulation" },
  { name: "The High Priestess", nameCN: "女祭司", id: "ar02", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", meaningUp: "Intuition, subconscious", meaningRev: "Secrets" },
  { name: "The Empress", nameCN: "皇后", id: "ar03", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", meaningUp: "Fertility, nature", meaningRev: "Dependence" },
  { name: "The Emperor", nameCN: "皇帝", id: "ar04", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaningUp: "Authority, structure", meaningRev: "Tyranny" },
  { name: "The Hierophant", nameCN: "教皇", id: "ar05", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", meaningUp: "Tradition, conformity", meaningRev: "Rebellion" },
  { name: "The Lovers", nameCN: "恋人", id: "ar06", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", meaningUp: "Partnership, union", meaningRev: "Disharmony" },
  { name: "The Chariot", nameCN: "战车", id: "ar07", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", meaningUp: "Control, willpower", meaningRev: "Lack of direction" },
  { name: "Strength", nameCN: "力量", id: "ar08", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", meaningUp: "Courage, persuasion", meaningRev: "Self-doubt" },
  { name: "The Hermit", nameCN: "隐士", id: "ar09", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", meaningUp: "Introspection, guidance", meaningRev: "Isolation" },
  { name: "Wheel of Fortune", nameCN: "命运之轮", id: "ar10", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", meaningUp: "Change, cycles", meaningRev: "Bad luck" },
  { name: "Justice", nameCN: "正义", id: "ar11", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", meaningUp: "Fairness, truth", meaningRev: "Dishonesty" },
  { name: "The Hanged Man", nameCN: "倒吊人", id: "ar12", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", meaningUp: "Surrender, perspective", meaningRev: "Stalling" },
  { name: "Death", nameCN: "死神", id: "ar13", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", meaningUp: "Endings, transformation", meaningRev: "Resistance to change" },
  { name: "Temperance", nameCN: "节制", id: "ar14", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", meaningUp: "Balance, moderation", meaningRev: "Imbalance" },
  { name: "The Devil", nameCN: "恶魔", id: "ar15", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", meaningUp: "Addiction, materialism", meaningRev: "Detachment" },
  { name: "The Tower", nameCN: "高塔", id: "ar16", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", meaningUp: "Sudden change, upheaval", meaningRev: "Avoidance of disaster" },
  { name: "The Star", nameCN: "星星", id: "ar17", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", meaningUp: "Hope, faith", meaningRev: "Despair" },
  { name: "The Moon", nameCN: "月亮", id: "ar18", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", meaningUp: "Illusion, fear", meaningRev: "Confusion" },
  { name: "The Sun", nameCN: "太阳", id: "ar19", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", meaningUp: "Positivity, success", meaningRev: "Temporary depression" },
  { name: "Judgement", nameCN: "审判", id: "ar20", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", meaningUp: "Rebirth, inner calling", meaningRev: "Self-doubt" },
  { name: "The World", nameCN: "世界", id: "ar21", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", meaningUp: "Completion, travel", meaningRev: "Incomplete" },
];

export const getShuffledDeck = (): TarotCard[] => {
  return [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
};

export const drawCards = (count: number = 3): TarotCard[] => {
  return getShuffledDeck().slice(0, count);
};
