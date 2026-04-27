import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { schema } from "src/schema";
import { prisma } from "src/prisma";
import { auth } from "../../auth";
import type { NextApiRequest, NextApiResponse } from "next";

interface GqlContext {
  uid: string | null;
  prisma: typeof prisma;
}

const server = new ApolloServer<GqlContext>({
  schema,
  introspection: process.env.NODE_ENV !== "production",
});

export default startServerAndCreateNextHandler<NextApiRequest, GqlContext>(
  server,
  {
    context: async (req: NextApiRequest, res: NextApiResponse) => {
      const session = await auth(req, res);
      return { uid: session?.user?.id ?? null, prisma };
    },
  },
);
