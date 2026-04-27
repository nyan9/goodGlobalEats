// Re-export from generated types for backward compatibility
export type {
  CreateSpotMutationMutation as CreateSpotMutation,
  CreateSpotMutationMutationVariables as CreateSpotMutationVariables,
} from "./types";

import type { CreateSpotMutationMutation } from "./types";

export type CreateSpotMutation_createSpot = NonNullable<
  CreateSpotMutationMutation["createSpot"]
>;
