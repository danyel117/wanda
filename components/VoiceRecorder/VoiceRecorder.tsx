import { BsRecordCircle, BsFillTrashFill } from 'react-icons/bs';
import { Tooltip } from '@mui/material';
import { useVoiceRecorder, VoiceRecorderProps } from 'hooks/useVoiceRecorder';

const VoiceRecorder = ({ setRecordingFile, fileName }: VoiceRecorderProps) => {
  const { status, handleRecord, mediaBlobUrl, clearBlobUrl } = useVoiceRecorder(
    { setRecordingFile, fileName }
  );

  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return 'Ready to record...';
      case 'recording':
        return 'In process...';
      case 'stopped':
        return 'Review';
      default:
        return status;
    }
  };

  return (
    <div className='text-md flex w-64 flex-col items-start justify-center lg:text-xl'>
      <p>Recording: {getStatusText()}</p>
      <div className='flex w-full flex-col'>
        <div>
          <button className='mx-2' type='button' onClick={handleRecord}>
            <Tooltip
              title={`${
                status === 'recording' ? 'Stop recording' : 'Begin recording'
              }`}
            >
              <div
                className={`${
                  status === 'recording'
                    ? 'text-red-500'
                    : 'text-green-500 hover:text-green-700'
                }`}
              >
                <BsRecordCircle />
              </div>
            </Tooltip>
          </button>
          {/* {status === 'recording' && (
          <button className='mx-2' type='button' onClick={stopRecording}>
            <Tooltip title='Pause recording'>
              <div className='text-yellow-500'>
                <BsFillPauseBtnFill />
              </div>
            </Tooltip>
          </button>
        )} */}
          {mediaBlobUrl && (
            <button className='mx-2' type='button' onClick={clearBlobUrl}>
              <Tooltip title='Clear recording'>
                <div className='text-yellow-500'>
                  <BsFillTrashFill />
                </div>
              </Tooltip>
            </button>
          )}
        </div>
        {status === 'stopped' && mediaBlobUrl && (
          <div className='flex'>
            <audio controls src={mediaBlobUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
