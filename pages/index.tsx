import { LoginButton } from '@components/LoginButton';
import LoginModal from '@components/modals/LoginModal';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div className='flex h-screen w-screen'>
      <Head>
        <title>Wanda</title>
        <meta name='description' content='Think Aloud made easy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col w-full h-full justify-center items-center gap-4'>
        <div className='flex flex-col gap-2 items-center'>
          <h1>Welcome to Wanda!</h1>
          <h2>Think Aloud evaluations made easy</h2>
        </div>
        <div className='flex gap-3'>
          <button className='secondary'>How does it work?</button>
          <LoginButton />
        </div>
      </main>
    </div>
  );
};

export default Home;
