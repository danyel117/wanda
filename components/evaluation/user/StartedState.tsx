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
import { useEffect, useState } from 'react';
import { useVoiceRecorder } from 'hooks/useVoiceRecorder';
import { Enum_TaskEvaluationStatus } from '@prisma/client';
import { uploadFormFiles } from '@utils/uploadS3';
import { useUpdateEvaluationData } from '@components/evaluation/updateEvaluationData';
import { useSession } from 'next-auth/react';

const StartedState = () => {
  const { data: session } = useSession();
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] =
    useState<Enum_TaskEvaluationStatus>();
  const { evaluation, currentTask } = useEvaluation();
  const [recordingFile, setRecordingFile] = useState<File>();
  const { handleRecord, clearBlobUrl } = useVoiceRecorder({
    fileName: 'evaluation-task',
    setRecordingFile,
  });
  const { updateEvaluationData, updateEvaluationTask } =
    useUpdateEvaluationData();

  useEffect(() => {
    if (
      currentStatus === Enum_TaskEvaluationStatus.NOT_STARTED &&
      currentTask?.status === Enum_TaskEvaluationStatus.STARTED
    ) {
      // transition from not started to started
      clearBlobUrl(); // clear the blob if it existis
      handleRecord(); // begin audio recording
    } else if (
      currentStatus === Enum_TaskEvaluationStatus.STARTED &&
      (currentTask?.status === Enum_TaskEvaluationStatus.COMPLETED ||
        currentTask?.status === Enum_TaskEvaluationStatus.FAILED)
    ) {
      // transition from started to either failed or completed
      handleRecord(); // finish audio recording
      setTaskFinished(true);
    }
    setCurrentStatus(currentTask?.status);
  }, [clearBlobUrl, currentStatus, currentTask, handleRecord]);

  useEffect(() => {
    const finishTask = async () => {
      const uploadedFiles = await uploadFormFiles(
        {
          recording: recordingFile as File,
        },
        `${session?.user.id}/studies/${evaluation.study.id}/evaluations/${evaluation.id}/audio`
      );

      await updateEvaluationTask({
        id: currentTask?.id ?? '',
        data: {
          userRecording: {
            set: uploadedFiles.recording as string,
          },
        },
      });

      await updateEvaluationData({
        id: evaluation.data.id,
        data: {
          currentTask: {
            set: evaluation.data.currentTask + 1,
          },
        },
      });
    };
    if (recordingFile && taskFinished) {
      finishTask();
    }
  }, [recordingFile, taskFinished]);

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
