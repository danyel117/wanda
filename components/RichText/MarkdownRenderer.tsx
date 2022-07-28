import React from 'react';
import RichTextEditor from 'react-rte';

interface MarkdownRendererProps {
  md: string;
}

const MarkdownRenderer = ({ md }: MarkdownRendererProps) => (
  <RichTextEditor
    value={RichTextEditor.createEmptyValue()}
    onChange={() => {}}
    readOnly
  />
);

export default MarkdownRenderer;
