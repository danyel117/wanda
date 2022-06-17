import { useRef, useState } from 'react';
import { ParsedFormData } from 'types';

const useFormData = (initial: HTMLFormElement | null) => {
  const form = useRef(initial);
  const [formData, setFormData] = useState<ParsedFormData>({});
  const getFormData = () => {
    if (form) {
      const fd = new FormData(<HTMLFormElement>form.current);
      const obj: ParsedFormData = {};
      fd.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }
    return {};
  };
  const updateFormData = () => {
    setFormData(getFormData());
  };
  return { form, formData, updateFormData } as const;
};

export default useFormData;
