import { PrismaClient } from "../prisma";

export class Context {
  uid!: string | null;
  prisma!: PrismaClient;
}

export class AuthorizedContext extends Context {
  uid!: string;
}
