import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async list(
    filters: {
      category?: string;
      q?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const limit = Math.min(Math.max(filters.limit ?? 30, 1), 60);
    const page = Math.max(filters.page ?? 1, 1);

    const where = {
      published: true,
      ...(filters.category && { category: { slug: filters.category } }),
      ...(filters.q && {
        title: { contains: filters.q, mode: 'insensitive' as const },
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.game.count({ where }),
      this.prisma.game.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          category: true,
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    };
  }

  slugs() {
    return this.prisma.game.findMany({
      where: { published: true },
      select: { slug: true },
    });
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async play(slug: string) {
    await this.prisma.game.updateMany({
      where: { slug, published: true },
      data: { plays: { increment: 1 } },
    });
  }

  bySlug(slug: string) {
    return this.prisma.game.findUnique({
      where: { slug },
      include: { category: true },
    });
  }
}
