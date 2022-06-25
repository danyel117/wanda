import { useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

export interface VoiceRecorderProps {
  setRecordingFile: (file: File) => void;
  fileName: string;
}

const useVoiceRecorder = ({
  fileName,
  setRecordingFile,
}: VoiceRecorderProps) => {
  const { status, startRecording, stopRecording, clearBlobUrl, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      blobPropertyBag: { type: 'audio/wav' },
    });

  useEffect(() => {
    const getAudioFile = async (blob: string) => {
      const audioBlob = await fetch(blob).then((r) => r.blob());
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

  return {
    status,
    handleRecord,
    mediaBlobUrl,
    clearBlobUrl,
  };
};

export { useVoiceRecorder };
