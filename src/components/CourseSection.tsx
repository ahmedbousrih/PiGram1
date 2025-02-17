import React from 'react';
import { Link } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CourseSectionProps {
  title: string;
  subtitle: string;
  language: string;
  code: string;
}

const CourseSection: React.FC<CourseSectionProps> = ({
  title,
  subtitle,
  language,
  code,
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
          <div className="card-header">
            <span>{title} Example:</span>
          </div>
          <div className="code-content">
            <SyntaxHighlighter language={language} style={docco}>
              {code}
            </SyntaxHighlighter>
          </div>
          <button className="try-button">Try it Yourself</button>
        </div>
      </div>
    </section>
  );
};

export default CourseSection; 