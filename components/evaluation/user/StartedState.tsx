import {
  MdCancel,
  MdOutlineCheckCircle,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import Draggable from 'react-draggable';
import { Tooltip } from '@mui/material';
import { ExtendedEvaluationTask } from 'types';
import { useEvaluation } from 'context/evaluation';
import Modal from '@components/modals/Modal';
import { useState } from 'react';

const StartedState = () => {
  const { evaluation, currentTask } = useEvaluation();

  if (currentTask?.status === 'NOT_STARTED') {
    return (
      <Modal open setOpen={() => {}}>
        <div className='flex flex-col gap-3'>
          <span className='font-bold text-gray-900'>
            You are about to start the task # {evaluation.data.currentTask}
          </span>
          <span>Task description:</span>
          <div className='max-h-36 overflow-y-auto'>
            <p>{currentTask.task.description}</p>
          </div>
          <span>Hear your expert explaining you the task:</span>
          <audio src={currentTask?.task.recording ?? ''} controls />
        </div>
      </Modal>
    );
  }

  if (currentTask?.status === 'STARTED') {
    return <TaskEvaluationControls currentTask={currentTask} />;
  }

  return null;
};

const TaskEvaluationControls = ({
  currentTask,
}: {
  currentTask: ExtendedEvaluationTask;
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  return (
    <Draggable>
      <div className='flex h-24 flex-col items-start justify-center'>
        <div className='flex items-center'>
          <div className='cursor-move font-bold'>Task controls</div>
          <button type='button' onClick={() => setShowOptions(!showOptions)}>
            {showOptions ? (
              <MdOutlineKeyboardArrowUp />
            ) : (
              <MdOutlineKeyboardArrowDown />
            )}
          </button>
        </div>
        {showOptions && (
          <div className='flex items-center gap-3'>
            <audio src={currentTask?.task.recording ?? ''} controls />
            <Tooltip title='Mark task as finished'>
              <div className='cursor-pointer text-2xl text-green-500 hover:text-green-700'>
                <MdOutlineCheckCircle />
              </div>
            </Tooltip>
            <Tooltip title='Mark task as failed'>
              <div className='cursor-pointer text-2xl text-red-500 hover:text-red-700'>
                <MdCancel />
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export { StartedState };
