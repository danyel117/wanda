import { useMutation, useQuery } from '@apollo/client';
import Loading, { MiniLoading } from '@components/Loading';
import { Tooltip } from '@mui/material';
import matchRoles from '@utils/matchRoles';
import { GET_STUDY } from 'graphql/queries/evaluationStudy';
import { GET_SCRIPTS } from 'graphql/queries/script';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next/types';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Question, Script, Task } from '@prisma/client';
import { MdVisibility } from 'react-icons/md';
import Modal from '@components/modals/Modal';
import { ScriptCard } from '@components/Scritps/ScriptCard';
import useFormData from 'hooks/useFormData';
import {
  DELETE_EVALUATION_STUDY,
  UPDATE_EVALUATION_STUDY,
} from 'graphql/mutations/evaluationStudy';
import { toast } from 'react-toastify';
import { ExtendedEvaluationStudy } from 'types';
import dynamic from 'next/dynamic';
import { UPDATE_TASK } from 'graphql/mutations/task';
import { uploadFormFiles } from '@utils/uploadS3';
import { useSession } from 'next-auth/react';
import _ from 'lodash';
import { UPDATE_QUESTION } from 'graphql/mutations/question';

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

const StudyDraftUpdate: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery(GET_STUDY, {
    variables: { evaluationStudyId: id as string },
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return <Loading />;

  return (
    <div>
      <UpdateEvaluationStudy evaluationStudy={data.evaluationStudy} />
      <UpdateTasks evaluationStudy={data.evaluationStudy} />
      {data?.evaluationStudy?.questions?.length > 0 && (
        <UpdateQuestions evaluationStudy={data.evaluationStudy} />
      )}
      <DeleteStudy evaluationStudy={data.evaluationStudy} />
    </div>
  );
};

const UpdateEvaluationStudy = ({
  evaluationStudy,
}: {
  evaluationStudy: ExtendedEvaluationStudy;
}) => {
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [script, setScript] = useState<Script>();
  const { data: scripts } = useQuery(GET_SCRIPTS, {
    fetchPolicy: 'cache-and-network',
  });
  const { form, formData, updateFormData } = useFormData(null);
  const [updateStudy, { loading }] = useMutation(UPDATE_EVALUATION_STUDY);

  useEffect(() => {
    if (scripts) {
      setScript(
        scripts.getScripts.find((f: Script) => f.id === formData.script)
      );
    }
  }, [formData, scripts]);

  const submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await updateStudy({
        variables: {
          where: {
            id: evaluationStudy.id,
          },
          data: {
            name: {
              set: formData.name,
            },
            participantTarget: {
              set: parseInt((formData?.participantTarget as string) ?? 0, 10),
            },
            researchQuestion: {
              set: formData.researchQuestion,
            },
            site: {
              set: formData.site,
            },
            scriptId: {
              set: formData.script,
            },
          },
        },
        refetchQueries: [GET_STUDY],
      });
      toast.success('Study updated successfully');
    } catch (err) {
      toast.error('Error updating study');
    }
  };

  // useEffect(() => {
  //   if (data) {
  //     updateFormData();
  //   }
  // }, [data, updateFormData]);

  return (
    <div className='flex w-full flex-col items-center justify-start gap-4 p-3 lg:p-10'>
      <h1>Update Evaluation Study</h1>
      <form
        onSubmit={submitForm}
        ref={form}
        onChange={updateFormData}
        className='flex w-full flex-col items-center gap-3'
      >
        <div className='flex w-full flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-lg md:grid md:grid-cols-2 lg:grid-cols-3'>
          <label htmlFor='name'>
            <span>Study name</span>
            <input
              name='name'
              type='text'
              placeholder='MyWebsite'
              required
              defaultValue={evaluationStudy.name}
            />
          </label>
          <label htmlFor='participantTarget'>
            <span>Target number of participants</span>
            <input
              name='participantTarget'
              type='number'
              min={0}
              required
              placeholder='10'
              defaultValue={evaluationStudy.participantTarget ?? 0}
            />
          </label>
          <label htmlFor='researchQuestion'>
            <span>Research question</span>
            <input
              name='researchQuestion'
              type='text'
              placeholder='What do I want to find?'
              required
              defaultValue={evaluationStudy.researchQuestion}
            />
          </label>
          <label htmlFor='site'>
            <span>Website</span>
            <input
              name='site'
              type='text'
              placeholder='https://www.ux-wanda.com'
              required
              defaultValue={evaluationStudy.site}
            />
          </label>

          <label htmlFor='script' className='col-span-2'>
            <span>Script</span>
            <div className='flex w-full gap-2'>
              <select
                name='script'
                className='w-full'
                defaultValue={evaluationStudy.script.id}
              >
                <option disabled value=''>
                  Select a script
                </option>
                {scripts.getScripts.map((s: Script) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Tooltip title={`${script?.name ?? 'View script'}`}>
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
        <button className='primary' type='submit'>
          {!loading ? <span>Save Evaluation data</span> : <MiniLoading />}
        </button>
      </form>
      <Modal open={showScriptModal} setOpen={setShowScriptModal}>
        <ScriptCard script={script ?? null} />
      </Modal>
    </div>
  );
};

const UpdateTasks = ({
  evaluationStudy,
}: {
  evaluationStudy: ExtendedEvaluationStudy;
}) => (
  <div className='flex w-full flex-col items-center justify-start gap-4 p-3 lg:p-10'>
    <h2>Update Tasks</h2>
    <div className='flex w-full flex-wrap justify-center gap-3'>
      {_.orderBy(evaluationStudy.tasks, 'order').map((t) => (
        <UpdateTask key={t.id} task={t} />
      ))}
    </div>
  </div>
);

const UpdateTask = ({ task }: { task: Task }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [recording, setRecording] = useState<File>();
  const [updateTask] = useMutation(UPDATE_TASK);
  const { form, formData, updateFormData } = useFormData(null);

  useEffect(() => {
    if (task) {
      updateFormData();
    }
  }, [task]);

  const submitForm = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    if (recording) {
      formData.recording = recording as File;
    } else {
      formData.recording = task.recording as string;
    }
    const uploadedFormData = await uploadFormFiles(
      formData,
      `${session?.user.id}/studies/${task.studyId}/tasks/${task.id}`
    );
    try {
      await updateTask({
        variables: {
          where: {
            id: task.id,
          },
          data: {
            description: {
              set: uploadedFormData.description,
            },
            url: {
              set: uploadedFormData.url,
            },
            recording: {
              set: uploadedFormData?.recording ?? task.recording,
            },
          },
        },
        refetchQueries: [GET_STUDY],
      });
      toast.success('Task updated successfully');
    } catch {
      toast.error('Error updating task');
    }
    setLoading(false);
  };

  return (
    <div className='card'>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex w-full flex-col items-center gap-3'
      >
        <label htmlFor='description'>
          <span>Task name</span>
          <input name='description' defaultValue={task.description} />
        </label>
        <label htmlFor='url'>
          <span>Task url</span>
          <input name='url' defaultValue={task.url} />
        </label>
        <VoiceRecorder fileName='recording' setRecordingFile={setRecording} />
        {!recording && <audio src={task?.recording ?? ''} controls />}
        <div className='flex justify-center'>
          <button type='submit' className='secondary'>
            {!loading ? <span>Update task</span> : <MiniLoading color='#000' />}
          </button>
        </div>
      </form>
    </div>
  );
};

const UpdateQuestions = ({
  evaluationStudy,
}: {
  evaluationStudy: ExtendedEvaluationStudy;
}) => (
  <div className='flex w-full flex-col items-center justify-start gap-4 p-3 lg:p-10'>
    <h2>Update Questions</h2>
    <div className='flex w-full flex-wrap justify-center gap-3'>
      {_.orderBy(evaluationStudy.questionnaire.questions, 'position').map(
        (q) => (
          <UpdateQuestion key={q.id} question={q} />
        )
      )}
    </div>
  </div>
);

const UpdateQuestion = ({ question }: { question: Question }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [questionDescription, setQuestionDescription] = useState<string>(
    question.question
  );

  const submitForm = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      await updateQuestion({
        variables: {
          where: {
            id: question.id,
          },
          data: {
            question: {
              set: questionDescription,
            },
          },
        },
        refetchQueries: [GET_STUDY],
      });
      toast.success('Question updated successfully');
    } catch {
      toast.error('Error updating Question');
    }
    setLoading(false);
  };

  return (
    <div className='card'>
      <form
        onSubmit={submitForm}
        className='flex w-full flex-col items-center gap-3'
      >
        <label htmlFor='description'>
          <span>Question</span>
          <textarea
            className='w-42 h-36'
            name='description'
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
          />
        </label>
        <div className='flex justify-center'>
          <button type='submit' className='secondary'>
            {!loading ? (
              <span>Update question</span>
            ) : (
              <MiniLoading color='#000' />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const DeleteStudy = ({
  evaluationStudy,
}: {
  evaluationStudy: ExtendedEvaluationStudy;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deleteStudy] = useMutation(DELETE_EVALUATION_STUDY);
  const submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await deleteStudy({
        variables: {
          id: evaluationStudy.id,
        },
      });
      toast.success('Study deleted successfully');
      router.push('/app/design');
    } catch {
      toast.error('Error deleting study');
    }
    setLoading(false);
  };
  return (
    <div className='flex w-full flex-col items-center gap-3 bg-red-50 p-5'>
      <h4>Danger zone</h4>
      <div className='flex w-full justify-center'>
        <button
          onClick={() => setOpenModal(true)}
          type='button'
          className='danger'
        >
          Delete Evaluation Study
        </button>
      </div>
      <Modal
        title='Delete study'
        open={openModal}
        setOpen={() => setOpenModal(false)}
      >
        <div className='flex flex-col gap-3'>
          <h2>Are you sure you want to delete this study?</h2>
          <span className='font-bold text-yellow-500'>
            This action cannot be undone
          </span>
          <span>
            All the tasks, questions, responses and recordings will be deleted
          </span>
          <div className='flex w-full justify-center'>
            <form onSubmit={submitForm} className='flex flex-col gap-2'>
              <label htmlFor='delete'>
                <span>
                  Type &quot;Delete me&quot; for confirming the deletion of the
                  study
                </span>
                <input
                  name='delete'
                  placeholder='...'
                  required
                  pattern='Delete me'
                />
              </label>
              <div className='flex w-full justify-center gap-2'>
                <button type='submit' className='danger'>
                  {!loading ? <span>Confirm</span> : <MiniLoading />}
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  type='button'
                  className='primary'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default StudyDraftUpdate;
