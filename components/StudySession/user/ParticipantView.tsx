import Modal from '@components/modals/Modal';
import dynamic from 'next/dynamic';
import { Enum_StudySessionStatus } from '@prisma/client';
import { useStudySession } from 'context/studySession';
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { StartedState } from '@components/StudySession/user/StartedState';
import Loading from '@components/Loading';
import Link from 'next/link';
import { ModalQuestionnaireState } from '@components/StudySession/user/QuestionnaireState';

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
      <div className='absolute top-0 left-0 z-30'>
        <div className='relative'>
          <ParticipantStatuses />
        </div>
      </div>
    </div>
  );
};

const ParticipantStatuses = () => {
  const { session } = useStudySession();

  if (session.status === 'NOT_STARTED') {
    return <CreatedState />;
  }

  if (session.status === 'STARTED') {
    return <StartedState />;
  }

  if (session.status === 'QUESTIONNAIRE') {
    return <ModalQuestionnaireState />;
  }

  if (session.status === 'COMPLETED') {
    return <CompletedState />;
  }

  return null;
};

const CreatedState = () => {
  const { script, session } = useStudySession();
  const [open, setOpen] = useState<boolean>(true);
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

  if (!script) return <Loading />;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title='Welcome and thank you for participating!'
    >
      <div className='flex flex-col gap-4'>
        <MarkdownRenderer md={script?.script ?? ''} />
        <div>
          <span>Hear your expert explainig you the session</span>
          <audio src={script?.recording ?? ''} controls />
        </div>
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

const CompletedState = () => (
  <Modal open setOpen={() => {}}>
    <div className='flex flex-col items-center gap-3'>
      <h2>This evaluation is finished</h2>
      <span>
        Thank you very much for participating, we appreciate your support
      </span>
      <Link href='/app/sessions'>
        <a>
          <button className='primary' type='button'>
            Go to my evaluations
          </button>
        </a>
      </Link>
    </div>
  </Modal>
);

export { ParticipantView };
