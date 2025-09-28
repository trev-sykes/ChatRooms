import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    const global = await prisma.conversation.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Global Chat",
        },
    });
    console.log("✅ Seeded Global conversation:", global);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
