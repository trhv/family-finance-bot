// src/services/text-intent.service.ts

export type ParsedIntent =
  | {
      type: 'SPENT_ON_CATEGORY_LAST_MONTH';
      categoryName: string;
    }
  | {
      type: 'CURRENT_BALANCE_BY_ALIAS';
      alias: string;
    }
  | {
      type: 'MORTGAGE_REMAINING';
    };

export class TextIntentService {
  /**
   * מקבל טקסט חופשי (בעברית) ומחזיר intent מובנה
   */
  parse(text: string): ParsedIntent | null {
    const normalized = text.trim();

    // 1) כמה הוצאתי על <קטגוריה> בחודש הקודם
    // דוגמאות: "כמה הוצאתי על ביגוד בחודש הקודם"
    //          "כמה הוצאתי על סופר בחודש הקודם?"
    const spentRegex = /^כמה\s+הוצאתי\s+על\s+(.+)\s+בחודש\s+הקודם\??$/;
    const spentMatch = normalized.match(spentRegex);
    if (spentMatch) {
      const categoryName = spentMatch[1].trim();
      return {
        type: 'SPENT_ON_CATEGORY_LAST_MONTH',
        categoryName,
      };
    }

    // 2) מה המצב כרגע בחשבון <alias>
    // דוגמא: "מה המצב כרגע בחשבון אריה?"
    const balanceRegex = /^מה\s+המצב\s+כרגע\s+בחשבון\s+(.+)\??$/;
    const balanceMatch = normalized.match(balanceRegex);
    if (balanceMatch) {
      const alias = balanceMatch[1].trim();
      return {
        type: 'CURRENT_BALANCE_BY_ALIAS',
        alias,
      };
    }

    // 3) כמה משכנתא נשארה לי
    const mortgageRegex = /^כמה\s+משכנתא\s+נשארה\s+לי\??$/;
    if (mortgageRegex.test(normalized)) {
      return { type: 'MORTGAGE_REMAINING' };
    }

    return null;
  }
}