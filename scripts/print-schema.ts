import "reflect-metadata";
import { printSchema } from "graphql";
import * as path from "path";
import * as fs from "fs";
import { schema } from "../src/schema";

const sdl = printSchema(schema);
const outPath = path.resolve(__dirname, "../schema.gql");
fs.writeFileSync(outPath, sdl, "utf-8");
console.log(`Schema written to ${outPath}`);
