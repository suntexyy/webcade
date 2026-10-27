import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service.js';

const feedItem = z.object({
  id: z.coerce.string(),
  title: z.string(),
  description: z.string().default(''),
  url: z.string(),
  category: z.string().default('Other'),
  thumb: z.string(),
  width: z.coerce.number().default(800),
  height: z.coerce.number().default(600),
});

const EMBED_HOSTS = new Set([
  'html5.gamemonetize.co',
  'html5.gamemonetize.com',
]);
const THUMB_HOSTS = new Set(['img.gamemonetize.com']);

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  bull: '•',
  hellip: '…',
};

function decodeEntities(s: string) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, e: string) => {
    if (e[0] === '#') {
      const hex = e[1].toLowerCase() === 'x';
      const code = parseInt(e.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return ENTITIES[e.toLowerCase()] ?? match;
  });
}

function cleanText(raw: string, max = 2000) {
  const noTags = raw
    .replace(/Web Dev\s*<a[^>]*>.*?<\/a>/gi, '')
    .replace(/<[^>]*>/g, ' ');
  return decodeEntities(noTags)
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function hostOk(url: string, hosts: Set<string>) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && hosts.has(u.hostname);
  } catch {
    return false;
  }
}

@Injectable()
export class GameMonetizeImportService {
  constructor(private prisma: PrismaService) {}

  async importFromFeed(feedUrl: string) {
    let url: URL;
    try {
      url = new URL(feedUrl);
    } catch {
      throw new BadRequestException('Invalid feed URL');
    }
    if (
      url.origin !== 'https://gamemonetize.com' ||
      url.pathname !== '/feed.php'
    ) {
      throw new BadRequestException(
        'Only https://gamemonetize.com/feed.php URLs are allowed',
      );
    }

    let data: unknown;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`Feed returned ${res.status}`);
      data = await res.json();
    } catch {
      throw new BadGatewayException(
        'Could not load the feed. Generate it as JSON and try again.',
      );
    }

    const items = Array.isArray(data) ? data : [];
    let created = 0;
    let skipped = 0;

    for (const raw of items) {
      const parsed = feedItem.safeParse(raw);
      if (
        !parsed.success ||
        !hostOk(parsed.data.url, EMBED_HOSTS) ||
        !hostOk(parsed.data.thumb, THUMB_HOSTS)
      ) {
        skipped++;
        continue;
      }
      const g = parsed.data;

      const exists = await this.prisma.game.findFirst({
        where: { embedUrl: g.url },
      });
      const title = cleanText(g.title, 120);
      if (exists || !title) {
        skipped++;
        continue;
      }

      let slug = slugify(title) || `game-${g.id}`;
      if (await this.prisma.game.findUnique({ where: { slug } }))
        slug = `${slug}-${g.id}`;

      const categoryName = cleanText(g.category, 60) || 'Other';
      const category = await this.prisma.category.upsert({
        where: { slug: slugify(categoryName) || 'other' },
        update: {},
        create: { name: categoryName, slug: slugify(categoryName) || 'other' },
      });

      await this.prisma.game.create({
        data: {
          title,
          slug,
          description: cleanText(g.description) || title,
          thumbnail: g.thumb,
          embedUrl: g.url,
          width: Math.min(Math.max(Math.round(g.width), 100), 4000),
          height: Math.min(Math.max(Math.round(g.height), 100), 4000),
          categoryId: category.id,
          published: false,
        },
      });
      created++;
    }

    return { fetched: items.length, created, skipped };
  }
}
