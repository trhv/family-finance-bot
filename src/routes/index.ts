// src/routes/index.ts
import { Router } from 'express';
import { DebugRouter } from './debug.route';
import { QaRouter } from './qa.route';

const router = Router();

router.use('/debug', DebugRouter);
router.use('/qa', QaRouter);

export default router;