import { LoginButton } from '@components/LoginButton';
import { GetServerSideProps, NextPage } from 'next/types';

import matchRoles from '@utils/matchRoles';

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

const Home: NextPage = () => (
  <div className='flex h-screen w-screen bg-white'>
    <main className='flex h-full w-full flex-col items-center justify-center gap-4'>
      <div className='flex flex-col items-center gap-2'>
        <h1>Welcome to Wanda!</h1>
        <h2>Think Aloud evaluations made easy</h2>
      </div>
      <div className='flex gap-3'>
        <button type='button' className='secondary'>
          How does it work?
        </button>
        <LoginButton />
      </div>
    </main>
  </div>
);

export default Home;
