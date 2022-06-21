/* eslint-disable react/jsx-no-useless-fragment */
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import PrivateRoute from '@components/PrivateRoute';
import useApolloClient from 'hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

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
          <Component {...pageProps} />
        </PrivateRoute>
        <ToastContainer />
      </ApolloProvider>
    </SessionProvider>
  );
};

export default MyApp;
