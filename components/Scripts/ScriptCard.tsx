import { Menu, MenuItem, Tooltip } from '@mui/material';
import { Script } from '@prisma/client';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Modal from '@components/modals/Modal';
import DeleteScript from '@components/Scripts/DeleteScript';

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  {
    ssr: false,
  }
);

const MutateScript = dynamic(() => import('@components/Scripts/MutateScript'), {
  ssr: false,
});

interface ScriptCardProps {
  script: Script | null;
}

const ScriptCard = ({ script }: ScriptCardProps) => {
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [options, setOptions] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <div className='card w-80'>
      <div className='w-full border-b border-indigo-500 p-2'>
        <div className='flex w-full items-center justify-center'>
          <span className='w-full text-center'>{script?.name ?? ''}</span>
          <div className='flex w-10 justify-end hover:text-indigo-500'>
            <Tooltip title='Manage script' placement='right'>
              <div className='block'>
                <button
                  onClick={(e) => {
                    setOptions(!options);
                    setAnchorEl(e.currentTarget);
                  }}
                  type='button'
                >
                  {options ? <BsThreeDotsVertical /> : <BsThreeDots />}
                </button>
                <Menu
                  open={options}
                  anchorEl={anchorEl}
                  onClose={() => setOptions(false)}
                >
                  <MenuItem onClick={() => setOpenNew(true)}>
                    Update script
                  </MenuItem>
                  <MenuItem onClick={() => setOpenDelete(true)}>
                    Delete script
                  </MenuItem>
                </Menu>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className='h-80 overflow-y-auto p-2'>
        <MarkdownRenderer md={script?.script ?? ''} />
      </div>
      {script?.recording && <audio src={script.recording} controls />}
      <Modal open={openNew} setOpen={setOpenNew} title='Update Script'>
        <MutateScript
          id={script?.id}
          defaultName={script?.name ?? ''}
          defaultContent={script?.script ?? ''}
          defaultRecording={script?.recording ?? ''}
          setOpen={setOpenNew}
        />
      </Modal>
      <Modal open={openDelete} setOpen={setOpenDelete} title='Delete Script'>
        <DeleteScript id={script?.id ?? ''} closeModal={setOpenDelete} />
      </Modal>
    </div>
  );
};

export { ScriptCard };
