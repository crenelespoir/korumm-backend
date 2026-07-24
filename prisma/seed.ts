import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ORGANISATEUR_EMAIL ?? 'admin@korumm.local';
  const motDePasseClair = process.env.SEED_ORGANISATEUR_PASSWORD ?? 'admin200';

  const motDePasseHash = await bcrypt.hash(motDePasseClair, 10);

  const organisateur = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
        nom: 'Crénel Espoir',
        email,
        motDePasse: motDePasseHash,
    },
  });

  console.log(`Compte organisateur prêt : ${organisateur.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });