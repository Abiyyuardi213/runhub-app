import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "runhub";

const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
