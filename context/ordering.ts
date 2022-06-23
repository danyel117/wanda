import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export interface Ordering {
  field: string;
  asc: boolean;
  connect?: string;
}

interface OrderingContextInterface {
  ordering: Ordering;
  setOrdering: Dispatch<SetStateAction<Ordering>>;
}

const useContextValue = () => {
  const [ordering, setOrdering] = useState<Ordering>({
    asc: false,
    field: '',
  });
  return {
    ordering,
    setOrdering,
  };
};

export const OrderingContext = createContext<OrderingContextInterface>(
  {} as ReturnType<typeof useContextValue>
);

export function useOrdering() {
  return useContext<OrderingContextInterface>(OrderingContext);
}
