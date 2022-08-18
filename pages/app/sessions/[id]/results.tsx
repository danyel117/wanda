import Loading from '@components/Loading';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
  Enum_StudySessionTaskStatus,
  Enum_StudySessionType,
} from '@prisma/client';
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
import SUS from 'react-system-usability-scale';
import 'react-system-usability-scale/dist/styles/styles.css';
import PageHeader from '@components/PageHeader';
import { useEffect } from 'react';
import { QuestionAskingProtocol } from '@components/QuestionAskingProtocol';

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
  const { session, loading, setResult } = useStudySession();

  useEffect(() => {
    setResult(true);
  }, [setResult]);

  if (loading) return <Loading />;

  return (
    <div className='flex flex-col justify-center gap-4 p-3 lg:p-10'>
      <div className='w-full text-center'>
        <PageHeader title='Study session summary' />
      </div>
      <div className='flex w-full flex-col justify-between gap-2 lg:flex-row'>
        <span>Participant: {session.participant.email}</span>
        <span>Date: {new Date(session.updatedAt).toLocaleDateString()}</span>
        <div className='flex justify-start'>
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
      </div>
      <div>
        {session.sessionType ===
          Enum_StudySessionType.QuestionAskingProtocol && (
          <Accordion>
            <AccordionSummary expandIcon={<MdExpandMore />}>
              Question-Asking Protocol
            </AccordionSummary>
            <AccordionDetails className='bg-gray-100'>
              <QuestionAskingProtocol />
            </AccordionDetails>
          </Accordion>
        )}
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            Tasks
          </AccordionSummary>
          <AccordionDetails className='bg-gray-100'>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
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
            <div className='flex flex-col gap-3'>
              <div className='flex w-full overflow-x-auto md:justify-center'>
                <SUS result={session?.sus ?? 0} />
              </div>
              <QuestionResponses responses={session.questionResponses} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

const TaskCard = ({ task }: { task: ExtendedStudySessionTask }) => (
  <div className='card'>
    <div className='flex w-full flex-col'>
      <h2>Task {task.task.order}</h2>
      <span>{task.task.description}</span>
      <div className='my-2 h-48 overflow-y-auto'>
        <span>{task.userRecordingTranscription}</span>
      </div>
      <div className='w-full'>
        <audio className='w-56' src={task.userRecording ?? ''} controls />
      </div>
      <span>
        Status: <Status status={task.status} />
      </span>
    </div>
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
          <h3>System Usability Scale answers</h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
            {sus.map((response: ExtendedQuestionResponse) => (
              <ResponseCard response={response} />
            ))}
          </div>
        </div>
      )}
      <div className='flex flex-col gap-3'>
        <h3>Additional Questions</h3>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          {notSus.map((response: ExtendedQuestionResponse) => (
            <ResponseCard response={response} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ResponseCard = ({ response }: { response: ExtendedQuestionResponse }) => {
  const colors = {
    1: '#ff0000',
    2: '#ffa500',
    3: '#eedd00',
    4: '#00f000',
    5: '#00ff99',
  };
  const SUSMapper: { [key: number]: { text: string; color: string } } = {
    1: {
      text: 'Strongly Disagree',
      color: colors[response.question.position % 2 === 1 ? 1 : 5],
    },
    2: {
      text: 'Disagree',
      color: colors[response.question.position % 2 === 1 ? 2 : 4],
    },
    3: {
      text: 'Neutral',
      color: colors[3],
    },
    4: {
      text: 'Agree',
      color: colors[response.question.position % 2 === 1 ? 4 : 2],
    },
    5: {
      text: 'Strongly Agree',
      color: colors[response.question.position % 2 === 1 ? 5 : 1],
    },
  };

  return (
    <div className='card'>
      {response.question.sus ? (
        <>
          <span className='h-full'>
            {response.question.position} - {response.question.question}
          </span>
          <div
            className='font-bold'
            style={{ color: SUSMapper[response.responseNumber ?? 1].color }}
          >
            {SUSMapper[response.responseNumber ?? 1].text}
          </div>
        </>
      ) : (
        <>
          <span className='h-36'>
            {response.question.position} - {response.question.question}
          </span>
          <div className='h-full overflow-y-auto'>{response.responseText}</div>
        </>
      )}
    </div>
  );
};

export default SessionResults;
