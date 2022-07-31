import { MiniLoading } from '@components/Loading';
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';
import { useStudySession } from 'context/studySession';
import { useState } from 'react';

const StartTaskButton = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentTask } = useStudySession();
  const { updateStudySessionTask } = useUpdateStudySessionData();
  const startTask = async () => {
    setLoading(true);
    await updateStudySessionTask({
      id: currentTask?.id ?? '',
      data: {
        status: {
          set: 'STARTED',
        },
        startTime: {
          set: new Date(),
        },
      },
    });
    setLoading(false);
  };
  return (
    <button type='button' onClick={startTask} className='primary'>
      {!loading ? <span>Start Task</span> : <MiniLoading />}
    </button>
  );
};

export { StartTaskButton };
