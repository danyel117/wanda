import { GetServerSideProps, NextPage } from 'next';
import matchRoles from 'utils/matchRoles';

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

const SessionId: NextPage = () => {
    
  return (
    <div className='h-screen w-screen'>
      <iframe
        className='w-full h-full'
        src='https://dummy-usability-page.vercel.app/'
        title='page'
      />
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <div className='relative flex w-screen h-screen'>test</div>
      </div>
    </div>
  );
};

export default SessionId;
