import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface SidebarContextInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const useValue = () => {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    setOpen,
  };
};

export const SidebarContext = createContext<SidebarContextInterface>(
  {} as ReturnType<typeof useValue>
);

export function useSidebar() {
  return useContext<SidebarContextInterface>(SidebarContext);
}
