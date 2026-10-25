import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.game.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  bySlug(slug: string) {
    return this.prisma.game.findUnique({
      where: { slug },
      include: { category: true },
    });
  }
}
