import { signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { auth } from "../auth";
import Layout from "src/components/layout";

export default function Auth() {
  return (
    <Layout
      main={
        <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
          <div className="bg-gray-800 rounded-lg p-10 flex flex-col items-center gap-6 shadow-xl">
            <img src="/gge-color.png" alt="Good Global Eats" className="w-16" />
            <h1 className="text-2xl font-bold text-white">Good Global Eats</h1>
            <p className="text-gray-400 text-sm">
              Sign in to discover and share great eats
            </p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center gap-3 bg-white text-gray-900 font-semibold py-2 px-6 rounded hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://accounts.google.com/favicon.ico"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      }
    />
  );
}

// Redirect to home if already signed in
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
