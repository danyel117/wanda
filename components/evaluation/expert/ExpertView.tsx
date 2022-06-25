import PrivateLayout from '@layouts/PrivateLayout';
import { useEvaluation } from 'context/evaluation';
import { useUpdateEvaluationData } from '@components/evaluation/updateEvaluationData';
import { ExtendedEvaluationTask } from 'types';
import { useEffect, useState } from 'react';
import { Enum_TaskEvaluationStatus } from '@prisma/client';

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
        {!evaluation.data.participantConsentBegin && (
          <div>Please wait for the user to be ready.</div>
        )}
        <CurrentTaskControls />
      </div>
    </PrivateLayout>
  );
};

const CurrentTaskControls = () => {
  const { evaluation, currentTask } = useEvaluation();

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
        <h2>Comments:</h2>
        <textarea className='h-full w-full' placeholder='Some comment...' />
        <button className='primary'>Save</button>
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
        <StartTaskStatus currentTask={currentTask?.id ?? ''} />
      </>
    );
  }

  return null;
};

const StartTaskStatus = ({ currentTask }: { currentTask: string }) => {
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

export { ExpertView };
