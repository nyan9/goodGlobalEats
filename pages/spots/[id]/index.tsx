import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
// import SpotNav from "src/components/";
import SingleMap from "src/components/singleMap";
import {
  ShowSpotQuery,
  ShowSpotQueryVariables,
} from "src/generated/ShowSpotQuery";

const SHOW_SPOT_QUERY = gql`
  query ShowSpotQuery($id: String!) {
    spot(id: $id) {
      id
      userId
      address
      publicId
      appetizer
      entree
      drink
      latitude
      longitude
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function ShowSpot() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <SpotData id={id as string} />;
}

function SpotData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowSpotQuery, ShowSpotQueryVariables>(
    SHOW_SPOT_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div> Loading....</div>} />;
  if (!data.spot) {
    return <Layout main={<div>Unable to load spot {id}</div>} />;
  }

  const { spot } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl my-2">{spot.address}</h1>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={spot.publicId}
              alt={spot.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            <p> Recommended Appetizer: 🍟 {spot.appetizer}</p>
            <p> Recommended Entree: 🍛 {spot.entree}</p>
            <p> Recommneded Drink: 🍸 {spot.drink}</p>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap spot={spot} nearby={spot.nearby}/>
          </div>
        </div>
      }
    />
  );
}
