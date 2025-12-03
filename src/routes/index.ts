// src/routes/index.ts
import { Router } from 'express';
import { DebugRouter } from './debug.route';

const router = Router();

router.use('/debug', DebugRouter);

export default router;