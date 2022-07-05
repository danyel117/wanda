import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { useStudySession } from 'context/studySession';

const StartTaskButton = () => {
  const { currentTask } = useStudySession();
  const { updateStudySessionTask } = useUpdateStudySessionData();
  const startTask = async () => {
    await updateStudySessionTask({
      id: currentTask?.id ?? '',
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

export { StartTaskButton };
