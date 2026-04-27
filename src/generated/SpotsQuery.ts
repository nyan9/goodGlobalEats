// Re-export from generated types for backward compatibility
export type {
  SpotsQueryQuery as SpotsQuery,
  SpotsQueryQueryVariables as SpotsQueryVariables,
} from "./types";

import type { SpotsQueryQuery } from "./types";

// SpotsQuery_spots is the element type of the spots array
export type SpotsQuery_spots = SpotsQueryQuery["spots"][number];
