import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.connect();
  console.log(await prisma.users.count());
}

main().catch(console.error);
