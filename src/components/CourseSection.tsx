import React from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const CodeContainer = styled.div<{ $isFirst: boolean; $isLast: boolean }>`
  background-color: ${({ $isFirst, $isLast }) =>
    $isFirst ? 'var(--first-bg)' : $isLast ? 'var(--last-bg)' : '#2d2d2d'};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const CodeHeader = styled.div`
  background-color: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  font-weight: bold;
`;

const TryButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

interface CourseSectionProps {
  title: string;
  subtitle: string;
  language: string;
  code: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const CourseSection: React.FC<CourseSectionProps> = ({
  title,
  subtitle,
  language,
  code,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <section className="course-section">
      <div className="course-content">
        <div className="course-info">
          <h1 className="course-title">{title}</h1>
          <p className="course-subtitle">{subtitle}</p>
          <div className="button-group">
            <Link to={`/learn-${language}`} className="cta-button primary">
              Learn {title}
            </Link>
            <Link to={`/${language}-reference`} className="cta-button secondary">
              {title} Reference
            </Link>
          </div>
        </div>
        <div className="code-example-card">
          <CodeContainer $isFirst={isFirst} $isLast={isLast}>
            <CodeHeader>{language.toUpperCase()} Example:</CodeHeader>
            <SyntaxHighlighter language={language} style={dark}>
              {code}
            </SyntaxHighlighter>
            <TryButton>Try it Yourself</TryButton>
          </CodeContainer>
        </div>
      </div>
    </section>
  );
};

export default CourseSection; 