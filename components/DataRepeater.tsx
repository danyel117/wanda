import { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { nanoid } from 'nanoid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';

interface ContainerProps {
  children: JSX.Element | JSX.Element[];
}

export interface RepeatedComponentProps {
  counter?: number;
  defaultInput?: any;
  name?: string;
}

interface DataRepeaterInterface {
  RepeatedComponent: ({
    counter,
    defaultInput,
    name,
  }: RepeatedComponentProps) => JSX.Element;
  Container: ({ children }: ContainerProps) => JSX.Element;
  Title: () => JSX.Element;
  inputName: string;
  updateFormData?: () => void;
  ArrayDefault?: Array<any>;
  updateArrayDefault?: any;
  maxRepetitions?: number;
  errorMessage?: string;
  reversed?: boolean;
  plusButtonColorClass?: string;
  plusButtonHoverColorClass?: string;
  minusButtonColorClass?: string;
  minusButtonHoverColorClass?: string;
}

/**
 *
 * @param RepeatedComponent Componente de React que se repetirá cada que se presione "+"
 * @param Container Componente de React que englobará el Data Repeater
 * @param Title Componente de React que sirve como Header o título del Data Repeater
 * @param inputName Nombre de cada uno de los inputs. Sirve para obtener los datos con el hook useFormData
 * @param updateFormData Función opcional que sirve para actualizar los datos del form cuando se presiona el botón "-"
 *
 * @description Componente Data Repeater para agregar dinámicamente inputs dentro de un Container.
 */
const DataRepeater = ({
  RepeatedComponent,
  Container,
  Title,
  inputName,
  updateFormData = () => {},
  ArrayDefault = [],
  maxRepetitions = -1,
  errorMessage = '',
  updateArrayDefault = () => {},
  reversed = false,
  plusButtonColorClass = 'text-green-500',
  plusButtonHoverColorClass = 'text-green-700',
  minusButtonColorClass = 'text-red-500',
  minusButtonHoverColorClass = 'text-red-700',
}: DataRepeaterInterface) => {
  const [optionList, setOptionList] = useState([] as any);
  const [sum, setSum] = useState(1);

  useEffect(() => {
    if (updateFormData) {
      updateFormData();
    }
  }, [optionList, updateFormData]);

  useEffect(() => {
    const initialOptions = [] as any;
    if (ArrayDefault.length > 0) {
      ArrayDefault.forEach((el, index) => {
        if (!reversed) {
          initialOptions.unshift(repeatedComponent(index, el));
        } else {
          initialOptions.push(repeatedComponent(index, el));
        }
      });
    }
    if (optionList.length !== 0) {
      optionList.forEach((el: any) => {
        if (!el.preload) {
          if (!reversed) {
            initialOptions.unshift(el);
          } else {
            initialOptions.push(el);
          }
        }
      });
    } else {
      setSum(ArrayDefault.length);
    }
    setOptionList(initialOptions);
  }, []);

  const repeatedComponent = (repetitionSum: any, preload: any) => ({
    preload,
    sum: repetitionSum,
    key: nanoid(10),
    name: `${inputName}${repetitionSum}`,
  });

  const removeOption = (option: any) => {
    setOptionList(optionList.filter((el: any) => el.key !== option.key));
    if (option.preload) {
      updateArrayDefault(option.preload);
    }
  };

  const increaseOption = () => {
    if (maxRepetitions > -1) {
      if (maxRepetitions >= optionList.length + 1) {
        if (!reversed) {
          setOptionList([repeatedComponent(sum, null), ...optionList]);
        } else {
          setOptionList([...optionList, repeatedComponent(sum, null)]);
        }
        setSum(sum + 1);
      } else {
        toast.error(errorMessage, { position: 'bottom-center' });
      }
    } else {
      if (!reversed) {
        setOptionList([repeatedComponent(sum, null), ...optionList]);
      } else {
        setOptionList([...optionList, repeatedComponent(sum, null)]);
      }
      setSum(sum + 1);
    }
    // updateArrayDefault({ newElementIndex: sum + 1 });
  };

  return (
    <Container>
      <div className='flex items-center my-4'>
        <Title />
        <Tooltip title={`Add ${inputName}`} arrow placement='right'>
          <button
            onClick={increaseOption}
            onKeyPress={increaseOption}
            type='button'
            className={`mx-1 cursor-pointer text-3xl  ${plusButtonColorClass} hover:${plusButtonHoverColorClass}`}
          >
            <MdAddCircleOutline />
          </button>
        </Tooltip>
      </div>
      <>
        {optionList.map((option: any, index: any) => (
          <RenderInputArray
            option={option}
            inputName={inputName}
            removeOption={removeOption}
            index={index}
            key={option.key}
            RepeatedComponent={RepeatedComponent}
            minusButtonColorClass={minusButtonColorClass}
            minusButtonHoverColorClass={minusButtonHoverColorClass}
          />
        ))}
      </>
      <ToastContainer />
    </Container>
  );
};

const RenderInputArray = ({
  option,
  inputName,
  removeOption,
  index,
  RepeatedComponent,
  minusButtonColorClass,
  minusButtonHoverColorClass,
}: any) => (
  <div className='my-2 flex items-center justify-center'>
    <RepeatedComponent
      name={`${inputName}${option.sum}`}
      defaultInput={option.preload}
      counter={index}
    />
    <Tooltip title={`Remove ${inputName}`} arrow placement='right'>
      <button
        type='button'
        onKeyPress={() => removeOption(option)}
        onClick={() => removeOption(option)}
        className={`mx-2 cursor-pointer text-3xl  ${minusButtonColorClass} hover:${minusButtonHoverColorClass}`}
      >
        <MdRemoveCircleOutline />
      </button>
    </Tooltip>
  </div>
);

export default DataRepeater;
