import { buildSchemaSync, Query, Resolver } from "type-graphql";
import { ImageResolver } from "./image";
import { SpotResolver } from "./spot";
import { authChecker } from "./auth";

@Resolver()
class DummyResolver {
  @Query((_returns) => String)
  hello() {
    return "Nice to see you";
  }
}

export const schema = buildSchemaSync({
  resolvers: [DummyResolver, ImageResolver, SpotResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
