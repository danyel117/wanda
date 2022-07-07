import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { Dispatch, SetStateAction, ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

type ComponentProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  title?: string | '';
  preventClose?: boolean;
};

const Modal = ({
  open,
  setOpen,
  children,
  title = '',
  preventClose = false,
}: ComponentProps) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
      className='block overflow-y-visible'
      PaperProps={{ sx: { overflowY: 'visible' } }}
    >
      {title && (
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Image src='/img/logo-no-text.png' height={30} width={30} />
            <div className='text-xl font-medium lg:text-2xl'>
              {title}
              <div className='flex'>
                <div className=' h-1 w-2/6  rounded-md bg-indigo-500 ' />
                <div className=' mx-1 h-1 w-1 rounded-md bg-indigo-500' />
              </div>
            </div>
            {!preventClose && (
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={{ outline: 'none' }}
              >
                <MdClose />
              </IconButton>
            )}
          </div>
        </DialogTitle>
      )}
      <DialogContent
        dividers
        sx={{
          width: '100%',
          placeSelf: 'center',
        }}
        className='overflow-y-visible'
      >
        {children}
      </DialogContent>
    </MuiDialog>
  );
};

export default Modal;
