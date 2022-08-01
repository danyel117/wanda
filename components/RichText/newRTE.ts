import RichTextEditor from 'react-rte';

const newRTE = (value: string) =>
  RichTextEditor.createValueFromString(value, 'markdown');

export { newRTE };
