import React from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';

const EditorWrapper = styled.div`
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  background: #1e1e1e;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTitle = styled.div`
  color: #fff;
  font-size: 14px;
`;

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onChange,
  readOnly = false
}) => {
  return (
    <EditorWrapper>
      <EditorHeader>
        <EditorTitle>{language.toUpperCase()}</EditorTitle>
      </EditorHeader>
      <Editor
        height="360px"
        defaultLanguage={language}
        defaultValue={initialCode}
        theme="vs-dark"
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </EditorWrapper>
  );
};

export default CodeEditor; 