import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Local development only: Vercel injects environment variables itself
  if (!process.env.VERCEL) {
    await import('dotenv/config');
  }

  const app = await NestFactory.create(AppModule);
  app.use((req: { url: string }, _res: unknown, next: () => void) => {
    if (req.url === '/api' || req.url.startsWith('/api/'))
      req.url = req.url.slice(4) || '/';
    next();
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
