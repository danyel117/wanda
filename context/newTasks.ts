import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export interface TaskInput {
  name: string;
  description: string;
  url: string;
  file: File | null;
}

interface NewTaskContextInterface {
  files: { [key: string]: TaskInput };
  setFiles: Dispatch<SetStateAction<{ [key: string]: TaskInput }>>;
}

const useContextValue = () => {
  const [files, setFiles] = useState<{ [key: string]: TaskInput }>({});

  return {
    files,
    setFiles,
  };
};

export const NewTaskContext = createContext<NewTaskContextInterface>(
  {} as ReturnType<typeof useContextValue>
);

export function useNewTaskContext() {
  return useContext<NewTaskContextInterface>(NewTaskContext);
}
