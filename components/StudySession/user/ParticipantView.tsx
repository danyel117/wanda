import Modal from '@components/modals/Modal';
import dynamic from 'next/dynamic';
import { Enum_StudySessionStatus } from '@prisma/client';
import { useStudySession } from 'context/studySession';
import { useUpdateStudySessionData } from '@components/StudySession/updateStudySessionData';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { StartedState } from '@components/StudySession/user/StartedState';

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  { ssr: false }
);

const ParticipantView = () => {
  const { session } = useStudySession();
  return (
    <div className='h-screen w-screen'>
      <iframe
        className='absolute top-0 left-0 z-20 h-full w-full'
        src={`${session.study.site}`}
        title='page'
      />
      <div className='absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden'>
        <div className='relative flex h-screen w-screen'>
          <ParticipantStatuses />
        </div>
      </div>
    </div>
  );
};

const ParticipantStatuses = () => {
  const { session } = useStudySession();

  if (session.status === 'NOT_STARTED') {
    return <CreatedState script={session.study.script.script} />;
  }

  if (session.status === 'STARTED') {
    return <StartedState />;
  }

  return null;
};

const CreatedState = ({ script }: { script: string }) => {
  const [open, setOpen] = useState<boolean>(true);
  const { session } = useStudySession();
  const { updateStudySessionData, updateStudySession } =
    useUpdateStudySessionData();

  const participantConsent = async () => {
    try {
      await updateStudySessionData({
        id: session.data.id,
        data: {
          participantConsentBegin: {
            set: true,
          },
          currentTask: {
            set: 1,
          },
        },
      });
      await updateStudySession({
        id: session.id,
        data: {
          status: {
            set: Enum_StudySessionStatus.STARTED,
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
        {session.data.expertConsentBegin && (
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
