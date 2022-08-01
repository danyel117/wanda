import { nanoid } from 'nanoid';
import { EditorValue } from 'react-rte';
import { uploadFormFiles } from 'utils/uploadS3';
import { useMutation } from '@apollo/client';
import { CREATE_SCRIPT, UPDATE_SCRIPT } from 'graphql/mutations/script';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { GET_SCRIPTS } from 'graphql/queries/script';
import ScriptForm from '@components/Scripts/ScriptForm';
import { newRTE } from '@components/RichText/newRTE';

interface FormError {
  disabled: boolean;
  errors: string[];
}

interface MutateScriptProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  defaultName?: string;
  defaultContent?: string;
  defaultRecording?: string;
}

const MutateScript = ({
  setOpen,
  id,
  defaultName,
  defaultContent,
  defaultRecording,
}: MutateScriptProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<EditorValue>();
  const [recording, setRecording] = useState<File>();
  const [formState, setFormState] = useState<FormError>({
    disabled: false,
    errors: [],
  });

  useEffect(() => {
    if (defaultName) {
      setName(defaultName);
    }
  }, [defaultName]);

  useEffect(() => {
    if (defaultContent) {
      setContent(newRTE(defaultContent));
    }
  }, [defaultContent]);

  const { data: session } = useSession();

  const [createScript] = useMutation(CREATE_SCRIPT, {
    refetchQueries: [GET_SCRIPTS],
  });

  const [updateScript] = useMutation(UPDATE_SCRIPT, {
    refetchQueries: [GET_SCRIPTS],
  });

  useEffect(() => {
    const errors = [];
    let disabled = false;

    if (!name && name !== '') {
      errors.push('Name is required');
      disabled = true;
    }

    if (!content) {
      errors.push('Content is required');
      disabled = true;
    }

    if (!recording && !defaultRecording) {
      errors.push('Recording is required');
      disabled = true;
    }

    setFormState({
      errors,
      disabled,
    });
  }, [name, content, recording]);

  const upload = async (idUpload: string) => {
    const fd = {
      name,
      content: content?.toString('markdown') ?? '',
      recording: recording as File,
    };
    const uploadedFormData = await uploadFormFiles(
      fd,
      `${session?.user.id}/scripts/${idUpload}`
    );

    return uploadedFormData;
  };

  const newScript = async () => {
    if (recording && name && content) {
      setLoading(true);
      const newId = nanoid();
      const uploadedFormData = await upload(newId);
      try {
        await createScript({
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
      setLoading(false);
    }
  };

  const editScript = async () => {
    setLoading(true);
    try {
      const uploadedFormData = await upload(id ?? '');
      await updateScript({
        variables: {
          where: {
            id,
          },
          data: {
            name: {
              set: uploadedFormData.name,
            },
            script: {
              set: uploadedFormData.content,
            },
            recording: {
              set: uploadedFormData?.recording ?? defaultRecording,
            },
          },
        },
      });
      toast.success('Script updated successfully');
    } catch {
      toast.error('There was an error updating the script.');
    }
    setLoading(false);
  };

  return (
    <ScriptForm
      loading={loading}
      name={name}
      setName={setName}
      defaultContent={content}
      setContent={setContent}
      setRecording={setRecording}
      disabled={formState.disabled}
      onSubmit={id ? editScript : newScript}
      update={!!id}
      defaultRecording={defaultRecording}
      recording={recording}
    />
  );
};

export default MutateScript;
