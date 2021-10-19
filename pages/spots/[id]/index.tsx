import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import SpotNav from "src/components/spotNav";
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
    return (
      <Layout
        main={<div>Unable to load spot {id}. Please refresh the page.</div>}
      />
    );
  }

  const { spot } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <SpotNav spot={spot} />

            <h1 className="text-3xl font-semibold my-2">{spot.address}</h1>
            <h2 className="text-lg font-medium"></h2>

            <h3 className="text-xl font-bold mt-8 mb-2">Recommended:</h3>
            <h4 className="text-lg font-medium mt-2">🍟 Appetizer</h4>
            <p>{spot.appetizer}</p>
            <h4 className="text-lg font-medium mt-2">🍛 Entree</h4>
            <p>{spot.entree}</p>
            <h4 className="text-lg font-medium mt-2">🍸 Drink</h4>
            <p>{spot.drink}</p>

            <Image
              className="py-2 mt-8"
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
          </div>

          <div className="sm:w-full md:w-1/2">
            <SingleMap spot={spot} nearby={spot.nearby} />
          </div>
        </div>
      }
    />
  );
}
