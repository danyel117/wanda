/* eslint-disable arrow-body-style */
import { useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import Modal from '@components/modals/Modal';
import PrivateComponent from '@components/PrivateComponent';
import { GET_SESSION } from 'graphql/queries/session';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Draggable from 'react-draggable';
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

const SessionId: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_SESSION, {
    variables: {
      evaluationSessionId: id,
    },
    pollInterval: 500,
  });

  if (loading) return <Loading />;

  return (
    <div className='h-screen w-screen'>
      <iframe
        className='w-full h-full'
        src={`${data.evaluationSession.study.site}`}
        title='page'
      />
      <div className='absolute top-0 left-0 w-screen h-screen overflow-hidden'>
        <div className='relative flex w-screen h-screen'>
          <PrivateComponent roleList={['ADMIN', 'EXPERT']}>
            <Draggable>
              <div>Begin Session</div>
            </Draggable>
          </PrivateComponent>
          <PrivateComponent roleList={['USER']}>
            <CreatedState script={data.evaluationSession.script.script} />
          </PrivateComponent>
        </div>
      </div>
    </div>
  );
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
      <span>{script}</span>
    </Modal>
  );
};

export default SessionId;
