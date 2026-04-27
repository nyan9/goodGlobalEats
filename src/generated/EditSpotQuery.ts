// Re-export from generated types for backward compatibility
export type {
  EditSpotQueryQuery as EditSpotQuery,
  EditSpotQueryQueryVariables as EditSpotQueryVariables,
} from "./types";

import type { EditSpotQueryQuery } from "./types";

export type EditSpotQuery_spot = NonNullable<EditSpotQueryQuery["spot"]>;
