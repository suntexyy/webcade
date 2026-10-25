import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  }),
});

const categories = [
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Racing', slug: 'racing' },
];

// Placeholders: replace embed URLs with real ones from GameDistribution / GameMonetize
const games = [
  { title: 'Block Puzzle', category: 'puzzle' },
  { title: 'Gem Match', category: 'puzzle' },
  { title: 'Word Search', category: 'puzzle' },
  { title: 'Sliding Tiles', category: 'puzzle' },
  { title: 'Bubble Pop', category: 'puzzle' },
  { title: 'Memory Cards', category: 'puzzle' },
  { title: 'Turbo Drift', category: 'racing' },
  { title: 'Street Racer', category: 'racing' },
  { title: 'Moto Rush', category: 'racing' },
  { title: 'Kart Champions', category: 'racing' },
  { title: 'Offroad Hills', category: 'racing' },
  { title: 'Highway Dash', category: 'racing' },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  for (const g of games) {
    const slug = slugify(g.title);
    const category = await prisma.category.findUnique({
      where: { slug: g.category },
    });

    await prisma.game.upsert({
      where: { slug },
      update: {},
      create: {
        title: g.title,
        slug,
        description: `Play ${g.title} online for free in your browser.`,
        thumbnail: `https://picsum.photos/seed/${slug}/400/225`,
        embedUrl: `https://example.com/replace-with-real-embed/${slug}`,
        published: true,
        categoryId: category?.id,
      },
    });
  }

  console.log(
    `Seeded ${categories.length} categories and ${games.length} games`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
