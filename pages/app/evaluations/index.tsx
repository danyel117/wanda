import { useQuery } from '@apollo/client';
import Modal from '@components/modals/Modal';
import PageHeader from '@components/PageHeader';
import Table from '@components/Table/Table';
import { Study } from '@prisma/client';
import { TableContextProvider } from 'context/table';
import { GET_STUDIES } from 'graphql/queries/study';
import useFormData from 'hooks/useFormData';
import { SyntheticEvent, useMemo, useState } from 'react';

const EvaluationIndex = () => {
  const [openNew, setOpenNew] = useState<boolean>(true);

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
        Header: 'User',
        accessor: 'user',
      },
      {
        Header: 'Actions',
        accessor: 'editBtn',
      },
    ],
    []
  );

  const data = useMemo(
    () => [{ status: 'test', study: 'test', user: 'test', editBtn: 'test' }],
    []
  );

  return (
    <TableContextProvider>
      <div className='w-full flex flex-col p-10 gap-4'>
        <PageHeader title='Evaluation management'>
          <button
            onClick={() => setOpenNew(true)}
            className='primary'
            type='button'
          >
            Create new
          </button>
        </PageHeader>

        <Table columns={columns} data={data} />
      </div>
      <Modal open={openNew} setOpen={setOpenNew} title='New evaluation'>
        <NewEvaluation />
      </Modal>
    </TableContextProvider>
  );
};

const NewEvaluation = () => {
  const { data: studies } = useQuery(GET_STUDIES);
  const { form, formData, updateFormData } = useFormData(null);

  const submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
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
