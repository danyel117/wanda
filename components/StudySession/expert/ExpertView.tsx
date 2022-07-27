import PrivateLayout from '@layouts/PrivateLayout';
import { useStudySession } from 'context/studySession';
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { ExtendedStudySessionTask } from 'types';
import { Enum_StudySessionTaskStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import { MdCancel, MdOutlineCheckCircle } from 'react-icons/md';
import Modal from '@components/modals/Modal';
import { StartTaskButton } from '@components/StudySession/common/StartTaskButton';
import Link from 'next/link';

const ExpertView = () => {
  const { session } = useStudySession();
  const { updateStudySessionData } = useUpdateStudySessionData();

  const expertConsent = async () => {
    await updateStudySessionData({
      id: session.data.id,
      data: {
        expertConsentBegin: {
          set: true,
        },
      },
    });
  };

  return (
    <PrivateLayout>
      <div className='flex flex-col gap-4 p-4 lg:p-10'>
        <div className='flex w-full justify-center'>
          <h1>Participant session controls</h1>
        </div>
        <div className='flex w-full flex-col justify-center gap-4 md:flex-row'>
          <span>
            Study: <strong>{session.study.name}</strong>
          </span>
          <span>
            Participant: <strong>{session.participant.email}</strong>
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <button
            disabled={session.data.expertConsentBegin}
            onClick={expertConsent}
            type='button'
            className='primary'
          >
            Begin session
          </button>
          <span>Session status: {session.status}</span>
        </div>
        {!session.data.participantConsentBegin &&
          session.data.expertConsentBegin && (
            <div>Please wait for the user to be ready.</div>
          )}
        {session.status === 'STARTED' && <CurrentTaskControls />}

        {session.status === 'QUESTIONNAIRE' && (
          <div>Please wait for the user to finish the questionnaire</div>
        )}

        {session.status === 'COMPLETED' && (
          <div className='flex'>
            <Link href={`/app/sessions/${session.id}/results`}>
              <button className='primary' type='button'>
                See evaluation results
              </button>
            </Link>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

const CurrentTaskControls = () => {
  const { currentTask } = useStudySession();

  return (
    <div className='flex flex-col justify-center gap-10 md:flex-row'>
      <div className='card h-64 w-full justify-start'>
        <h2>Current task:</h2>
        <p>{currentTask?.task.description}</p>
        <span>Task url:</span>
        <div className='flex w-full'>
          <a
            className='external flex truncate'
            href={currentTask?.task.url}
            target='_blank'
            rel='noreferrer'
          >
            {currentTask?.task.url}
          </a>
        </div>
      </div>
      <div className='card h-64 w-full justify-start'>
        <h2>Status:</h2>
        <TaskStatuses currentTask={currentTask} />
      </div>
      <div className='card w-full justify-between'>
        <AddComments />
      </div>
    </div>
  );
};

const TaskStatuses = ({
  currentTask,
}: {
  currentTask: ExtendedStudySessionTask | undefined;
}) => {
  if (currentTask?.status === Enum_StudySessionTaskStatus.NOT_STARTED) {
    return (
      <>
        <span>{currentTask?.status}</span>
        <StartTaskButton />
      </>
    );
  }

  if (currentTask?.status === Enum_StudySessionTaskStatus.STARTED) {
    return (
      <>
        <span>{currentTask?.status}</span>
        <StartedTaskStatus currentTask={currentTask?.id ?? ''} />
      </>
    );
  }

  return null;
};

const StartedTaskStatus = ({ currentTask }: { currentTask: string }) => {
  const [status, setStatus] = useState<Enum_StudySessionTaskStatus>(
    Enum_StudySessionTaskStatus.STARTED
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { updateStudySessionTask } = useUpdateStudySessionData();

  const updateStudySessionStatus = async () => {
    await updateStudySessionTask({
      id: currentTask,
      data: {
        status: {
          set: status,
        },
      },
    });
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <button
          onClick={() => {
            setOpenModal(true);
            setStatus(Enum_StudySessionTaskStatus.COMPLETED);
          }}
          type='button'
          className='flex justify-between gap-2 rounded-lg border border-green-500 bg-white p-2 shadow-lg hover:scale-105 hover:text-green-700'
        >
          <span className=''>Mark as succeeded</span>
          <div className='cursor-pointer text-2xl text-green-500 '>
            <MdOutlineCheckCircle />
          </div>
        </button>
        <button
          onClick={() => {
            setOpenModal(true);
            setStatus(Enum_StudySessionTaskStatus.FAILED);
          }}
          type='button'
          className='flex justify-between gap-2 rounded-lg border border-red-500 bg-white p-2 shadow-lg hover:scale-105 hover:text-red-700'
        >
          <span className=''>Mark as failed</span>
          <div className='cursor-pointer text-2xl text-red-500 '>
            <MdCancel />
          </div>
        </button>
      </div>
      <Modal open={openModal} setOpen={setOpenModal} title='Warning'>
        <div className='flex flex-col items-center gap-4'>
          <div>
            <span>You are about to mark the user&apos;s task as</span>
            <span
              className={`font-bold italic ${
                status === 'COMPLETED' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status === 'COMPLETED' ? ' completed' : ' failed'}
            </span>
            <span>.</span>
          </div>
          <span>
            This action cannot be undone and will show the next task to the
            user.
          </span>
          <span>Do you want to continue?</span>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={updateStudySessionStatus}
              className='primary'
            >
              Yes
            </button>
            <button
              type='button'
              className='secondary'
              onClick={() => setOpenModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const AddComments = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentTask } = useStudySession();
  const [comment, setComment] = useState<string>();
  const { updateStudySessionTask } = useUpdateStudySessionData();

  useEffect(() => {
    if (currentTask?.expertComments && !comment && firstLoad) {
      setComment(currentTask.expertComments);
      setFirstLoad(false);
    }
  }, [currentTask, comment, firstLoad]);

  const addComment = async () => {
    setLoading(true);
    await updateStudySessionTask({
      id: currentTask?.id ?? '',
      data: {
        expertComments: {
          set: comment ?? '',
        },
      },
    });
    setLoading(false);
  };
  return (
    <>
      <h2>Comments:</h2>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className='h-full w-full'
        placeholder='Some comment...'
      />
      <button
        disabled={loading}
        type='button'
        className='primary'
        onClick={addComment}
      >
        Save
      </button>
    </>
  );
};

export { ExpertView };
