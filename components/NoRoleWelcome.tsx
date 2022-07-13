import { useMutation } from '@apollo/client';
import Modal from '@components/modals/Modal';
import { Enum_RoleName } from '@prisma/client';
import { UPDATE_USER_NAME_ROLE } from 'graphql/mutations/updateUserNameRole';
import useFormData from 'hooks/useFormData';
import { useRouter } from 'next/router';
import { SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';

const NoRoleWelcome = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { form, formData, updateFormData } = useFormData(null);
  const [updateUser] = useMutation(UPDATE_USER_NAME_ROLE);
  const router = useRouter();
  const submitForm = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      await updateUser({
        variables: {
          name: formData.name,
          role: formData.role,
        },
      });
      toast.success('Data saved correctly');
      router.reload();
    } catch {
      toast.error('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open setOpen={() => {}}>
      <div className='flex flex-col items-center gap-4'>
        <h1>Welcome to Wanda!</h1>
        <form
          ref={form}
          onChange={updateFormData}
          onSubmit={submitForm}
          className='flex flex-col gap-3'
        >
          <label htmlFor='name'>
            <span>Please confirm your name:</span>
            <input placeholder='Marie Curie' name='name' required />
          </label>
          <label htmlFor='role'>
            <span>Please confirm your role:</span>
            <select name='role' defaultValue='' required>
              <option disabled value=''>
                Select a role
              </option>
              <option value={Enum_RoleName.EXPERT}>Usability Expert</option>
              <option value={Enum_RoleName.PARTICIPANT}>
                Study Participant
              </option>
            </select>
          </label>
          <button type='submit' className='primary'>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export { NoRoleWelcome };
