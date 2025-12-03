import { AppDataSource } from './data/data-source';
import { createApp } from './app';
import { env } from './config/env';

async function connectWithRetry(
  retries = 10,
  delayMs = 5000
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`DB connect attempt ${attempt}/${retries}...`);
      await AppDataSource.initialize();
      console.log('DB connected ✅');
      return;
    } catch (err) {
      console.error(`DB connection failed (attempt ${attempt}):`, (err as any).message);

      if (attempt === retries) {
        console.error('No more retries, giving up ❌');
        throw err;
      }

      console.log(`Waiting ${delayMs / 1000} seconds before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function bootstrap() {
  try {
    await connectWithRetry(); // 👈 משתמשים ב-retry

    const app = createApp();

    app.listen(env.app.port, () => {
      console.log(`Server listening on port ${env.app.port} 🚀`);
    });
  } catch (err) {
    console.error('Failed to start application ❌');
    console.error(err);
    process.exit(1);
  }
}

bootstrap();