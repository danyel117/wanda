import Loading from '@components/Loading';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Enum_StudySessionTaskStatus } from '@prisma/client';
import matchRoles from '@utils/matchRoles';
import {
  StudySessionContextProvider,
  useStudySession,
} from 'context/studySession';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ExtendedQuestionResponse, ExtendedStudySessionTask } from 'types';
import { MdExpandMore } from 'react-icons/md';
import _ from 'lodash';

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

const SessionResults: NextPage = () => {
  const router = useRouter();
  const id: string = router.query.id as string;

  // const {session} = us
  return (
    <StudySessionContextProvider id={id}>
      <SessionResultComponent />
    </StudySessionContextProvider>
  );
};

const SessionResultComponent = () => {
  const { session, loading } = useStudySession();

  if (loading) return <Loading />;

  return (
    <div className='flex flex-col justify-center gap-4 p-10'>
      <div className='w-full text-center'>
        <h1>Study session summary</h1>
      </div>
      <div className='flex w-full justify-between'>
        <span>Participant: {session.participant.email}</span>
        <span>Date: {new Date(session.updatedAt).toLocaleDateString()}</span>
        <button type='button' className='primary'>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(session)
            )}`}
            download={`session_export_${session.id}.json`}
          >
            Download data
          </a>
        </button>
      </div>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            Tasks
          </AccordionSummary>
          <AccordionDetails className='bg-gray-100'>
            <div className='grid grid-cols-3 gap-5'>
              {session.taskList.map((task: ExtendedStudySessionTask) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            Questionnaire
          </AccordionSummary>
          <AccordionDetails className='bg-gray-100'>
            <QuestionResponses responses={session.questionResponses} />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

const TaskCard = ({ task }: { task: ExtendedStudySessionTask }) => (
  <div className='card'>
    <h2>Task {task.task.order}</h2>
    <span>{task.task.description}</span>
    <div className='my-2 h-48 overflow-y-auto'>
      <span>{task.userRecordingTranscription}</span>
    </div>
    <audio src={task.userRecording ?? ''} controls />
    <span>
      Status: <Status status={task.status} />
    </span>
  </div>
);

const Status = ({ status }: { status: Enum_StudySessionTaskStatus }) => {
  const statuses = {
    [Enum_StudySessionTaskStatus.COMPLETED]: {
      color: 'green',
      text: 'Completed',
    },
    [Enum_StudySessionTaskStatus.NOT_STARTED]: {
      color: 'yellow',
      text: 'Not started',
    },
    [Enum_StudySessionTaskStatus.STARTED]: {
      color: 'blue',
      text: 'Started',
    },
    [Enum_StudySessionTaskStatus.FAILED]: {
      color: 'red',
      text: 'Failed',
    },
  };
  return (
    <span className={`text-${statuses[status].color}-500 font-bold`}>
      {statuses[status].text}
    </span>
  );
};

const QuestionResponses = ({
  responses,
}: {
  responses: ExtendedQuestionResponse[];
}) => {
  const grouped = _.groupBy(
    _.orderBy(responses, 'question.position'),
    'question.sus'
  );
  const sus = grouped.true ?? [];
  const notSus = grouped.false ?? [];

  return (
    <div className='flex flex-col gap-4'>
      {sus.length > 0 && (
        <div className='flex flex-col gap-3'>
          <h3>System Usability Scale</h3>
          <div className='grid grid-cols-5 gap-3'>
            {sus.map((response: ExtendedQuestionResponse) => (
              <ResponseCard response={response} />
            ))}
          </div>
        </div>
      )}
      <div className='flex flex-col gap-3'>
        <h3>Additional Questions</h3>
        <div className='grid grid-cols-3 gap-3'>
          {notSus.map((response: ExtendedQuestionResponse) => (
            <ResponseCard response={response} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ResponseCard = ({ response }: { response: ExtendedQuestionResponse }) => {
  const SUSMapper: { [key: number]: string } = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree',
  };

  return (
    <div className='card'>
      <span className='h-full'>
        {response.question.position} - {response.question.question}
      </span>
      {response.question.sus ? (
        <div className=''>{SUSMapper[response.responseNumber ?? 1]}</div>
      ) : (
        <div className='h-24 overflow-y-auto'>{response.responseText}</div>
      )}
    </div>
  );
};

export default SessionResults;
