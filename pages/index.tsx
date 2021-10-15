// import { useState } from "react";
// import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import SpotList from "src/components/spotList";
// import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
// import { SpotsQuery, SpotsQueryVariables } from "src/generated/SpotsQuery";

type BoundsArray = [[number, number], [number, number]];

export default function Spot() {
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]"
  );

  // reduce the amount of queries called to the apollo server when zooming in/out of map
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            SpotList
          </div>
          <div className="w-1/2">
            <Map setDataBounds={setDataBounds} />
          </div>
        </div>
      }
    />
  );
}
