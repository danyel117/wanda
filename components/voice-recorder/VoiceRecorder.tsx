/* eslint-disable no-console */
import { useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

const VoiceRecorder = () => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ screen: true });

  useEffect(() => {
    console.log(mediaBlobUrl);
    // const file = new File([mediaBlobUrl], 'filename');
    // console.log(file);
  }, [mediaBlobUrl]);

  return (
    <div>
      <p>{status}</p>
      <button type='button' onClick={startRecording}>
        Start Recording
      </button>
      <button type='button' onClick={stopRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default VoiceRecorder;
