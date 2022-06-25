/* eslint-disable arrow-body-style */
import { useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import Modal from '@components/modals/Modal';
import PrivateComponent from '@components/PrivateComponent';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Draggable from 'react-draggable';
import matchRoles from '@utils/matchRoles';
import { Enum_RoleName } from '@prisma/client';
import { GET_EVALUATION } from 'graphql/queries/evaluation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ExtendedEvaluationSession } from 'types';
import { useEffect } from 'react';

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  { ssr: false }
);

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
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_EVALUATION, {
    variables: {
      evaluationSessionId: id,
    },
    pollInterval: 500,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) return <Loading />;

  if (data.evaluationSession.participant.email === session?.user.email) {
    return <ParticipantView evaluationSession={data.evaluationSession} />;
  }

  if (data.evaluationSession.expert.email === session?.user.email) {
    return <ExpertView />;
  }

  return null;
};

interface EvaluationSessionView {
  evaluationSession: ExtendedEvaluationSession;
}

const ParticipantView = ({ evaluationSession }: EvaluationSessionView) => {
  return (
    <div className='h-screen w-screen'>
      <iframe
        className='h-full w-full'
        src={`${evaluationSession.study.site}`}
        title='page'
      />
      <div className='absolute top-0 left-0 h-screen w-screen overflow-hidden'>
        <div className='relative flex h-screen w-screen'>
          <PrivateComponent
            roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
          >
            <Draggable>
              <div>Begin Session</div>
            </Draggable>
          </PrivateComponent>
          <PrivateComponent roleList={[Enum_RoleName.PARTICIPANT]}>
            <CreatedState script={evaluationSession.study.script.script} />
          </PrivateComponent>
        </div>
      </div>
    </div>
  );
};

const ExpertView = () => {
  return <div>Expert view </div>;
};

interface CreatedStateProps {
  script: string;
}

const CreatedState = ({ script }: CreatedStateProps) => {
  return (
    <Modal
      open
      setOpen={() => {}}
      title='Welcome and thank you for participating!'
    >
      <MarkdownRenderer md={script} />
    </Modal>
  );
};

export default EvaluationPage;
