import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import SpotList from "src/components/spotList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery, SpotsQueryVariables } from "src/generated/SpotsQuery";

const SPOTS_QUERY = gql`
  query SpotsQuery($bounds: BoundsInput!) {
    spots(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      appetizer
      entree
      drink
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];
const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;

  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Spot() {
  const [highlightedMarkId, setHighlightedMarkId] = useState<string | null>(null);
  const [highlightedListId, setHighlightedListId] = useState<string | null>(null);
  // string type because useDebounce does a shallow compare. Also being saved to localStorage.
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );

  // reduce the amount of queries called to the apollo server when zooming in/out of map
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery<SpotsQuery, SpotsQueryVariables>(
    SPOTS_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );

  // custom hook to prevent data flickering (undefined) when querying SPOTS_QUERY
  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loading spots</div>} />;

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            <SpotList
              spots={lastData ? lastData.spots : []}
              highlightedListId={highlightedListId}
              setHighlightedMarkId={setHighlightedMarkId}
            />
          </div>
          <div className="w-1/2">
            <Map
              setDataBounds={setDataBounds}
              spots={lastData ? lastData.spots : []}
              highlightedMarkId={highlightedMarkId}
              setHighlightedListId={setHighlightedListId}
            />
          </div>
        </div>
      }
    />
  );
}
