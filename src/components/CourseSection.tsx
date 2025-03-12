import React from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: center;
`;

const ContentLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 72px;
  color: #1f2937;
  margin: 0 0 20px 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #6B7280;
  margin: 0 0 30px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled(Link)<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => props.$primary ? `
    background-color: #04AA6D;
    color: white;
    &:hover {
      background-color: #059862;
    }
  ` : `
    background-color: #282A35;
    color: white;
    &:hover {
      background-color: #000;
    }
  `}
`;

const CodeContainer = styled.div`
  background-color: #282A35;
  border-radius: 8px;
  overflow: hidden;
  width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CodeHeader = styled.div`
  background-color: #282A35;
  color: white;
  padding: 16px;
  font-weight: 500;
`;

const TryButton = styled.button`
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  border: none;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #059862;
  }
`;

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
  margin: 0 !important;
  padding: 24px !important;
  background-color: #282A35 !important;
  
  & code {
    font-family: 'Source Code Pro', monospace !important;
    font-size: 15px !important;
  }
`;

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
    <Section>
      <Container>
        <ContentLeft>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          <ButtonGroup>
            <Button to={`/learn-${language.toLowerCase()}`} $primary>
              Learn {title}
            </Button>
            <Button to={`/${language.toLowerCase()}-reference`}>
              {title} Reference
            </Button>
          </ButtonGroup>
        </ContentLeft>
        <CodeContainer>
          <CodeHeader>{language.toUpperCase()} Example:</CodeHeader>
          <StyledSyntaxHighlighter
            language={language.toLowerCase()}
            style={dark}
            customStyle={{
              backgroundColor: '#282A35',
            }}
          >
            {code}
          </StyledSyntaxHighlighter>
          <TryButton>Try it Yourself</TryButton>
        </CodeContainer>
      </Container>
    </Section>
  );
};

export default CourseSection; 