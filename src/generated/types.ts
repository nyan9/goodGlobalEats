export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type BoundsInput = {
  ne: CoordinatesInput;
  sw: CoordinatesInput;
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type ImageSignature = {
  __typename?: 'ImageSignature';
  signature: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createImageSignature: ImageSignature;
  createSpot?: Maybe<Spot>;
  deleteSpot: Scalars['Boolean']['output'];
  updateSpot?: Maybe<Spot>;
};


export type MutationCreateSpotArgs = {
  input: SpotInput;
};


export type MutationDeleteSpotArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateSpotArgs = {
  id: Scalars['String']['input'];
  input: SpotInput;
};

export type Query = {
  __typename?: 'Query';
  spot?: Maybe<Spot>;
  spots: Array<Spot>;
};


export type QuerySpotArgs = {
  id: Scalars['String']['input'];
};


export type QuerySpotsArgs = {
  bounds: BoundsInput;
};

export type Spot = {
  __typename?: 'Spot';
  address: Scalars['String']['output'];
  appetizer: Scalars['String']['output'];
  drink: Scalars['String']['output'];
  entree: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  nearby: Array<Spot>;
  publicId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SpotInput = {
  address: Scalars['String']['input'];
  appetizer: Scalars['String']['input'];
  coordinates: CoordinatesInput;
  drink: Scalars['String']['input'];
  entree: Scalars['String']['input'];
  image: Scalars['String']['input'];
};

export type SpotsQueryQueryVariables = Exact<{
  bounds: BoundsInput;
}>;


export type SpotsQueryQuery = { __typename?: 'Query', spots: Array<{ __typename?: 'Spot', id: string, latitude: number, longitude: number, address: string, publicId: string, appetizer: string, entree: string, drink: string }> };

export type EditSpotQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type EditSpotQueryQuery = { __typename?: 'Query', spot?: { __typename?: 'Spot', id: string, userId: string, address: string, image: string, publicId: string, appetizer: string, entree: string, drink: string, latitude: number, longitude: number } | null };

export type ShowSpotQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ShowSpotQueryQuery = { __typename?: 'Query', spot?: { __typename?: 'Spot', id: string, userId: string, address: string, publicId: string, appetizer: string, entree: string, drink: string, latitude: number, longitude: number, nearby: Array<{ __typename?: 'Spot', id: string, latitude: number, longitude: number }> } | null };

export type CreateSignatureMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateSignatureMutationMutation = { __typename?: 'Mutation', createImageSignature: { __typename?: 'ImageSignature', signature: string, timestamp: number } };

export type CreateSpotMutationMutationVariables = Exact<{
  input: SpotInput;
}>;


export type CreateSpotMutationMutation = { __typename?: 'Mutation', createSpot?: { __typename?: 'Spot', id: string } | null };

export type UpdateSpotMutationMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: SpotInput;
}>;


export type UpdateSpotMutationMutation = { __typename?: 'Mutation', updateSpot?: { __typename?: 'Spot', id: string, image: string, publicId: string, address: string, latitude: number, longitude: number, appetizer: string, entree: string, drink: string } | null };

export type DeleteSpotMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteSpotMutation = { __typename?: 'Mutation', deleteSpot: boolean };
