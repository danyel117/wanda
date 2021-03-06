import React, { useEffect, useState } from 'react';
import matchRoles from '@utils/matchRoles';
import { GetServerSideProps, NextPage } from 'next';
import Modal from '@components/modals/Modal';
import dynamic from 'next/dynamic';
import { EditorValue } from 'react-rte';
import { BsQuestionCircle } from 'react-icons/bs';
import { Tooltip } from '@mui/material';
import { uploadFormFiles } from 'utils/uploadS3';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_SCRIPT } from 'graphql/mutations/script';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { GET_SCRIPTS } from 'graphql/queries/script';
import Loading from '@components/Loading';
import { Script } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ScriptCard } from '@components/Scritps/ScriptCard';
import PageHeader from '@components/PageHeader';

const RichText = dynamic(() => import('@components/RichText/RichTextEditor'), {
  ssr: false,
});

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

const Scripts: NextPage = () => {
  const [openNew, setOpenNew] = useState<boolean>(false);
  const { data, loading } = useQuery(GET_SCRIPTS, {
    fetchPolicy: 'cache-and-network',
  });
  if (loading) return <Loading />;
  return (
    <>
      <div className='flex h-full w-full flex-col p-10'>
        <PageHeader title='Script management'>
          <button
            className='primary flex'
            type='button'
            onClick={() => setOpenNew(true)}
          >
            Create new
          </button>
        </PageHeader>

        <div className='grid w-full grid-cols-3 justify-items-center gap-6 p-6'>
          {data.getScripts?.map((script: Script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      </div>
      <Modal open={openNew} setOpen={setOpenNew} title='New Script'>
        <NewScript setOpen={setOpenNew} />
      </Modal>
    </>
  );
};

interface FormError {
  disabled: boolean;
  errors: string[];
}

interface NewScriptProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewScript = ({ setOpen }: NewScriptProps) => {
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<EditorValue>();
  const [recording, setRecording] = useState<File>();
  const [formState, setFormState] = useState<FormError>({
    disabled: false,
    errors: [],
  });

  const { data: session } = useSession();

  const [mutateScript] = useMutation(CREATE_SCRIPT, {
    refetchQueries: [GET_SCRIPTS],
  });

  useEffect(() => {
    const errors = [];
    let disabled = false;

    if (!name && name !== '') {
      errors.push('Name is required');
      disabled = true;
    }

    if (!recording) {
      errors.push('Recording is required');
      disabled = true;
    }

    if (!content) {
      errors.push('Content is required');
      disabled = true;
    }

    setFormState({
      errors,
      disabled,
    });
  }, [name, content, recording]);

  const createScript = async () => {
    if (recording && name && content) {
      const fd = {
        name,
        content: content?.toString('markdown') ?? '',
        recording,
      };
      const id = nanoid();
      const uploadedFormData = await uploadFormFiles(
        fd,
        `${session?.user.id}/scripts/${id}`
      );
      try {
        await mutateScript({
          variables: {
            data: {
              name: uploadedFormData.name,
              script: uploadedFormData.content,
              recording: uploadedFormData.recording,
              userId: session?.user.id,
            },
          },
        });
        toast.success('Script created successfully');
        setOpen(false);
      } catch (e) {
        toast.error('There was an error creating the script.');
      }
    }
  };

  return (
    <div className='w-92 flex flex-col gap-3'>
      <label htmlFor='name'>
        <LabelWithHelp
          label='Script name'
          help='Give a name to your script. Since you can have more than one, the name will help you to identify them later.'
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name='name'
          type='text'
          placeholder='My super script'
        />
      </label>
      <div>
        <LabelWithHelp
          label='Script content'
          help='Write the content of your script and introduce your users to Think Aloud evaluations.'
        />
        <RichText onChange={setContent} />
      </div>
      <div>
        <LabelWithHelp
          label='Script recording'
          help='Record the content of your script so that users can reproduce it.'
        />
        <VoiceRecorder
          fileName='script-recording'
          setRecordingFile={setRecording}
        />
      </div>
      <div className='flex w-full justify-center'>
        <button
          disabled={formState.disabled}
          className='primary'
          type='button'
          onClick={() => createScript()}
        >
          Create script
        </button>
      </div>
    </div>
  );
};

interface LabelWithHelpProps {
  label: string;
  help: string;
}

const LabelWithHelp = ({ label, help }: LabelWithHelpProps) => (
  <div className='flex items-center gap-2'>
    <span>{label}</span>
    <Tooltip title={help}>
      <div>
        <BsQuestionCircle />
      </div>
    </Tooltip>
  </div>
);

export default Scripts;
