import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface TutorialContextInterface {
  showTutorial: boolean;
  setShowTutorial: Dispatch<SetStateAction<boolean>>;
}

const useValue = () => {
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  return {
    showTutorial,
    setShowTutorial,
  };
};

export const TutorialContext = createContext<TutorialContextInterface>(
  {} as ReturnType<typeof useValue>
);

export function useTutorial() {
  return useContext<TutorialContextInterface>(TutorialContext);
}
interface TutorialContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

const TutorialContextProvider = ({
  children,
}: TutorialContextProviderProps) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    try {
      const localStorageShowTutorial = JSON.parse(
        localStorage.getItem('showTutorial') as string
      );
      if (localStorageShowTutorial) {
        return localStorageShowTutorial.tutorial;
      }
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'showTutorial',
        JSON.stringify({ tutorial: showTutorial })
      );
    } catch {
      // ignore
    }
  }, [showTutorial]);

  const tutorialContext = useMemo(
    () => ({
      showTutorial,
      setShowTutorial,
    }),
    [showTutorial, setShowTutorial]
  );
  return (
    <TutorialContext.Provider value={tutorialContext}>
      {children}
    </TutorialContext.Provider>
  );
};

export { TutorialContextProvider };
