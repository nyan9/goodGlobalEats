import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { useApollo } from "src/apollo";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo();

  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={client}>
        <Head>
          <title>Good Global Eats</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="GoodGlobalEats" key="title" />
          <meta
            name="description"
            property="og:description"
            content="Discover your next good eats"
          />
          <meta
            name="image"
            property="og:image"
            content="/goodglobaleats.gif"
          />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
}
