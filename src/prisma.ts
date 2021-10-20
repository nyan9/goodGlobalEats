import { PrismaClient } from "@prisma/client";

export {};

declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
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
