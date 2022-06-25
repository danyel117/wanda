import Loading from '@components/Loading';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import matchRoles from '@utils/matchRoles';
import { useSession } from 'next-auth/react';
import { EvaluationContextProvider, useEvaluation } from 'context/evaluation';
import { ParticipantView } from '@components/evaluation/user/ParticipantView';
import { ExpertView } from '@components/evaluation/expert/ExpertView';

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

const EvaluationPage: NextPage = () => {
  const router = useRouter();
  const id: string = router.query.id as string;

  return (
    <EvaluationContextProvider id={id}>
      <EvaluationRouter />
    </EvaluationContextProvider>
  );
};

const EvaluationRouter = () => {
  const { data: session } = useSession();
  const { evaluation, loading } = useEvaluation();

  if (loading) return <Loading />;

  return (
    <>
      {evaluation.participant.email === session?.user.email && (
        <ParticipantView />
      )}

      {evaluation.expert.email === session?.user.email && <ExpertView />}

      {evaluation.expert.email !== session?.user.email &&
        evaluation.participant.email !== session?.user.email && (
          <div>You are not authorized to enter this evaluation.</div>
        )}
    </>
  );
};

export default EvaluationPage;
