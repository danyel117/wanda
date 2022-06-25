import { useMutation, useQuery } from '@apollo/client';
import DataRepeater, { RepeatedComponentProps } from '@components/DataRepeater';
import Modal from '@components/modals/Modal';
import { ScriptCard } from '@components/Scritps/ScriptCard';
import { Tooltip } from '@mui/material';
import { Script } from '@prisma/client';
import { GET_SCRIPTS } from 'graphql/queries/script';
import useFormData from 'hooks/useFormData';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import matchRoles from '@utils/matchRoles';
import { NewTaskContext, TaskInput, useNewTaskContext } from 'context/newTasks';
import cuid from 'cuid';
import { uploadFormFiles } from '@utils/uploadS3';
import { useSession } from 'next-auth/react';
import { CREATE_STUDY } from 'graphql/mutations/study';
import { toast } from 'react-toastify';

const VoiceRecorder = dynamic(
  () => import('@components/VoiceRecorder/VoiceRecorder'),
  {
    ssr: false,
  }
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  const [createStudy] = useMutation(CREATE_STUDY);
  const { data: session } = useSession();
  const [files, setFiles] = useState<{ [key: string]: TaskInput }>({});
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [script, setScript] = useState<Script>();
  const { data: scripts } = useQuery(GET_SCRIPTS, {
    fetchPolicy: 'cache-and-network',
  });
  const { form, formData, updateFormData } = useFormData(null);

  useEffect(() => {
    setScript(scripts.getScripts.find((f: Script) => f.id === formData.script));
  }, [formData, scripts]);

  const newTaskContext = useMemo(() => ({ files, setFiles }), [files]);

  const submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    const studyId = cuid();
    const filesUploaded = await Promise.all(
      Object.keys(files).map((f) => {
        const id = cuid();
        const uploadedFormData = uploadFormFiles(
          {
            id,
            file: files[f].file as File,
            name: files[f].name,
            url: files[f].url,
            description: files[f].description,
          },
          `${session?.user.id}/studies/${studyId}/tasks/${id}`
        );

        return uploadedFormData;
      })
    );

    try {
      await createStudy({
        variables: {
          data: {
            study: {
              id: studyId,
              name: formData.name,
              site: formData.webiste,
              researchQuestion: formData.researchQuestion,
              script: {
                connect: {
                  id: formData.script,
                },
              },
            },
            tasks: filesUploaded.map((fu) => ({
              id: fu.id,
              description: fu.description,
              recording: fu.file,
              url: fu.url,
            })),
          },
        },
      });
      toast.success('Study created successfully');
    } catch (err) {
      toast.error(`Error creating the study: ${err}`);
    }
  };

  return (
    <NewTaskContext.Provider value={newTaskContext}>
      <div className='flex flex-col items-center justify-start gap-4 p-10'>
        <h1>New Study</h1>
        <form
          ref={form}
          onChange={updateFormData}
          onSubmit={submitForm}
          className='flex flex-col items-center gap-3'
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
              <div className='flex w-full gap-2'>
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
    </NewTaskContext.Provider>
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

const TaskDefinition = ({ counter, name }: RepeatedComponentProps) => {
  const [taskData, setTaskData] = useState<TaskInput>({
    name: name ?? '',
    description: '',
    url: '',
    file: null,
  });
  const { files, setFiles } = useNewTaskContext();
  const [recording, setRecording] = useState<File>();

  useEffect(() => {
    if (recording) {
      setTaskData({ ...taskData, file: recording });
    }
  }, [recording]);

  useEffect(() => {
    setFiles({ ...files, [taskData.name]: taskData });
  }, [taskData]);

  return (
    <div className='rounded-lg bg-gray-50 p-3 shadow-md'>
      <h2 className='w-full text-center'>Task #{(counter ?? 0) + 1}</h2>
      <label htmlFor={`~${name}-description`}>
        <span>Task description</span>
        <textarea
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          name={`~${name}-description`}
          placeholder='Task'
          required
        />
      </label>
      <label htmlFor={`'~${name}-url`}>
        <span>Task url</span>
        <input
          value={taskData.url}
          onChange={(e) => setTaskData({ ...taskData, url: e.target.value })}
          name={`'~${name}-url`}
          placeholder='https://www.ux-wanda.com'
          required
        />
      </label>

      <VoiceRecorder
        fileName='script-recording'
        setRecordingFile={setRecording}
      />
    </div>
  );
};
const Title = () => <div>Tasks</div>;

const DR = () =>
  DataRepeater({
    RepeatedComponent: TaskDefinition,
    Container,
    Title,
    inputName: 'Task',
    reversed: true,
  });

export default NewStudy;
