import { PrismaClient } from "@prisma/client";

export {};

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["query", "info", "warn"] });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ["query", "info", "warn"] });
  }

  prisma = global.prisma;
}

export { prisma, PrismaClient };
