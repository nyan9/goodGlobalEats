import { GetServerSideProps } from "next";
import { auth } from "../../auth";
import Layout from "src/components/layout";
import SpotForm from "src/components/spotForm";

export default function PutOn() {
  return <Layout main={<SpotForm />} />;
}

// intercept putOn route access
// redirect to "/auth" if not logged in
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
