import VoiceRecorder from '@components/voice-recorder/VoiceRecorder';
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

const AppIndex: NextPage = () => (
  <div className='flex flex-col h-full w-full'>
    <span>Wanda Internal panel. Expect more things here soon 😎</span>
    <div className='flex w-full h-full justify-center'>
      <VoiceRecorder />
    </div>
  </div>
);

export default AppIndex;
