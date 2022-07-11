import Loading from '@components/Loading';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import matchRoles from '@utils/matchRoles';
import { useSession } from 'next-auth/react';
import {
  StudySessionContextProvider,
  useStudySession,
} from 'context/studySession';
import { ParticipantView } from '@components/StudySession/user/ParticipantView';
import { ExpertView } from '@components/StudySession/expert/ExpertView';

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

const StudySessionPage: NextPage = () => {
  const router = useRouter();
  const id: string = router.query.id as string;

  return (
    <StudySessionContextProvider id={id}>
      <SessionRouter />
    </StudySessionContextProvider>
  );
};

const SessionRouter = () => {
  const { data: userSession } = useSession();
  const { session, loading } = useStudySession();

  if (loading) return <Loading />;

  return (
    <>
      {session.participant.email === userSession?.user.email && (
        <ParticipantView />
      )}

      {session.expert.email === userSession?.user.email && <ExpertView />}

      {session.expert.email !== userSession?.user.email &&
        session.participant.email !== userSession?.user.email && (
          <div>You are not authorized to enter this session.</div>
        )}
    </>
  );
};

export default StudySessionPage;
