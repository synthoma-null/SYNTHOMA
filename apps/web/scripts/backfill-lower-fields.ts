/**
 * Backfill script: fills emailLower and nicknameLower for existing users
 * that were created before these fields were added.
 *
 * Run with:
 *   npx tsx scripts/backfill-lower-fields.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { emailLower: '' },
        { nicknameLower: '' },
      ],
    },
    select: { id: true, email: true, nickname: true, emailLower: true, nicknameLower: true },
  });

  console.log(`Found ${users.length} users to backfill.`);

  let updated = 0;
  for (const user of users) {
    const emailLower = user.email.toLowerCase().trim();
    const nicknameLower = user.nickname.toLowerCase().trim();

    if (user.emailLower === emailLower && user.nicknameLower === nicknameLower) continue;

    await prisma.user.update({
      where: { id: user.id },
      data: { emailLower, nicknameLower },
    });
    console.log(`  Updated: ${user.nickname} (${user.email})`);
    updated++;
  }

  console.log(`Done. Updated ${updated} users.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
