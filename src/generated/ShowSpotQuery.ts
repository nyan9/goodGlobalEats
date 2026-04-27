// Re-export from generated types for backward compatibility
export type {
  ShowSpotQueryQuery as ShowSpotQuery,
  ShowSpotQueryQueryVariables as ShowSpotQueryVariables,
} from "./types";

import type { ShowSpotQueryQuery } from "./types";

export type ShowSpotQuery_spot = NonNullable<ShowSpotQueryQuery["spot"]>;
export type ShowSpotQuery_spot_nearby =
  ShowSpotQuery_spot["nearby"][number];
