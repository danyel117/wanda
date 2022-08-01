import { useMutation } from '@apollo/client';
import { MiniLoading } from '@components/Loading';
import { DELETE_SCRIPT } from 'graphql/mutations/script';
import { GET_SCRIPTS } from 'graphql/queries/script';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

interface DeleteScriptInterface {
  id: string;
  closeModal: Dispatch<SetStateAction<boolean>>;
}

const DeleteScript = ({ id, closeModal }: DeleteScriptInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [mutateDelete] = useMutation(DELETE_SCRIPT, {
    refetchQueries: [GET_SCRIPTS],
  });
  const deleteScript = async () => {
    setLoading(true);
    try {
      await mutateDelete({
        variables: {
          where: {
            id,
          },
        },
      });
      toast.success('Script deleted successfully');
    } catch {
      toast.error('Error deleting script');
    }
    setLoading(false);
  };
  return (
    <div className='flex flex-col gap-3'>
      <h2>Are you sure you want to delete the script?</h2>
      <span className='text-yellow-500'>This action cannot be undone.</span>
      <div className='flex w-full justify-center gap-2'>
        <button
          onClick={() => deleteScript()}
          type='button'
          className='danger'
          disabled={loading}
        >
          {!loading ? <span>Delete script</span> : <MiniLoading />}
        </button>
        <button
          onClick={() => {
            closeModal(false);
          }}
          type='button'
          className='secondary'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteScript;
