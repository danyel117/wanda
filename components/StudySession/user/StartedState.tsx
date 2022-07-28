import {
  MdCancel,
  MdOutlineCheckCircle,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import Draggable, { DraggableEventHandler } from 'react-draggable';
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
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { StartTaskButton } from '@components/StudySession/common/StartTaskButton';
import Image from 'next/image';

const StartedState = () => {
  const { stopPoll, resumePoll } = useStudySession();
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
    if (currentTask?.status === Enum_StudySessionTaskStatus.STARTED) {
      clearBlobUrl(); // clear the blob if it exists
      handleRecord(); // begin audio recording
    }
  }, []);

  useEffect(() => {
    if (currentTask) {
      if (
        currentStatus === Enum_StudySessionTaskStatus.NOT_STARTED &&
        currentTask?.status === Enum_StudySessionTaskStatus.STARTED
      ) {
        // transition from not started to started
        clearBlobUrl(); // clear the blob if it exists
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
    }
  }, [clearBlobUrl, currentStatus, currentTask, handleRecord]);

  useEffect(() => {
    const finishTask = async () => {
      stopPoll();
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
              set: Enum_StudySessionStatus.QUESTIONNAIRE,
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
      resumePoll();
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
          <div className='flex w-full justify-center'>
            <StartTaskButton />
          </div>
        </div>
      </Modal>
    );
  }

  if (currentTask?.status === 'STARTED') {
    return <StudySessionTaskControls taskAudio={taskAudio} />;
  }

  return (
    <Modal open setOpen={() => {}}>
      <span>Loading the next task...</span>
    </Modal>
  );
};

const StudySessionTaskControls = ({ taskAudio }: { taskAudio: string }) => {
  const [position, setPosition] = useState({
    x: 0,
    y: window.innerHeight - 180,
  });
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
        endTime: {
          set: new Date(),
        },
      },
    });
    toast.success('Task status updated successfully');
  };

  const stopDragging: DraggableEventHandler = (e, data) => {
    let newX = data.x;
    let newY = data.y;
    if (data.x < 0) {
      newX = 0;
    }

    if (data.y < 0) {
      newY = 0;
    }

    setPosition({ x: newX, y: newY });
  };

  return (
    <Draggable position={position} onStop={stopDragging}>
      <div
        className={`flex flex-col items-start justify-center rounded-xl border-4 border-yellow-500 p-2   ${
          showOptions
            ? 'bg-gray-50 text-gray-900'
            : 'bg-gray-500 p-2 text-white opacity-95'
        } cursor-move shadow-xl`}
      >
        <div className='flex items-center'>
          <div className='flex items-center'>
            {showOptions ? (
              <Image src='/img/logo-no-text.png' width={30} height={30} />
            ) : (
              <Image src='/img/logo-no-text-white.png' width={30} height={30} />
            )}
            <div className='nowrap m-2 flex cursor-move flex-nowrap text-2xl font-bold '>
              Task controls
            </div>
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
          <div className='flex flex-col items-start gap-3'>
            <span className=''>
              Task {currentTask?.task.order}: {currentTask?.task.description}
            </span>
            <div className='flex gap-3'>
              <audio src={taskAudio} controls />
              <Tooltip title='Mark task as finished'>
                <button
                  onClick={() => updateStudySessionStatus('COMPLETED')}
                  type='button'
                  className='cursor-pointer text-4xl text-green-500 hover:text-green-700'
                >
                  <MdOutlineCheckCircle />
                </button>
              </Tooltip>
              <Tooltip title='Mark task as failed'>
                <button
                  onClick={() => updateStudySessionStatus('FAILED')}
                  type='button'
                  className='cursor-pointer text-4xl text-red-500 hover:text-red-700'
                >
                  <MdCancel />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export { StartedState };
