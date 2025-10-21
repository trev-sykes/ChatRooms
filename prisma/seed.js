import { PrismaClient } from '@prisma/client';


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

    const user = await prisma.user.upsert({
        where: { username: "SYSTEM" },
        update: {},
        create: {
            username: "SYSTEM",
            handle: "SYSTEM",
            password: "pass123",
        },
    });
    console.log("✅ Seeded SYSTEM user:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
