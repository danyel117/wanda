import Modal from '@components/modals/Modal';
import dynamic from 'next/dynamic';
import { Enum_EvaluationSessionStatus } from '@prisma/client';
import { useEvaluation } from 'context/evaluation';
import { useUpdateEvaluationData } from '@components/evaluation/updateEvaluationData';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { StartedState } from '@components/evaluation/user/StartedState';

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  { ssr: false }
);

const ParticipantView = () => {
  const { evaluation } = useEvaluation();
  return (
    <div className='h-screen w-screen'>
      <iframe
        className='h-full w-full'
        src={`${evaluation.study.site}`}
        title='page'
      />
      <div className='absolute top-0 left-0 h-screen w-screen overflow-hidden'>
        <div className='relative flex h-screen w-screen'>
          <ParticipantStatuses />
        </div>
      </div>
    </div>
  );
};

const ParticipantStatuses = () => {
  const { evaluation } = useEvaluation();

  if (evaluation.status === 'NOT_STARTED') {
    return <CreatedState script={evaluation.study.script.script} />;
  }

  if (evaluation.status === 'STARTED') {
    return <StartedState />;
  }

  return null;
};

const CreatedState = ({ script }: { script: string }) => {
  const [open, setOpen] = useState<boolean>(true);
  const { evaluation } = useEvaluation();
  const { updateEvaluationData, updateEvaluation } = useUpdateEvaluationData();

  const participantConsent = async () => {
    try {
      await updateEvaluationData({
        id: evaluation.data.id,
        data: {
          participantConsentBegin: {
            set: true,
          },
          currentTask: {
            set: 1,
          },
        },
      });
      await updateEvaluation({
        id: evaluation.id,
        data: {
          status: {
            set: Enum_EvaluationSessionStatus.STARTED,
          },
        },
      });
      toast.success('Session started!');
      setOpen(false);
    } catch {
      toast.error('Error starting session...');
    }
  };
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title='Welcome and thank you for participating!'
    >
      <div className='flex flex-col gap-4'>
        <MarkdownRenderer md={script} />
        {evaluation.data.expertConsentBegin && (
          <div className='flex w-full justify-center'>
            <button
              onClick={participantConsent}
              className='primary'
              type='button'
            >
              Begin session
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export { ParticipantView };
