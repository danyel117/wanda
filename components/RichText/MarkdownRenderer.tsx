import React from 'react';
import RichTextEditor from 'react-rte';

interface MarkdownRendererProps {
  md: string;
}

const MarkdownRenderer = ({ md }: MarkdownRendererProps) => (
  <RichTextEditor
    value={RichTextEditor.createValueFromString(md, 'markdown')}
    readOnly
  />
);

export default MarkdownRenderer;
