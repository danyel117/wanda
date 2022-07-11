import { useMutation, useQuery } from '@apollo/client';
import Modal from '@components/modals/Modal';
import PageHeader from '@components/PageHeader';
import PrivateComponent from '@components/PrivateComponent';
import Table, { TableData } from '@components/Table/Table';
import Tooltip from '@mui/material/Tooltip';
import { Enum_RoleName, EvaluationStudy } from '@prisma/client';
import { TableContextProvider } from 'context/table';
import { CREATE_STUDY_SESSION } from 'graphql/mutations/studySession';
import { GET_USER_STUDY_SESSIONS } from 'graphql/queries/studySession';
import { GET_STUDIES } from 'graphql/queries/evaluationStudy';
import useFormData from 'hooks/useFormData';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { MdBarChart, MdLaunch } from 'react-icons/md';
import { toast } from 'react-toastify';
import { ExtendedStudySession } from 'types';

const StudySessionIndex = () => {
  const { data: session } = useSession();
  const [openNew, setOpenNew] = useState<boolean>(false);
  const { data: studySessions } = useQuery(GET_USER_STUDY_SESSIONS, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Evaluation study',
        accessor: 'EvaluationStudy',
      },
      {
        Header: 'Participant',
        accessor: 'participant',
      },
      {
        Header: 'Actions',
        accessor: 'editBtn',
      },
    ],
    []
  );

  useEffect(() => {
    if (studySessions) {
      setTableData(
        studySessions.getUserStudySessions.map((uev: ExtendedStudySession) => ({
          status: uev.status,
          EvaluationStudy: uev.study.name,
          participant: uev.participant.email,
          editBtn: <StudySessionActions session={uev} />,
        }))
      );
    }
  }, [studySessions]);

  const getPageTitle = () => {
    if (
      session?.user.roles?.some(
        (r) => r.name === Enum_RoleName.ADMIN || r.name === Enum_RoleName.EXPERT
      )
    ) {
      return 'Study session management';
    }

    return 'My study sessions';
  };

  return (
    <TableContextProvider>
      <div className='flex w-full flex-col gap-4 p-10 '>
        <PageHeader title={getPageTitle()}>
          <PrivateComponent
            roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
          >
            <button
              onClick={() => setOpenNew(true)}
              className='primary'
              type='button'
            >
              Create new
            </button>
          </PrivateComponent>
        </PageHeader>
        <div className='card'>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
      <Modal open={openNew} setOpen={setOpenNew} title='New study session'>
        <NewStudySession setOpenNew={setOpenNew} />
      </Modal>
    </TableContextProvider>
  );
};

interface StudySessionActionsProps {
  session: ExtendedStudySession;
}

const StudySessionActions = ({ session }: StudySessionActionsProps) => (
  <div className='flex w-full justify-center gap-2'>
    <Tooltip
      title={
        session.status === 'COMPLETED'
          ? 'This session has already been completed.'
          : ''
      }
    >
      <div>
        <Link href={`/app/sessions/${session.id}`}>
          <button
            disabled={session.status === 'COMPLETED'}
            type='button'
            className='primary flex items-center gap-3'
          >
            <span>Launch session</span>
            <MdLaunch />
          </button>
        </Link>
      </div>
    </Tooltip>
    <PrivateComponent roleList={['ADMIN', 'EXPERT']}>
      <Tooltip
        title={`${
          session.status !== 'COMPLETED'
            ? 'This session has not been completed.'
            : ''
        }`}
      >
        <div>
          <Link href={`/app/sessions/${session.id}/results`}>
            <button
              disabled={session.status !== 'COMPLETED'}
              type='button'
              className='primary flex items-center gap-2'
            >
              <span>View results</span>
              <MdBarChart />
            </button>
          </Link>
        </div>
      </Tooltip>
    </PrivateComponent>
  </div>
);

interface NewStudySessionProps {
  setOpenNew: (open: boolean) => void;
}

const NewStudySession = ({ setOpenNew }: NewStudySessionProps) => {
  const { data: studies } = useQuery(GET_STUDIES);
  const [createStudySession] = useMutation(CREATE_STUDY_SESSION, {
    refetchQueries: [GET_USER_STUDY_SESSIONS],
  });
  const { form, formData, updateFormData } = useFormData(null);

  const submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await createStudySession({
        variables: {
          data: {
            evaluationStudy: {
              connect: {
                id: formData.evaluationStudy,
              },
            },
            participantEmail: formData.participantEmail,
          },
        },
      });
      toast.success('Study session session created successfully');
      setOpenNew(false);
    } catch (err) {
      toast.error('Error creating the study session');
    }
  };
  return (
    <div>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col gap-3'
      >
        <label htmlFor='evaluationStudy'>
          <span>Evaluation study</span>
          <select name='evaluationStudy' defaultValue='' required>
            <option value='' disabled>
              Select a evaluation study
            </option>
            {studies.getUserStudies.map((study: EvaluationStudy) => (
              <option key={study.id} value={study.id}>
                {study.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor='participantEmail'>
          <span>Participant email</span>
          <input type='email' name='participantEmail' required />
        </label>
        <div className='flex justify-center'>
          <button type='submit' className='primary'>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudySessionIndex;
