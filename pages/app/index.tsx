import { GetServerSideProps, NextPage } from 'next';
// import dynamic from 'next/dynamic';
import matchRoles from 'utils/matchRoles';

// const VoiceRecorder = dynamic(() =>
//   import('@components/voice-recorder/VoiceRecorder')
// );

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

const AppIndex: NextPage = () => (
  <div className='flex'>
    <div className='h-44 w-44 border-2 border-red-400'>data 1</div>
    <div className='h-44 w-44 border-2 border-red-400'>data 1</div>
  </div>
);

export default AppIndex;
