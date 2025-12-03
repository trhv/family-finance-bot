// src/routes/qa.route.ts
import { Router } from 'express';
import { services } from '../services';

export const QaRouter = Router();

/**
 * POST /api/qa/message
 * body: { userId: number, text: string }
 */
QaRouter.post('/message', async (req, res) => {
  try {
    const { userId, text } = req.body || {};

    if (!userId || !text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'userId (number) and text (string) are required',
      });
    }

    const intent = services.textIntentService.parse(text);

    if (!intent) {
      return res.status(200).json({
        ok: false,
        answer:
          'לא הצלחתי להבין את השאלה. נסה לנסח מחדש או להשתמש בניסוחים: "כמה הוצאתי על <קטגוריה> בחודש הקודם?", "מה המצב כרגע בחשבון <כינוי>", "כמה משכנתא נשארה לי?"',
      });
    }

    // מפעילים את ה-facade לפי ה-intent
    switch (intent.type) {
      case 'SPENT_ON_CATEGORY_LAST_MONTH': {
        const result =
          await services.qaFacadeService.getSpentOnCategoryLastMonth({
            userId: Number(userId),
            categoryName: intent.categoryName,
          });

        return res.json({
          ok: true,
          type: intent.type,
          data: result,
          answer: `בחודש ${result.month}/${result.year} הוצאת על "${intent.categoryName}" סה"כ ${result.total} ₪.`,
        });
      }

      case 'CURRENT_BALANCE_BY_ALIAS': {
        const result =
          await services.qaFacadeService.getCurrentBalanceForAlias({
            userId: Number(userId),
            alias: intent.alias,
          });

        if (!result) {
          return res.json({
            ok: false,
            type: intent.type,
            answer: `לא מצאתי חשבון עם הכינוי "${intent.alias}" או שאין נתוני יתרה.`,
          });
        }

        return res.json({
          ok: true,
          type: intent.type,
          data: result,
          answer: `היתרה בחשבון "${intent.alias}" היא ${result.balanceCurrent} ${result.currency}.`,
        });
      }

      case 'MORTGAGE_REMAINING': {
        const list =
          await services.qaFacadeService.getMortgageRemaining({
            userId: Number(userId),
          });

        if (!list || list.length === 0) {
          return res.json({
            ok: false,
            type: intent.type,
            answer: 'לא מצאתי נתוני משכנתא עבורך.',
          });
        }

        if (list.length === 1) {
          const m = list[0];
          return res.json({
            ok: true,
            type: intent.type,
            data: list,
            answer: `בחשבון המשכנתא "${m.officialName ?? m.accountId}" נשארו ${m.remaining} ${m.currency}.`,
          });
        }

        const total = list.reduce((acc, m) => acc + m.remaining, 0);
        return res.json({
          ok: true,
          type: intent.type,
          data: list,
          answer:
            `יש לך ${list.length} חשבונות משכנתא, סך הכל נשארו ${total} ₪. ` +
            `פירוט: ` +
            list
              .map(
                (m) =>
                  `"${m.officialName ?? m.accountId}": ${m.remaining} ${m.currency}`,
              )
              .join(', '),
        });
      }

      default:
        return res.status(500).json({
          error: 'Unknown intent type',
        });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
});