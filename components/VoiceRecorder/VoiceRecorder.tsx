/* eslint-disable no-console */
import { useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { BsRecordCircle, BsFillTrashFill } from 'react-icons/bs';
import { Tooltip } from '@mui/material';

interface VoiceRecorderProps {
  setRecordingFile: (file: File) => void;
  fileName: string;
}

const VoiceRecorder = ({ setRecordingFile, fileName }: VoiceRecorderProps) => {
  const {
    status,
    startRecording,
    stopRecording,
    clearBlobUrl,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: 'audio/wav' },
  });

  useEffect(() => {
    const getAudioFile = async (blob: string) => {
      const audioBlob = await fetch(blob).then(r => r.blob());
      const audioFile = new File([audioBlob], `${fileName}.wav`, {
        type: 'audio/wav',
      });
      setRecordingFile(audioFile);
    };
    if (mediaBlobUrl) {
      getAudioFile(mediaBlobUrl);
    }
  }, [mediaBlobUrl, setRecordingFile]);

  const handleRecord = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      clearBlobUrl();
      startRecording();
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return 'Ready to record...';
      case 'recording':
        return 'Recording...';
      case 'stopped':
        return 'Review:';
      default:
        return status;
    }
  };

  return (
    <div className='text-3xl flex flex-col justify-center items-start'>
      <p>{getStatusText()}</p>
      <div className='flex h-14'>
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
        {status === 'stopped' && mediaBlobUrl && (
          <audio controls src={mediaBlobUrl} />
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
