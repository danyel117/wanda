import Modal from '@components/modals/Modal';
import dynamic from 'next/dynamic';
import { Enum_StudySessionStatus } from '@prisma/client';
import { useStudySession } from 'context/studySession';
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { StartedState } from '@components/StudySession/user/StartedState';
import Loading, { MiniLoading } from '@components/Loading';
import Link from 'next/link';
import { ModalQuestionnaireState } from '@components/StudySession/user/QuestionnaireState';
import Joyride, { Step } from 'react-joyride';
import { TutorialContextProvider, useTutorial } from 'context/tutorial';

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  { ssr: false }
);

const ParticipantView = () => {
  const { session, currentTask } = useStudySession();
  return (
    <TutorialContextProvider>
      <div className='h-screen w-screen'>
        <iframe
          className='absolute top-0 left-0 z-20 h-full w-full'
          src={`${
            session.data.currentTask === 0 ||
            session.status === Enum_StudySessionStatus.QUESTIONNAIRE ||
            session.status === Enum_StudySessionStatus.COMPLETED
              ? session.study.site
              : currentTask?.task.url
          }`}
          title='page'
        />
        <div className='absolute top-0 left-0 z-30'>
          <div className='relative'>
            <ParticipantStatuses />
          </div>
        </div>
      </div>
    </TutorialContextProvider>
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
  const [loading, setLoading] = useState<boolean>(false);
  const { showTutorial, setShowTutorial } = useTutorial();
  const [showScript, setShowScript] = useState<boolean>(false);
  const { script, session } = useStudySession();
  const [open, setOpen] = useState<boolean>(true);
  const { updateStudySessionData, updateStudySession } =
    useUpdateStudySessionData();

  const participantConsent = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const steps = [
    {
      target: '#reactour__script',
      content: 'Read the description of the session',
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '#reactour__script-listen',
      content: 'Listen to the description of the session if you want',
      placement: 'right',
    },
    {
      target: '#reactour__begin-session',
      content:
        'Begin the session once you understand the objective of the session',
      placement: 'right',
    },
  ] as Step[];

  if (!script) return <Loading />;

  return (
    <Modal open={open} setOpen={setOpen} title='Thank you for participating!'>
      {!showScript ? (
        <div className='flex flex-col gap-3'>
          <h2>Welcome to Wanda!</h2>
          <span>
            Wanda is a tool for evaluating websites. Wanda will show you
            different tasks you need to execute within the website you will
            evaluate.
          </span>
          <span>
            We encourage you to think aloud while you are executing your tasks.
            We will record your thoughts and use them for improving the
            usability of the website you will evaluate, so please make sure to
            allow your browser&apos;s microphone usage when prompted!
          </span>
          <div className='flex w-full justify-center gap-3'>
            <button
              type='button'
              className='secondary'
              onClick={() => setShowScript(true)}
            >
              Let&apos;s begin! (no tutorial)
            </button>
            <button
              type='button'
              className='primary'
              onClick={() => {
                setShowScript(true);
                setShowTutorial(true);
              }}
            >
              Show me how it works
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div id='reactour__script'>
            <MarkdownRenderer md={script?.script ?? ''} />
          </div>
          <div>
            <span>Listen to your expert explaining you the session</span>
            <audio
              id='reactour__script-listen'
              src={script?.recording ?? ''}
              controls
            />
          </div>
          {session.data.expertConsentBegin && (
            <div className='flex w-full justify-center'>
              <button
                onClick={participantConsent}
                className='primary'
                type='button'
                id='reactour__begin-session'
              >
                {!loading ? <span>Begin session</span> : <MiniLoading />}
              </button>
            </div>
          )}
        </div>
      )}
      <Joyride
        steps={steps}
        run={showTutorial && showScript}
        continuous
        showProgress
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
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
