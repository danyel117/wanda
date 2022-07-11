import matchRoles from '@utils/matchRoles';
import {
  StudySessionContextProvider,
  useStudySession,
} from 'context/studySession';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

const SessionResults: NextPage = () => {
  const router = useRouter();
  const id: string = router.query.id as string;

  // const {session} = us
  return (
    <StudySessionContextProvider id={id}>
      <SessionResultComponent />
    </StudySessionContextProvider>
  );
};

const SessionResultComponent = () => {
  const { session } = useStudySession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return <div>Session</div>;
};

export default SessionResults;
