import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // On ne supprime PLUS RIEN, on laisse la fonction vide
  console.log("🤫 Seed automatique ignoré pour préserver Prisma Studio !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });