import React, { useState } from 'react';
import styled from 'styled-components';
import { useCourseProgress } from '../context/CourseProgressContext';

interface QuizProps {
  id: string;
  sectionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizContainer = styled.div`
  background: #2b3245;
  border-radius: 8px;
  padding: 24px;
  margin: 20px 0;
  color: white;
`;

const QuizTitle = styled.h3`
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const AnswerOption = styled.div<{ $selected?: boolean; $correct?: boolean; $incorrect?: boolean }>`
  background: ${props => 
    props.$correct ? '#059669' :
    props.$incorrect ? '#dc2626' :
    props.$selected ? '#6c63ff' :
    'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 12px 16px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => 
      props.$correct || props.$incorrect ? undefined :
      'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const SubmitButton = styled.button`
  background: #00c853;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  margin-top: 16px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #00b848;
  }
`;

const Quiz: React.FC<QuizProps> = ({ 
  id, 
  sectionId, 
  question, 
  options, 
  correctAnswer, 
  explanation, 
  difficulty 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { updateQuizProgress } = useCourseProgress();

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      updateQuizProgress(sectionId, id, isCorrect);
      setShowResult(true);
    }
  };

  return (
    <QuizContainer>
      <QuizTitle>
        Exercise
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '0.8em',
          color: difficulty === 'easy' ? '#00c853' : 
                 difficulty === 'medium' ? '#ff9800' : '#f44336'
        }}>
          {difficulty.toUpperCase()}
        </span>
      </QuizTitle>
      <p>{question}</p>
      <div>
        {options.map((option, index) => (
          <AnswerOption
            key={index}
            $selected={selectedAnswer === option}
            $correct={showResult && option === correctAnswer}
            $incorrect={showResult && selectedAnswer === option && option !== correctAnswer}
            onClick={() => !showResult && setSelectedAnswer(option)}
          >
            {option}
          </AnswerOption>
        ))}
      </div>
      {!showResult ? (
        <SubmitButton onClick={handleSubmit}>Submit Answer</SubmitButton>
      ) : (
        <>
          <div style={{ margin: '16px 0', color: selectedAnswer === correctAnswer ? '#00c853' : '#f44336' }}>
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <p>{explanation}</p>
          <SubmitButton onClick={() => setShowResult(false)}>Try Again</SubmitButton>
        </>
      )}
    </QuizContainer>
  );
};

export default Quiz; 