import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminGuard } from './admin.guard.js';
import { GameMonetizeImportService } from './gamemonetize-import.service.js';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const gameShape = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(140).optional(),
  description: z.string().min(1).max(5000),
  thumbnail: z.string().url(),
  embedUrl: z.string().url(),
  width: z.number().int().min(100).max(4000).optional(),
  height: z.number().int().min(100).max(4000).optional(),
  categoryId: z.number().int().nullable().optional(),
  published: z.boolean().optional(),
});

const categoryShape = z.object({ name: z.string().min(1).max(60) });

function parse<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BadRequestException(
      result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    );
  }
  return result.data;
}

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private gameMonetizeImportService: GameMonetizeImportService,
  ) {}

  @Get('games')
  games() {
    return this.prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  @Post('games')
  createGame(@Body() body: unknown) {
    const d = parse(gameShape, body);
    return this.prisma.game.create({
      data: {
        title: d.title,
        slug: d.slug ?? slugify(d.title),
        description: d.description,
        thumbnail: d.thumbnail,
        embedUrl: d.embedUrl,
        width: d.width ?? 800,
        height: d.height ?? 600,
        categoryId: d.categoryId ?? null,
        published: d.published ?? false,
      },
    });
  }

  @Patch('games/:id')
  updateGame(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    const d = parse(gameShape.partial(), body);
    return this.prisma.game.update({ where: { id }, data: d });
  }

  @Delete('games/:id')
  async deleteGame(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.game.delete({ where: { id } });
    return { deleted: true };
  }

  @Post('categories')
  createCategory(@Body() body: unknown) {
    const d = parse(categoryShape, body);
    return this.prisma.category.create({
      data: { name: d.name, slug: slugify(d.name) },
    });
  }
  @Post('import/gamemonetize')
  importGameMonetize(@Body() body: unknown) {
    const d = parse(z.object({ feedUrl: z.string().url() }), body);
    return this.gameMonetizeImportService.importFromFeed(d.feedUrl);
  }
  @Patch('games/publish-all')
  async publishAllGames() {
    const result = await this.prisma.game.updateMany({
      where: { published: false },
      data: { published: true },
    });

    return {
      published: result.count,
    };
  }
}
