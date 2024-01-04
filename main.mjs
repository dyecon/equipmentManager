import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const dishes = await client.dish.findMany({
    include: {
        dishIndigirents: {
            include: {
                indigrient: true
            }
        }
    }
});

await client.indigrient({
    include: {
        dishIndigirents
    }
})

debugger;