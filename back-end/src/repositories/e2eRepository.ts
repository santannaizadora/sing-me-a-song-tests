import { prisma } from "../database.js";

async function truncate() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

async function seed() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: 'Billie Eilish - bad guy',
        youtubeLink:
          'https://www.youtube.com/watch?v=DyDfgMOUjCI&ab_channel=BillieEilishVEVO'
      },
      {
        name: 'Eminem - Without Me (Official Music Video)',
        youtubeLink:
          'https://www.youtube.com/watch?v=YVkUvmDQ3HY&ab_channel=EminemVEVO',
        score: 529,
      },
      {
        name: 'System Of A Down - Toxicity (Official HD Video)',
        youtubeLink:
          'https://www.youtube.com/watch?v=iywaBOMvYLI&ab_channel=systemofadownVEVO',
        score: 285,
      }
    ],
  });
}

export const e2eRepository = {
  truncate,
  seed,
};