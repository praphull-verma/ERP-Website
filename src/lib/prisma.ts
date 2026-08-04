import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`;
console.log("DB URL:", process.env.DATABASE_URL); // debug


const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };