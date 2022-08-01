import { MiniLoading } from '@components/Loading';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction } from 'react';
import { EditorValue } from 'react-rte';
import { BsQuestionCircle } from 'react-icons/bs';
import { Tooltip } from '@mui/material';

const RichText = dynamic(() => import('@components/RichText/RichTextEditor'), {
  ssr: false,
});

const VoiceRecorder = dynamic(
  () => import('@components/VoiceRecorder/VoiceRecorder'),
  {
    ssr: false,
  }
);

interface ScriptFormProps {
  loading: boolean;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  defaultContent?: EditorValue;
  setContent: Dispatch<SetStateAction<EditorValue | undefined>>;
  setRecording: Dispatch<SetStateAction<File | undefined>>;
  disabled: boolean;
  onSubmit: () => void;
  update?: boolean;
  recording?: File;
  defaultRecording?: string;
}

const ScriptForm = ({
  loading,
  name,
  setName,
  defaultContent,
  setContent,
  setRecording,
  disabled,
  onSubmit,
  update = false,
  recording,
  defaultRecording,
}: ScriptFormProps) => (
  <div className='w-92 flex flex-col gap-3'>
    <label htmlFor='name'>
      <LabelWithHelp
        label='Script name'
        help='Give a name to your script. Since you can have more than one, the name will help you to identify them later.'
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        name='name'
        type='text'
        placeholder='My super script'
      />
    </label>
    <div>
      <LabelWithHelp
        label='Script content'
        help='Write the content of your script and introduce your users to Think Aloud evaluations.'
      />
      <RichText defaultValue={defaultContent} onChange={setContent} />
    </div>
    <div>
      <LabelWithHelp
        label='Script recording'
        help='Record the content of your script so that users can reproduce it.'
      />
      <VoiceRecorder
        fileName='script-recording'
        setRecordingFile={setRecording}
      />
      {defaultRecording && !recording && (
        <audio src={defaultRecording ?? ''} controls />
      )}
    </div>
    <div className='flex w-full justify-center'>
      <button
        disabled={disabled || loading}
        className='primary'
        type='button'
        onClick={() => onSubmit()}
      >
        {!loading ? (
          <span>{update ? 'Update' : 'Create'} script</span>
        ) : (
          <MiniLoading />
        )}
      </button>
    </div>
  </div>
);

interface LabelWithHelpProps {
  label: string;
  help: string;
}

const LabelWithHelp = ({ label, help }: LabelWithHelpProps) => (
  <div className='flex items-center gap-2'>
    <span>{label}</span>
    <Tooltip title={help}>
      <div>
        <BsQuestionCircle />
      </div>
    </Tooltip>
  </div>
);

export default ScriptForm;
