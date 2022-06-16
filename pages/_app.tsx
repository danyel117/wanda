/* eslint-disable react/jsx-no-useless-fragment */
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import PrivateRoute from '@components/PrivateRoute';
import 'styles/globals.css';
import useApolloClient from 'hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const { client } = useApolloClient();
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{`${pageProps?.page?.name ?? 'Home'} | Wanda`}</title>
        <meta name='description' content='Think Aloud made easy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ApolloProvider client={client}>
        <PrivateRoute
          rejected={pageProps.rejected}
          isPublic={pageProps.isPublic}
        >
          <>
            <Component {...pageProps} />
          </>
        </PrivateRoute>
      </ApolloProvider>
    </SessionProvider>
  );
};

export default MyApp;
