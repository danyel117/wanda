/* eslint-disable no-console */
import { useState } from 'react';
// @ts-ignore: Unreachable code error
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';

const VoiceRecorder = () => {
  const [state, setState] = useState({
    audioDetails: {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    },
  });

  const handleAudioStop = (data: any) => {
    console.log(data);
    setState({ audioDetails: data });
  };

  const handleAudioUpload = (file: any) => {
    console.log(file);
  };

  const handleRest = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    setState({ audioDetails: reset });
  };

  const handleOnChange = (data: any) => {
    // console.log('change: ', data);
    setState({ audioDetails: data });
  };

  return (
    <div className='recorder'>
      <Recorder
        record
        title='New recording'
        audioURL={state.audioDetails.url}
        showUIAudio
        disableFullUi
        handleAudioStop={(data: any) => handleAudioStop(data)}
        handleOnChange={(value: any) => handleOnChange(value)}
        handleAudioUpload={(data: any) => handleAudioUpload(data)}
        handleReset={() => handleRest()}
      />
    </div>
  );
};

export default VoiceRecorder;
