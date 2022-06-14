import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Dispatch, SetStateAction, ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

type ComponentProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  title?: string | '';
};

const Modal = ({ open, setOpen, children, title = '' }: ComponentProps) => {
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
          <div className='flex justify-between items-center'>
            <div className='text-xl lg:text-2xl font-medium'>
              {title}
              <div className='flex'>
                <div className=' h-1 w-2/6  bg-indigo-500 rounded-md ' />
                <div className=' h-1 w-1 bg-indigo-500 rounded-md mx-1' />
              </div>
            </div>

            <IconButton
              aria-label='close'
              onClick={handleClose}
              sx={{ outline: 'none' }}
            >
              <MdClose />
            </IconButton>
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
