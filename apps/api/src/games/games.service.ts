import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  list(filters: { category?: string; q?: string } = {}) {
    return this.prisma.game.findMany({
      where: {
        published: true,
        ...(filters.category && { category: { slug: filters.category } }),
        ...(filters.q && {
          title: { contains: filters.q, mode: 'insensitive' },
        }),
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  bySlug(slug: string) {
    return this.prisma.game.findUnique({
      where: { slug },
      include: { category: true },
    });
  }
}
