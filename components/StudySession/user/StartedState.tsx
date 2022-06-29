import {
  MdCancel,
  MdOutlineCheckCircle,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import Draggable from 'react-draggable';
import { Tooltip } from '@mui/material';
import { useStudySession } from 'context/studySession';
import Modal from '@components/modals/Modal';
import { useEffect, useState } from 'react';
import { useVoiceRecorder } from 'hooks/useVoiceRecorder';
import {
  Enum_StudySessionStatus,
  Enum_StudySessionTaskStatus,
} from '@prisma/client';
import { uploadFormFiles } from '@utils/uploadS3';
import { useUpdateStudySessionData } from '@components/StudySession/updateStudySessionData';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const StartedState = () => {
  const { data: userSession } = useSession();
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] =
    useState<Enum_StudySessionTaskStatus>();
  const { session, currentTask, taskAudio } = useStudySession();
  const [recordingFile, setRecordingFile] = useState<File>();
  const { handleRecord, clearBlobUrl } = useVoiceRecorder({
    fileName: 'session-task',
    setRecordingFile,
  });
  const { updateStudySessionData, updateStudySessionTask, updateStudySession } =
    useUpdateStudySessionData();

  useEffect(() => {
    if (
      currentStatus === Enum_StudySessionTaskStatus.NOT_STARTED &&
      currentTask?.status === Enum_StudySessionTaskStatus.STARTED
    ) {
      // transition from not started to started
      clearBlobUrl(); // clear the blob if it existis
      handleRecord(); // begin audio recording
    } else if (
      currentStatus === Enum_StudySessionTaskStatus.STARTED &&
      (currentTask?.status === Enum_StudySessionTaskStatus.COMPLETED ||
        currentTask?.status === Enum_StudySessionTaskStatus.FAILED)
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
        `${userSession?.user.id}/studies/${session.study.id}/sessions/${
          session.id
        }/audio/${currentTask?.id ?? ''}`
      );

      await updateStudySessionTask({
        id: currentTask?.id ?? '',
        data: {
          userRecording: {
            set: uploadedFiles.recording as string,
          },
        },
      });

      if (session.data.currentTask === session.taskList.length) {
        await updateStudySession({
          id: session.id,
          data: {
            status: {
              set: Enum_StudySessionStatus.COMPLETED,
            },
          },
        });
      } else {
        await updateStudySessionData({
          id: session.data.id,
          data: {
            currentTask: {
              set: session.data.currentTask + 1,
            },
          },
        });
      }
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
            You are about to start the task # {session.data.currentTask}
          </span>
          <span>Task description:</span>
          <div className='max-h-36 overflow-y-auto bg-gray-50 p-4'>
            <p>{currentTask.task.description}</p>
          </div>
          <span>Hear your expert explaining you the task:</span>
          <audio src={taskAudio ?? ''} controls />
        </div>
      </Modal>
    );
  }

  if (currentTask?.status === 'STARTED') {
    return <StudySessionTaskControls taskAudio={taskAudio} />;
  }

  return null;
};

const StudySessionTaskControls = ({ taskAudio }: { taskAudio: string }) => {
  const { currentTask } = useStudySession();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { updateStudySessionTask } = useUpdateStudySessionData();

  const updateStudySessionStatus = async (
    status: Enum_StudySessionTaskStatus
  ) => {
    await updateStudySessionTask({
      id: currentTask?.id ?? '',
      data: {
        status: {
          set: status,
        },
      },
    });
    toast.success('Task status updated successfully');
  };

  return (
    <Draggable>
      <div className='flex flex-col items-start justify-center rounded-xl border-2 border-indigo-500 bg-white p-2 shadow-xl'>
        <div className='flex items-center'>
          <div className='nowrap m-2 flex cursor-move flex-nowrap font-bold'>
            Task controls
          </div>
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
            <audio src={taskAudio} controls />
            <Tooltip title='Mark task as finished'>
              <button
                onClick={() => updateStudySessionStatus('COMPLETED')}
                type='button'
                className='cursor-pointer text-2xl text-green-500 hover:text-green-700'
              >
                <MdOutlineCheckCircle />
              </button>
            </Tooltip>
            <Tooltip title='Mark task as failed'>
              <button
                onClick={() => updateStudySessionStatus('FAILED')}
                type='button'
                className='cursor-pointer text-2xl text-red-500 hover:text-red-700'
              >
                <MdCancel />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export { StartedState };
