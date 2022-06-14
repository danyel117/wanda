import { LoginButton } from '@components/LoginButton';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import matchRoles from 'utils/matchRoles';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { rejected, isPublic, page } = await matchRoles(ctx);
  return {
    props: {
      rejected,
      isPublic,
      page,
    },
  };
};

const Home: NextPage = () => {
  return (
    <div className='flex h-screen w-screen'>


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
