// src/app.ts
import express from 'express';

export function createApp() {
  const app = express();

  app.use(express.json());

  // health
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}