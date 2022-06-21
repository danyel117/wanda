/* eslint-disable arrow-body-style */
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import matchRoles from '@utils/matchRoles';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { rejected, isPublic, page } = await matchRoles(ctx);
  return {
    props: {
      rejected,
      isPublic,
      page,
    },
  };
};
const Studies: NextPage = () => {
  return (
    <div className='flex flex-col h-full w-full p-10'>
      <div className='flex w-full'>
        <h1 className='w-full text-center'>Study management</h1>
        <div className='w-1/5 flex justify-center'>
          <Link href='/app/studies/new'>
            <a>
              <button className='primary' type='button'>
                Create new
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Studies;
