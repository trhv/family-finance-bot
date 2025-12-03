// src/routes/debug.route.ts
import { Router } from 'express';
import { services } from '../services';

export const DebugRouter = Router();

/**
 * GET /api/debug/spent-last-month?userId=1&category=ביגוד
 */
DebugRouter.get('/spent-last-month', async (req, res) => {
    try {
      console.log('QUERY:', req.query); // 👈 לוג לדיבוג
  
      const userIdRaw = req.query.userId;
      const categoryRaw = req.query.category;
  
      if (userIdRaw === undefined || categoryRaw === undefined) {
        return res.status(400).json({
          error: 'userId and category are required',
          got: req.query,
        });
      }
  
      const userId = Number(userIdRaw);
      const categoryName = String(categoryRaw);
  
      if (Number.isNaN(userId) || !categoryName.trim()) {
        return res.status(400).json({
          error: 'userId must be number and category non-empty string',
          got: { userIdRaw, categoryRaw },
        });
      }
  
      const result = await services.qaFacadeService.getSpentOnCategoryLastMonth({
        userId,
        categoryName,
      });
  
      res.json(result);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err?.message || 'Internal error' });
    }
  });

/**
 * GET /api/debug/balance-by-alias?userId=1&alias=אריה
 */
DebugRouter.get('/balance-by-alias', async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const alias = String(req.query.alias || '');

    if (!userId || !alias) {
      return res.status(400).json({ error: 'userId and alias are required' });
    }

    const result = await services.qaFacadeService.getCurrentBalanceForAlias({
      userId,
      alias,
    });

    if (!result) {
      return res.status(404).json({ error: 'Account/alias not found or no balance' });
    }

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

/**
 * GET /api/debug/mortgage-remaining?userId=1
 */
DebugRouter.get('/mortgage-remaining', async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await services.qaFacadeService.getMortgageRemaining({ userId });

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
});