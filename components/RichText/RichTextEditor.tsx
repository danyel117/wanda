import { useEffect, useState } from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';

interface RichTextProps {
  defaultValue?: EditorValue;
  onChange: (state: EditorValue) => void;
}

const RichText = ({ onChange, defaultValue }: RichTextProps) => {
  const [state, setState] = useState<EditorValue>(
    defaultValue ?? RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <RichTextEditor
      value={state}
      onChange={(value: EditorValue) => {
        setState(value);
      }}
    />
  );
};

export default RichText;
