import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { GamesModule } from './games/games.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [PrismaModule, GamesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
