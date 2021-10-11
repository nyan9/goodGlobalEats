import { GetServerSideProps, NextApiRequest } from "next";
import { loadIdToken } from "src/auth/firebaseAdmin";
// import Layout from "src/components/layout";
// import SpotForm from "src/components/spotForm";

export default function PutOn() {
  return <div>Add</div>;
}

// intercept putOn route access
// redirect to "/auth" if not logged in
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};
