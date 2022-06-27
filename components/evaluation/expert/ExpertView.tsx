import PrivateLayout from '@layouts/PrivateLayout';
import { useEvaluation } from 'context/evaluation';
import { useUpdateEvaluationData } from '@components/evaluation/updateEvaluationData';
import { ExtendedEvaluationTask } from 'types';
import { Enum_TaskEvaluationStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import { MdCancel, MdOutlineCheckCircle } from 'react-icons/md';
import Modal from '@components/modals/Modal';

const ExpertView = () => {
  const { evaluation } = useEvaluation();
  const { updateEvaluationData } = useUpdateEvaluationData();

  const expertConsent = async () => {
    await updateEvaluationData({
      id: evaluation.data.id,
      data: {
        expertConsentBegin: {
          set: true,
        },
      },
    });
  };

  return (
    <PrivateLayout>
      <div className='flex flex-col gap-4 p-10'>
        <div className='flex w-full justify-center'>
          <h1>User session controls</h1>
        </div>
        <div className='flex w-full justify-center gap-4'>
          <span>
            Study: <strong>{evaluation.study.name}</strong>
          </span>
          <span>
            Participant: <strong>{evaluation.participant.email}</strong>
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <button
            disabled={evaluation.data.expertConsentBegin}
            onClick={expertConsent}
            type='button'
            className='primary'
          >
            Begin session
          </button>
        </div>
        {!evaluation.data.participantConsentBegin &&
          evaluation.data.expertConsentBegin && (
            <div>Please wait for the user to be ready.</div>
          )}
        {evaluation.status === 'STARTED' && <CurrentTaskControls />}
      </div>
    </PrivateLayout>
  );
};

const CurrentTaskControls = () => {
  const { currentTask } = useEvaluation();

  return (
    <div className='flex justify-center gap-10'>
      <div className='card h-64 w-80 justify-start'>
        <h2>Current task:</h2>
        <p>{currentTask?.task.description}</p>
        <span>Task url:</span>
        <div className='truncate'>
          <a
            className='external'
            href={currentTask?.task.url}
            target='_blank'
            rel='noreferrer'
          >
            {currentTask?.task.url}
          </a>
        </div>
      </div>
      <div className='card h-64 w-80 justify-start'>
        <h2>Status:</h2>
        <TaskStatuses currentTask={currentTask} />
      </div>
      <div className='card w-80 justify-between'>
        <AddComments />
      </div>
    </div>
  );
};

const TaskStatuses = ({
  currentTask,
}: {
  currentTask: ExtendedEvaluationTask | undefined;
}) => {
  if (currentTask?.status === Enum_TaskEvaluationStatus.NOT_STARTED) {
    return (
      <>
        <span>{currentTask?.status}</span>
        <NotStartedTaskStatus currentTask={currentTask?.id ?? ''} />
      </>
    );
  }

  if (currentTask?.status === Enum_TaskEvaluationStatus.STARTED) {
    return (
      <>
        <span>{currentTask?.status}</span>
        <StartedTaskStatus currentTask={currentTask?.id ?? ''} />
      </>
    );
  }

  return null;
};

const NotStartedTaskStatus = ({ currentTask }: { currentTask: string }) => {
  const { updateEvaluationTask } = useUpdateEvaluationData();
  const startTask = async () => {
    await updateEvaluationTask({
      id: currentTask,
      data: {
        status: {
          set: 'STARTED',
        },
      },
    });
  };
  return (
    <button type='button' onClick={startTask} className='primary'>
      Start Task
    </button>
  );
};

const StartedTaskStatus = ({ currentTask }: { currentTask: string }) => {
  const [status, setStatus] = useState<Enum_TaskEvaluationStatus>(
    Enum_TaskEvaluationStatus.STARTED
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { updateEvaluationTask } = useUpdateEvaluationData();

  const updateEvaluationStatus = async () => {
    await updateEvaluationTask({
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
            setStatus(Enum_TaskEvaluationStatus.COMPLETED);
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
            setStatus(Enum_TaskEvaluationStatus.FAILED);
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
              onClick={updateEvaluationStatus}
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
  const { currentTask } = useEvaluation();
  const [comment, setComment] = useState<string>();
  const { updateEvaluationTask } = useUpdateEvaluationData();

  useEffect(() => {
    if (currentTask?.expertComments && !comment && firstLoad) {
      setComment(currentTask.expertComments);
      setFirstLoad(false);
    }
  }, [currentTask, comment, firstLoad]);

  const addComment = async () => {
    setLoading(true);
    await updateEvaluationTask({
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
