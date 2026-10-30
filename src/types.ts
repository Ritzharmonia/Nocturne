export type FortuneCategory = 
  | 'luck'        // Аз хийморь
  | 'mystery'     // Нууц
  | 'humor'       // Хошигнол
  | 'treasure'    // Эрдэнэс
  | 'curse'       // Хараал
  | 'destiny';    // Хувь тавилан

export interface Fortune {
  id: string;
  category: FortuneCategory;
  categoryName: string;
  categoryIcon: string;
  title: string;
  text: string;
  advice: string;
  candyReward?: number;
  isSecretRare?: boolean;
}

export interface TarotCard {
  id: string;
  name: string;
  subtitle: string;
  arcanaNumber: string;
  symbol: string;
  imageTheme: string;
  meanings: {
    past: string;     // Өнгөрсөн
    present: string;  // Одоо
    future: string;   // Ирээдүй
  };
}

export interface HistoryRecord {
  id: string;
  fortuneId: string;
  fortuneTitle: string;
  fortuneText: string;
  categoryName: string;
  category: FortuneCategory;
  timestamp: number;
  candyReward?: number;
  isSecretRare?: boolean;
}

export type ActiveTab = 'crystal' | 'tarot' | 'history';
