import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service.js';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @Get()
  list() {
    return this.games.list();
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.games.bySlug(slug);
  }
}
