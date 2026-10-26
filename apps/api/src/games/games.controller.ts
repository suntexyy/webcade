import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service.js';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @Get()
  list(@Query('category') category?: string, @Query('q') q?: string) {
    return this.games.list({ category, q });
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.games.bySlug(slug);
  }
}

@Controller('categories')
export class CategoriesController {
  constructor(private games: GamesService) {}

  @Get()
  list() {
    return this.games.categories();
  }
}
