/* eslint-disable react/jsx-no-useless-fragment */
import 'styles/globals.css';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import PrivateRoute from '@components/PrivateRoute';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <SessionProvider session={session}>
    <Head>
      <title>{`${pageProps?.page?.name ?? 'Home'} | Wanda`}</title>
      <meta name='description' content='Think Aloud made easy' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <PrivateRoute rejected={pageProps.rejected} isPublic={pageProps.isPublic}>
      <>
        <Component {...pageProps} />
      </>
    </PrivateRoute>
  </SessionProvider>
);

export default MyApp;
