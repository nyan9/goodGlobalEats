/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SpotsQuery
// ====================================================

export interface SpotsQuery_spots {
  __typename: "Spot";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  appetizer: string;
  entree: string;
  drink: string;
}

export interface SpotsQuery {
  spots: SpotsQuery_spots[];
}

export interface SpotsQueryVariables {
  bounds: BoundsInput;
}
