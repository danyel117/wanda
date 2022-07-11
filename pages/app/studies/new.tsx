import { useMutation, useQuery } from '@apollo/client';
import DataRepeater, { RepeatedComponentProps } from '@components/DataRepeater';
import Modal from '@components/modals/Modal';
import { ScriptCard } from '@components/Scritps/ScriptCard';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch,
  Tooltip,
} from '@mui/material';
import { Script } from '@prisma/client';
import { GET_SCRIPTS } from 'graphql/queries/script';
import useFormData from 'hooks/useFormData';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { MdExpandMore, MdHelpOutline, MdVisibility } from 'react-icons/md';
import matchRoles from '@utils/matchRoles';
import { NewTaskContext, TaskInput, useNewTaskContext } from 'context/newTasks';
import cuid from 'cuid';
import { uploadFormFiles } from '@utils/uploadS3';
import { useSession } from 'next-auth/react';
import { CREATE_EVALUATION_STUDY } from 'graphql/mutations/evaluationStudy';
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
  const [createStudy] = useMutation(CREATE_EVALUATION_STUDY);
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
            evaluationStudy: {
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
      <div className='flex w-full flex-col items-center justify-start gap-4 p-10'>
        <h1>New Evaluation Study</h1>
        <form
          ref={form}
          onChange={updateFormData}
          onSubmit={submitForm}
          className='flex w-full flex-col items-center gap-3'
        >
          <div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-6 shadow-lg'>
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
          <div className='block w-full'>
            <Accordion>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <h3 className='font-bold'>Tasks</h3>
              </AccordionSummary>
              <AccordionDetails>
                <div className='block'>
                  <TaskDataRepeater />
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <h3 className='font-bold'>Questionnaire</h3>
              </AccordionSummary>
              <AccordionDetails>
                <div className='flex justify-center gap-3'>
                  <SUS />
                  <div className='block'>
                    <QuestionnaireDataRepeater />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <button type='submit' className='primary'>
            Create study
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
  children: JSX.Element[];
}
const TaskContainer = ({ children }: ContainerProps) => {
  const title = children[0];
  const content = children.slice(1);
  return (
    <div className='flex w-full flex-col'>
      <div className='self-center'>{title}</div>
      <div className='grid grid-cols-2'>{content}</div>
    </div>
  );
};
const QuestionContainer = ({ children }: ContainerProps) => {
  const title = children[0];
  const content = children.slice(1);
  return (
    <div className='flex w-full flex-col'>
      <div className='self-center'>{title}</div>
      <div className='grid min-w-[468px] grid-cols-2 rounded-lg bg-gray-200 p-3 shadow-lg'>
        {content}
      </div>
    </div>
  );
};

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

const QuestionDefinition = ({ counter, name }: RepeatedComponentProps) => (
  <label htmlFor={name}>
    <span>Question {(counter ?? 0) + 1}</span>
    <textarea name={name} placeholder='question' className='w-42 h-36' />
  </label>
);

const Title = () => <div />;

const TaskDataRepeater = () =>
  DataRepeater({
    RepeatedComponent: TaskDefinition,
    Container: TaskContainer,
    Title,
    inputName: 'Task',
    reversed: true,
    ArrayDefault: [{ name: 'Task 1' }],
    addElementInstruction: 'Add task',
  });

const QuestionnaireDataRepeater = () =>
  DataRepeater({
    RepeatedComponent: QuestionDefinition,
    Container: QuestionContainer,
    Title: () => <h3 className='mx-2'>Additional questions</h3>,
    inputName: 'Question',
    reversed: true,
    addElementInstruction: 'Add',
    ArrayDefault: [{ name: 'Question 1' }],
  });

const SUS = () => {
  const [showSus, setShowSus] = useState(false);
  const [susQuestions, setSusQuestions] = useState<{ [key: string]: string }>({
    sus1: 'I think that I would like to use this system frequently.',
    sus2: 'I found the system unnecessarily complex.',
    sus3: 'I thought the system was easy to use.',
    sus4: 'I think that I would need the support of a technical person to be able to use this system.',
    sus5: 'I found the various functions in this system were well integrated.',
    sus6: 'I thought there was too much inconsistency in this system.',
    sus7: 'I would imagine that most people would learn to use this system very quickly.',
    sus8: 'I found the system very cumbersome to use.',
    sus9: 'I felt very confident using the system.',
    sus10:
      'I needed to learn a lot of things before I could get going with this system.',
  });
  return (
    <div className='min-w-[600px]'>
      <div className='my-4 flex h-[40px] items-center justify-center'>
        <h3>System Usability Scale</h3>
        <Switch
          checked={showSus}
          onChange={(e) => setShowSus(e.target.checked)}
        />
        <Tooltip title='Use the System Usability Scale at the end of the study session with the participant'>
          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='external'
              href='https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html'
            >
              <MdHelpOutline className='text-2xl' />
            </a>
          </div>
        </Tooltip>
      </div>
      {showSus && (
        <div className='grid grid-cols-3 rounded-lg bg-gray-200 p-3 shadow-lg'>
          {Object.keys(susQuestions).map((q, index) => (
            <label htmlFor={q} className='m-2'>
              <span>SUS Question {index + 1}</span>
              <textarea
                className='w-42 h-36'
                name={q}
                value={susQuestions[q]}
                onChange={(e) =>
                  setSusQuestions({ ...susQuestions, [q]: e.target.value })
                }
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewStudy;
