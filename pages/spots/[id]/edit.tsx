import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import SpotForm from "src/components/spotForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditSpotQuery,
  EditSpotQueryVariables,
} from "src/generated/EditSpotQuery";

const EDIT_SPOT_QUERY = gql`
  query EditSpotQuery($id: String!) {
    spot(id: $id) {
      id
      userId
      address
      image
      publicId
      appetizer
      entree
      drink
      latitude
      longitude
    }
  }
`;

export default function EditSpot() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <SpotData id={id as string} />;
}

function SpotData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<EditSpotQuery, EditSpotQueryVariables>(
    EDIT_SPOT_QUERY,
    {
      variables: { id },
    }
  );

  if (!user) return <Layout main={<div>Please Login to Edit</div>} />;
  if (loading) return <Layout main={<div>loading..</div>} />;
  if (data && !data.spot)
    return <Layout main={<div>Unable to load house</div>} />;
  if (user.uid !== data?.spot?.userId)
    return (
      <Layout main={<div>You don't have permission to edit this spot</div>} />
    );

  return <Layout main={<SpotForm spot={data.spot} />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};
