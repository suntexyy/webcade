import { Module } from '@nestjs/common';
import { GamesController, CategoriesController } from './games.controller.js';
import { GamesService } from './games.service.js';

@Module({
  controllers: [GamesController, CategoriesController],
  providers: [GamesService],
})
export class GamesModule {}
