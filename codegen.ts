import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.gql",
  documents: [
    "pages/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "!src/generated/**",
  ],
  generates: {
    "./src/generated/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        avoidOptionals: false,
        maybeValue: "T | null",
        enumsAsTypes: false,
      },
    },
  },
};

export default config;
