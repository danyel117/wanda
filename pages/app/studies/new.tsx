import { useQuery } from '@apollo/client';
import DataRepeater from '@components/DataRepeater';
import Modal from '@components/modals/Modal';
import { ScriptCard } from '@components/Scritps/ScriptCard';
import { Tooltip } from '@mui/material';
import { Script } from '@prisma/client';
import { GET_SCRIPTS } from 'graphql/queries/script';
import useFormData from 'hooks/useFormData';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import matchRoles from 'utils/matchRoles';

const VoiceRecorder = dynamic(
  () => import('@components/VoiceRecorder/VoiceRecorder'),
  {
    ssr: false,
  }
);

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { rejected, isPublic, page } = await matchRoles(ctx);
  return {
    props: {
      rejected,
      isPublic,
      page,
    },
  };
};
const NewStudy: NextPage = () => {
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [script, setScript] = useState<Script>();
  const { data: scripts } = useQuery(GET_SCRIPTS, {
    fetchPolicy: 'cache-and-network',
  });
  const { form, formData, updateFormData } = useFormData(null);
  const submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    setScript(scripts.getScripts.find((f: Script) => f.id === formData.script));
  }, [formData, scripts]);

  return (
    <div className='p-10 flex flex-col items-center justify-start gap-4'>
      <h1>New Study</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col gap-3 items-center'
      >
        <div className='grid grid-cols-2  gap-4'>
          <label htmlFor='name'>
            <span>Study name</span>
            <input name='name' type='text' placeholder='MyWebsite' required />
          </label>
          <label htmlFor='researchQuestion'>
            <span>Research question</span>
            <input
              name='researchQuestion'
              type='text'
              placeholder='What do I want to find?'
              required
            />
          </label>
          <label htmlFor='researchQuestion'>
            <span>Website</span>
            <input
              name='webiste'
              type='text'
              placeholder='https://www.ux-wanda.com'
              required
            />
          </label>

          <label htmlFor='script'>
            <span>Script</span>
            <div className='flex gap-2 w-full'>
              <select name='script' className='w-full' defaultValue=''>
                <option disabled value=''>
                  Select a script
                </option>
                {scripts.getScripts.map((s: Script) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Tooltip title={`${script ?? 'View script'}`}>
                <button
                  disabled={!script}
                  onClick={() => setShowScriptModal(true)}
                  type='button'
                  className='text-gray-400 hover:text-indigo-500 disabled:cursor-not-allowed'
                >
                  <MdVisibility />
                </button>
              </Tooltip>
            </div>
          </label>
        </div>

        <div className='block'>
          <DR />
        </div>

        <button type='submit' className='primary'>
          Confirm
        </button>
      </form>
      <Modal open={showScriptModal} setOpen={setShowScriptModal}>
        <ScriptCard script={script ?? null} />
      </Modal>
    </div>
  );
};

interface ContainerProps {
  children: JSX.Element[] | JSX.Element;
}
const Container = ({ children }: ContainerProps) => (
  <div className='grid grid-cols-2'>
    <div />
    {children}
  </div>
);

const TaskDefinition = props => {
  console.log(props);
  const [recording, setRecording] = useState<File>();
  return (
    <div className='bg-gray-50 p-3 rounded-lg shadow-md'>
      <h2 className='w-full text-center'>Task #{props.counter + 1}</h2>
      <label htmlFor='name'>
        <span>Task description</span>
        <textarea name='name' placeholder='Task' required />
      </label>
      <label htmlFor='url'>
        <span>Task url</span>
        <input name='url' placeholder='https://www.ux-wanda.com' required />
      </label>
      <VoiceRecorder
        fileName='script-recording'
        setRecordingFile={setRecording}
      />
    </div>
  );
};
const Title = () => {
  return <div>Tasks</div>;
};

const DR = () =>
  DataRepeater({
    RepeatedComponent: TaskDefinition,
    Container,
    Title,
    inputName: 'Task',
    reversed: true,
  });

export default NewStudy;
