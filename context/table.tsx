import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface TableContextInterface {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  controlledPageSize: number;
  setControlledPageSize: Dispatch<SetStateAction<number>>;
}

const useContextValue = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [controlledPageSize, setControlledPageSize] = useState<number>(0);
  return {
    currentPage,
    setCurrentPage,
    controlledPageSize,
    setControlledPageSize,
  };
};
export const TableContext = createContext(
  {} as ReturnType<typeof useContextValue>
);

export function useTableContext() {
  return useContext<TableContextInterface>(TableContext);
}

interface TableContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

const TableContextProvider = ({ children }: TableContextProviderProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [controlledPageSize, setControlledPageSize] = useState<number>(10);
  const tableContext = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      controlledPageSize,
      setControlledPageSize,
    }),
    [currentPage, controlledPageSize]
  );
  return (
    <TableContext.Provider value={tableContext}>
      {children}
    </TableContext.Provider>
  );
};

export { TableContextProvider };
