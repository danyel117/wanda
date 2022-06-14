import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import PrivateRoute from '@components/PrivateRoute';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{`${pageProps?.page?.name} | Wanda`}</title>
      </Head>
      <PrivateRoute rejected={pageProps.rejected} isPublic={pageProps.isPublic}>
        <Component {...pageProps} />;
      </PrivateRoute>
    </SessionProvider>
  );
}

export default MyApp;
