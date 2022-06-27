import { useMutation, useQuery } from '@apollo/client';
import Modal from '@components/modals/Modal';
import PageHeader from '@components/PageHeader';
import PrivateComponent from '@components/PrivateComponent';
import Table, { TableData } from '@components/Table/Table';
import Tooltip from '@mui/material/Tooltip';
import { Enum_RoleName, Study } from '@prisma/client';
import { TableContextProvider } from 'context/table';
import { CREATE_STUDY_SESSION } from 'graphql/mutations/studySession';
import { GET_USER_STUDY_SESSIONS } from 'graphql/queries/studySession';
import { GET_STUDIES } from 'graphql/queries/study';
import useFormData from 'hooks/useFormData';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { MdLaunch } from 'react-icons/md';
import { toast } from 'react-toastify';
import { ExtendedEvaluationSession } from 'types';

const EvaluationIndex = () => {
  const { data: session } = useSession();
  const [openNew, setOpenNew] = useState<boolean>(false);
  const { data: evaluations } = useQuery(GET_USER_STUDY_SESSIONS, {
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
        Header: 'Study',
        accessor: 'study',
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
    if (evaluations) {
      setTableData(
        evaluations.getUserEvaluations.map(
          (uev: ExtendedEvaluationSession) => ({
            status: uev.status,
            study: uev.study.name,
            participant: uev.participant.email,
            editBtn: <EvaluationActions id={uev.id} />,
          })
        )
      );
    }
  }, [evaluations]);

  const getPageTitle = () => {
    if (
      session?.user.roles?.some(
        (r) => r.name === Enum_RoleName.ADMIN || r.name === Enum_RoleName.EXPERT
      )
    ) {
      return 'Evaluation management';
    }

    return 'My evaluations';
  };

  return (
    <TableContextProvider>
      <div className='flex w-full flex-col gap-4 p-10'>
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

        <Table columns={columns} data={tableData} />
      </div>
      <Modal open={openNew} setOpen={setOpenNew} title='New evaluation'>
        <NewEvaluation setOpenNew={setOpenNew} />
      </Modal>
    </TableContextProvider>
  );
};

interface EvaluationActionsProps {
  id: string;
}

const EvaluationActions = ({ id }: EvaluationActionsProps) => (
  <div className='flex'>
    <Tooltip title='Launch session'>
      <div>
        <Link href={`/app/evaluations/${id}`}>
          <a className='text-lg hover:text-indigo-500'>
            <MdLaunch />
          </a>
        </Link>
      </div>
    </Tooltip>
  </div>
);

interface NewEvaluationProps {
  setOpenNew: (open: boolean) => void;
}

const NewEvaluation = ({ setOpenNew }: NewEvaluationProps) => {
  const { data: studies } = useQuery(GET_STUDIES);
  const [createEvaluation] = useMutation(CREATE_STUDY_SESSION, {
    refetchQueries: [GET_USER_STUDY_SESSIONS],
  });
  const { form, formData, updateFormData } = useFormData(null);

  const submitForm = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await createEvaluation({
        variables: {
          data: {
            study: {
              connect: {
                id: formData.study,
              },
            },
            participantEmail: formData.participantEmail,
          },
        },
      });
      toast.success('Evaluation session created successfully');
      setOpenNew(false);
    } catch (err) {
      toast.error('Error creating evaluation');
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
        <label htmlFor='study'>
          <span>Study</span>
          <select name='study' defaultValue='' required>
            <option value='' disabled>
              Select a study
            </option>
            {studies.getUserStudies.map((study: Study) => (
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

export default EvaluationIndex;
