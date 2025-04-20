import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { FaSquareRootAlt, FaChevronRight, FaQuestion, FaLightbulb } from 'react-icons/fa';
import { useCourseProgress } from '../../context/CourseProgressContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MathExpression from '../../components/MathExpression';
import LoadingSpinner from '../../components/LoadingSpinner';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
`;

const SidebarWrapper = styled.div`
  position: relative;
  width: 300px;
  flex-shrink: 0;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  padding: 20px 0;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  
  @media (min-height: 800px) {
    max-height: calc(100vh - 80px - 100px);
  }

  .module-title {
    color: #6c63ff;
    padding: 12px 20px;
    font-weight: 600;
    background: #f0f4ff;
    cursor: pointer;
    
    &:hover {
      background: #e5e9ff;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  background: white;
  min-height: calc(100vh - 80px);
`;

const SidebarTitle = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
  
  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    margin: 0;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ $active?: boolean }>`
  padding: 12px 20px;
  padding-left: 40px;
  cursor: pointer;
  color: ${props => props.$active ? '#6c63ff' : '#4b5563'};
  background: ${props => props.$active ? '#f0f4ff' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? '#6c63ff' : 'transparent'};

  &:hover {
    background: #f0f4ff;
    color: #6c63ff;
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 16px;
  }
  
  p {
    color: #6b7280;
    font-size: 1.125rem;
    line-height: 1.75;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const Example = styled.div`
  background: #f8fafc;
  border-left: 4px solid #6c63ff;
  padding: 20px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
`;

const QuestionBox = styled.div`
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  
  h4 {
    color: #c2410c;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
  }
`;

const TipBox = styled.div`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  
  h4 {
    color: #047857;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
  }
`;

const ContentSection = ({ children }: { children: React.ReactNode }) => (
  <div className="content-section">
    {children}
  </div>
);

const ExampleBox = ({ children }: { children: React.ReactNode }) => (
  <Example>
    {children}
  </Example>
);

const PracticeQuestion = ({ children }: { children: React.ReactNode }) => (
  <QuestionBox>
    <h4><FaQuestion /> Practice Question</h4>
    {children}
  </QuestionBox>
);

const MathContainer = styled.div`
  font-size: 1.2rem;
  font-family: 'Times New Roman', serif;
  margin: 1rem 0;
`;

const Fraction = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 0.2rem;
  
  .numerator {
    border-bottom: 2px solid #000;
    padding: 0 0.2rem;
  }
  
  .denominator {
    padding: 0 0.2rem;
  }
`;

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
  
  .question-mark {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const AnswerOption = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 12px 16px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.selected {
    background: #6c63ff;
    border-color: #6c63ff;
  }

  &.correct {
    background: #059669;
    border-color: #059669;
  }

  &.incorrect {
    background: #dc2626;
    border-color: #dc2626;
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

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const NavButton = styled.button<{ $direction: 'prev' | 'next' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #5a51d6;
  }
  
  ${props => props.$direction === 'prev' && `
    margin-right: auto;
  `}
  
  ${props => props.$direction === 'next' && `
    margin-left: auto;
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const Progress = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: #6c63ff;
  transition: width 0.3s ease;
`;

const CourseProgressBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface QuizProps {
  id: string;
  sectionId: string;
  question: React.ReactNode;
  options: React.ReactNode[];
  correctAnswer: React.ReactNode;
  explanation: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Quiz: React.FC<QuizProps> = ({ id, sectionId, question, options, correctAnswer, explanation, difficulty }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<React.ReactNode | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { updateQuizProgress } = useCourseProgress();

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      updateQuizProgress(sectionId, id, isCorrect);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <QuizContainer>
      <QuizTitle>
        Exercise <span className="question-mark">?</span>
        {difficulty && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '0.8em',
            color: difficulty === 'easy' ? '#00c853' : difficulty === 'medium' ? '#ff9800' : '#f44336'
          }}>
            {difficulty.toUpperCase()}
          </span>
        )}
      </QuizTitle>
      <p>{question}</p>
      <div>
        {options.map((option, index) => (
          <AnswerOption
            key={index}
            className={`
              ${selectedAnswer === option ? 'selected' : ''}
              ${showResult && option === correctAnswer ? 'correct' : ''}
              ${showResult && selectedAnswer === option && option !== correctAnswer ? 'incorrect' : ''}
            `}
            onClick={() => !showResult && setSelectedAnswer(option)}
          >
            {option}
          </AnswerOption>
        ))}
      </div>
      {!showResult ? (
        <SubmitButton onClick={handleSubmit}>Submit Answer »</SubmitButton>
      ) : (
        <>
          <div style={{ margin: '16px 0', color: selectedAnswer === correctAnswer ? '#00c853' : '#f44336' }}>
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <p>{explanation}</p>
          <SubmitButton onClick={handleTryAgain}>Try Again</SubmitButton>
        </>
      )}
    </QuizContainer>
  );
};

const courseContent = {
  title: "Mathematics",
  description: "Master mathematics from basic arithmetic to advanced calculus",
  modules: [
    {
      id: "basic-math",
      title: "Basic Mathematics",
      sections: [
        {
          id: "formula-rearrangement",
          title: "Formula Rearrangement",
          content: (
            <ContentSection>
              <h1>Formula Rearrangement</h1>
              <p>In our first module of the beginner course, we will begin with the formula rearrangement skill. Don't worry if this seems challenging at first - we'll break it down into simple steps that anyone can follow.</p>
              
              <Section>
                <h2>Part 1: Basic Formula Rearrangement</h2>
                <ExampleBox>
                  <h3>Let's start with a simple example:</h3>
                  <MathExpression expression="6x + 5 = 14" />
                  <p>At first, you might feel a bit confused about what formula rearrangement is, but it's quite simple! The main idea is to keep the variable (x) on one side and all the numbers on the other side.</p>
                </ExampleBox>

                <Section>
                  <h3>Step 1: Understanding Addition and Subtraction</h3>
                  <p>When we start Formula Rearrangement, we first deal with addition and subtraction. In our example, we have 6x + 5. To isolate the term with x, we need to move the 5 to the other side.</p>
                  <p><strong>Key Rule:</strong> When moving terms across the equals sign, we use the opposite operation:</p>
                  <ul>
                    <li>If we're moving a plus (+), it becomes minus (-)</li>
                    <li>If we're moving a minus (-), it becomes plus (+)</li>
                  </ul>
                  <MathExpression expression="6x = 14 - 5" />
                  <MathExpression expression="6x = 9" />
                </Section>

                <Section>
                  <h3>Step 2: Handling Multiplication and Division</h3>
                  <p>Now, look closely at 6x. Even though we don't see any mathematical symbol between 6 and x, there's an invisible multiplication sign. To get x by itself, we need to divide both sides by 6.</p>
                  <MathExpression expression="x = \frac{9}{6}" />
                  <p>We can simplify this to: x = 1.5</p>
                </Section>

                <TipBox>
                  <h4><FaLightbulb /> Verification Tip</h4>
                  <p>Always check your answer by plugging it back into the original equation:</p>
                  <p>Original equation: 6x + 5 = 14</p>
                  <p>Put in x = 1.5:</p>
                  <p>6(1.5) + 5 = 14</p>
                  <p>9 + 5 = 14</p>
                  <p>14 = 14 ✓</p>
                </TipBox>

                <Quiz
                  id="q1"
                  sectionId="formula-rearrangement"
                  question="Try this one: Solve 2x + 3 = 11"
                  options={[
                    "x = 3",
                    "x = 4",
                    "x = 5",
                    "x = 6"
                  ]}
                  correctAnswer="x = 4"
                  explanation="Let's solve step by step:
1. Subtract 3 from both sides: 2x = 11 - 3
2. Simplify: 2x = 8
3. Divide both sides by 2: x = 8/2
4. Therefore: x = 4"
                  difficulty="easy"
                />

                <Quiz
                  id="q2"
                  sectionId="formula-rearrangement"
                  question="Now try: 5x - 10 = 15"
                  options={[
                    "x = 3",
                    "x = 4",
                    "x = 5",
                    "x = 6"
                  ]}
                  correctAnswer="x = 5"
                  explanation="Here's how to solve it:
1. Add 10 to both sides: 5x = 15 + 10
2. Simplify: 5x = 25
3. Divide both sides by 5: x = 25/5
4. Therefore: x = 5"
                  difficulty="easy"
                />

                <Quiz
                  id="q3"
                  sectionId="formula-rearrangement"
                  question="Solve: 2(x² + 1) = 18"
                  options={[
                    "x = ±2.83",
                    "x = ±3",
                    "x = ±4",
                    "x = ±5"
                  ]}
                  correctAnswer="x = ±3"
                  explanation="Let's solve step by step:
1. Distribute 2: 2x² + 2 = 18
2. Subtract 2 from both sides: 2x² = 16
3. Divide by 2: x² = 8
4. Take square root: x = ±√8 = ±2.83
The positive answer is approximately 2.83"
                  difficulty="medium"
                />

                <Quiz
                  id="q4"
                  sectionId="formula-rearrangement"
                  question="Solve the equation: 2(x² - 3) + 4(x + 1) = 16"
                  options={[
                    "x = -2 or x = 3",
                    "x = -3 or x = 2",
                    "x = -1 or x = 4",
                    "x = 1 or x = 2"
                  ]}
                  correctAnswer="x = -1 or x = 4"
                  explanation="Let's solve step by step:
1. Distribute 2: 2x² - 6 + 4x + 4 = 16
2. Combine like terms: 2x² + 4x - 2 = 16
3. Subtract 16 from both sides: 2x² + 4x - 18 = 0
4. Factor: 2(x² + 2x - 9) = 0
5. Factor further: 2(x + 4)(x - 1) = 0
6. Therefore x = -4 or x = 1"
                  difficulty="hard"
                />
              </Section>

              <Section>
                <h2>Part 2: Formula Rearrangement with Exponents and Brackets</h2>
                <p>The second lesson will teach what if the variable has an exponential, and there is brackets in the equation. In this case, we will have additional steps to follow.</p>

                <ExampleBox>
                  <h3>Let's look at this example:</h3>
                  <MathExpression expression="10 = 3(x² - 5)" />
                  <p>In this example, we cannot simply take the five and move it to the other side. Because there are brackets, we need to get rid of them first by multiplying 3 to both x² and 5.</p>
                </ExampleBox>

                <Section>
                  <h3>Step-by-Step Solution:</h3>
                  <ol>
                    <li>
                      <strong>Get rid of the brackets first:</strong>
                      <MathExpression expression="10 = 3x² - 15" />
                      <p>Multiply 3 by each term inside the brackets</p>
                    </li>
                    <li>
                      <strong>Handle additions and subtractions:</strong>
                      <MathExpression expression="25 = 3x²" />
                      <p>Move all numbers to one side</p>
                    </li>
                    <li>
                      <strong>Handle multiplication and division:</strong>
                      <MathExpression expression="\frac{25}{3} = x²" />
                    </li>
                    <li>
                      <strong>Deal with the exponent:</strong>
                      <MathExpression expression="x = ±√(\frac{25}{3})" />
                      <p>Take the square root of both sides to isolate x</p>
                    </li>
                  </ol>
                </Section>

                <TipBox>
                  <h4><FaLightbulb /> Key Points to Remember</h4>
                  <ul>
                    <li>Always deal with brackets first</li>
                    <li>Follow the order: brackets → addition/subtraction → multiplication/division → exponents</li>
                    <li>Whatever operation you do to one side, you must do to the other side</li>
                    <li>When taking the square root of an equation with x², remember you get both positive and negative solutions</li>
                  </ul>
                </TipBox>

                <Quiz
                  id="q6"
                  sectionId="formula-rearrangement"
                  question="Solve: 12 = 2(x² + 3)"
                  options={[
                    "x = ±√3",
                    "x = ±√4.5",
                    "x = ±3",
                    "x = ±2"
                  ]}
                  correctAnswer="x = ±√4.5"
                  explanation="Let's solve step by step:
1. Distribute 2: 12 = 2x² + 6
2. Subtract 6 from both sides: 6 = 2x²
3. Divide both sides by 2: 3 = x²
4. Take square root of both sides: x = ±√4.5"
                  difficulty="medium"
                />

                <Quiz
                  id="q7"
                  sectionId="formula-rearrangement"
                  question="Solve: 15 = 5(x² - 2)"
                  options={[
                    "x = ±√1",
                    "x = ±√5",
                    "x = ±2",
                    "x = ±3"
                  ]}
                  correctAnswer="x = ±2"
                  explanation="Let's solve step by step:
1. Distribute 5: 15 = 5x² - 10
2. Add 10 to both sides: 25 = 5x²
3. Divide both sides by 5: 5 = x²
4. Take square root of both sides: x = ±√5 = ±2"
                  difficulty="medium"
                />

                <Quiz
                  id="q8"
                  sectionId="formula-rearrangement"
                  question="Solve: 4(x² + 1) - 2(x² - 3) = 14"
                  options={[
                    "x = ±2",
                    "x = ±3",
                    "x = ±√5",
                    "x = ±√2"
                  ]}
                  correctAnswer="x = ±√2"
                  explanation="Let's solve step by step:
1. Distribute in first bracket: 4x² + 4
2. Distribute in second bracket: - 2x² + 6
3. Combine like terms: 4x² - 2x² + 4 + 6 = 14
4. Simplify: 2x² + 10 = 14
5. Subtract 10: 2x² = 4
6. Divide by 2: x² = 2
7. Take square root: x = ±√2"
                  difficulty="hard"
                />

                <Quiz
                  id="q9"
                  sectionId="formula-rearrangement"
                  question="Solve: 3(2x² - 4) = 6(x² - 1)"
                  options={[
                    "x = ±1",
                    "x = ±2",
                    "x = ±√2",
                    "x = 0"
                  ]}
                  correctAnswer="x = ±2"
                  explanation="Let's solve step by step:
1. Distribute on left side: 6x² - 12
2. Distribute on right side: 6x² - 6
3. Subtract 6x² from both sides: -12 = -6
4. Both sides are equal when divided by -6, so 2 = 1
5. Therefore, x = ±2"
                  difficulty="hard"
                />

                <Quiz
                  id="q10"
                  sectionId="formula-rearrangement"
                  question="If 8 = 2(x² + 3) - 4, what is the value of x?"
                  options={[
                    "x = ±1",
                    "x = ±2",
                    "x = ±√2",
                    "x = ±√3"
                  ]}
                  correctAnswer="x = ±√2"
                  explanation="Let's solve step by step:
1. Add 4 to both sides: 12 = 2(x² + 3)
2. Divide both sides by 2: 6 = x² + 3
3. Subtract 3 from both sides: 3 = x²
4. Take square root of both sides: x = ±√3"
                  difficulty="medium"
                />

                <Quiz
                  id="q11"
                  sectionId="formula-rearrangement"
                  question="Solve: 5(x² - 1) + 3(x² + 1) = 32"
                  options={[
                    "x = ±2",
                    "x = ±√2",
                    "x = ±√4",
                    "x = ±√8"
                  ]}
                  correctAnswer="x = ±2"
                  explanation="Let's solve step by step:
1. Distribute 5: 5x² - 5
2. Distribute 3: + 3x² + 3
3. Combine like terms: 8x² - 2 = 32
4. Add 2 to both sides: 8x² = 34
5. Divide by 8: x² = 4.25
6. Take square root: x = ±2"
                  difficulty="hard"
                />
              </Section>

              <Section>
                <h3>Summary</h3>
                <p>That sums up our Formula rearrangement module. You've learned how to:</p>
                <ul>
                  <li>Handle basic equations with addition, subtraction, multiplication, and division</li>
                  <li>Deal with brackets and exponents</li>
                  <li>Follow the correct order of operations when rearranging formulas</li>
                  <li>Solve for variables in more complex equations</li>
                </ul>
                <p>Now you can tackle whatever equation you may face!</p>
              </Section>
            </ContentSection>
          )
        },
        {
          id: "number-systems",
          title: "Number Systems",
          content: (
            <ContentSection>
              <h1>Number Systems</h1>
              <p>In this module we will talk about types of numbers and what they are. Real numbers can be broken down into two types: Rational numbers and Irrational numbers.</p>

              <Section>
                <h2>Part 1: Rational Numbers</h2>
                <p>Rational numbers come in several forms: integers, fractions, terminating decimals, and repeating decimals.</p>

                <ExampleBox>
                  <h3>Integers</h3>
                  <p>Integers are numbers without decimals. For example:</p>
                  <MathExpression expression="-3, -2, -1, 0, 1, 2, 3" />
                  <p>These numbers can only be categorized as integers.</p>
                </ExampleBox>

                <Section>
                  <h3>Fractions and Their Forms</h3>
                  <p>Fractions can be written in three different ways:</p>
                  <ul>
                    <li>As a fraction (e.g., <MathExpression expression="\frac{5}{2}" />)</li>
                    <li>As a terminating decimal (e.g., 2.5)</li>
                    <li>As a repeating decimal (when applicable)</li>
                  </ul>
                  <TipBox>
                    <h4><FaLightbulb /> Important Rule</h4>
                    <p>The denominator cannot be zero - you cannot divide by zero!</p>
                  </TipBox>
                </Section>

                <Section>
                  <h3>Terminating Decimals</h3>
                  <p>A terminating decimal is a number followed by a point and a finite number of digits.</p>
                  <ExampleBox>
                    <p>Example: <MathExpression expression="\frac{5}{2} = 2.5" /></p>
                    <p>Terminating decimals make numbers more understandable and versatile in calculations.</p>
                  </ExampleBox>
                </Section>

                <Section>
                  <h3>Repeating Decimals</h3>
                  <p>Repeating decimals have one or more digits that repeat indefinitely.</p>
                  <ExampleBox>
                    <p>Example: <MathExpression expression="\frac{1}{3} = 0.3333..." /></p>
                    <p>We indicate repeating decimals with a vinculum (bar) above the repeating digits: 0.3̅</p>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="q1"
                  sectionId="number-systems"
                  question="Which of these is NOT a rational number?"
                  options={[
                    "0.25",
                    "√2",
                    "-7",
                    "3.333..."
                  ]}
                  correctAnswer="√2"
                  explanation="All options except √2 are rational numbers because they can be expressed as fractions:
- 0.25 = 1/4
- -7 = -7/1
- 3.333... = 10/3
√2 is irrational because it cannot be expressed as a fraction."
                  difficulty="easy"
                />

                <Quiz
                  id="q2"
                  sectionId="number-systems"
                  question="What type of decimal is 0.142857142857...?"
                  options={[
                    "Terminating decimal",
                    "Repeating decimal",
                    "Irrational number",
                    "Integer"
                  ]}
                  correctAnswer="Repeating decimal"
                  explanation="This is a repeating decimal because the sequence '142857' repeats indefinitely. It can be written as the fraction 1/7."
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h2>Part 2: Irrational Numbers</h2>
                <p>Irrational numbers cannot be expressed as fractions or decimals because their decimal representations never end and never repeat in a pattern.</p>

                <ExampleBox>
                  <h3>Common Irrational Numbers</h3>
                  <ul>
                    <li>π (pi) ≈ 3.14159...</li>
                    <li>e (Euler's number) ≈ 2.71828...</li>
                    <li>√2 ≈ 1.41421...</li>
                  </ul>
                </ExampleBox>

                <Quiz
                  id="q3"
                  sectionId="number-systems"
                  question="Which of these is an irrational number?"
                  options={[
                    "0.666...",
                    "√9",
                    "π",
                    "-4.5"
                  ]}
                  correctAnswer="π"
                  explanation="π is irrational because its decimal representation never ends and never repeats.
- 0.666... is rational (2/3)
- √9 is rational (3)
- -4.5 is rational (-9/2)"
                  difficulty="medium"
                />

                <Quiz
                  id="q4"
                  sectionId="number-systems"
                  question="Convert 0.75 to a fraction in its simplest form"
                  options={[
                    "75/100",
                    "3/4",
                    "7/5",
                    "15/20"
                  ]}
                  correctAnswer="3/4"
                  explanation="0.75 can be converted to a fraction:
1. 0.75 = 75/100
2. Simplify by dividing both numerator and denominator by 25
3. 75/100 = 3/4"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h3>Summary</h3>
                <p>In this Number Systems module, you've learned about:</p>
                <ul>
                  <li>The two main types of real numbers: rational and irrational</li>
                  <li>Different forms of rational numbers: integers, fractions, and decimals</li>
                  <li>How to identify and work with repeating decimals</li>
                  <li>Common irrational numbers and their properties</li>
                  <li>The relationship between fractions and decimals</li>
                </ul>
                <p>Understanding these number systems is crucial for advanced mathematical concepts!</p>
              </Section>
            </ContentSection>
          )
        },
        {
          id: "percentages",
          title: "Percentages",
          content: (
            <ContentSection>
              <h1>Percentages</h1>
              <p>A percent can be expressed by the symbol % and it is a fraction of hundred. When we write 25% it is equivalent to 25/100. It is commonly used in grades, sales, and many other real-world applications.</p>

              <Section>
                <h2>Part 1: Understanding Percentages</h2>
                <ExampleBox>
                  <h3>Basic Formula</h3>
                  <MathExpression expression="percent = \frac{part}{whole}" />
                  <p>This formula is the foundation for all percentage calculations.</p>
                </ExampleBox>

                <TipBox>
                  <h4><FaLightbulb /> Key Concept</h4>
                  <p>Remember: A percentage is just a fraction out of 100. For example:</p>
                  <MathExpression expression="25% = \frac{25}{100} = 0.25" />
                </TipBox>
              </Section>

              <Section>
                <h2>Part 2: Solving Percentage Problems</h2>
                
                <Section>
                  <h3>Finding the Part</h3>
                  <ExampleBox>
                    <h4>Example 1: What is 20% of 80?</h4>
                    <p>Step-by-Step Solution:</p>
                    <ol>
                      <li>Identify what we're looking for: the part (x)</li>
                      <li>Write the equation: <MathExpression expression="\frac{20}{100} = \frac{x}{80}" /> </li>
                      <li>Multiply both sides by 80: <MathExpression expression="80 \cdot \frac{20}{100} = x" /> </li>
                      <li>Simplify: <MathExpression expression="x = 16" /> </li>
                    </ol>
                    <p>Therefore, 20% of 80 is 16</p>
                  </ExampleBox>
                </Section>

                <Section>
                  <h3>Finding the Whole</h3>
                  <ExampleBox>
                    <h4>Example 2: 125 is 45% of what number?</h4>
                    <p>Step-by-Step Solution:</p>
                    <ol>
                      <li>Identify what we're looking for: the whole (x)</li>
                      <li>Write the equation: <MathExpression expression="\frac{45}{100} = \frac{125}{x}" /> </li>
                      <li>Flip the fractions: <MathExpression expression="\frac{100}{45} = \frac{x}{125}" /> </li>
                      <li>Multiply both sides by 125: <MathExpression expression="x = 125 \cdot \frac{100}{45}" /> </li>
                      <li>Calculate: <MathExpression expression="x = 277.7" /> </li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="q1"
                  sectionId="percentages"
                  question="What is 25% of 200?"
                  options={[
                    "25",
                    "50",
                    "75",
                    "100"
                  ]}
                  correctAnswer="50"
                  explanation="Let's solve using our formula:
1. Write the equation: 25/100 = x/200
2. Multiply both sides by 200: x = 200 × (25/100)
3. Simplify: x = 50"
                  difficulty="easy"
                />

                <Quiz
                  id="q2"
                  sectionId="percentages"
                  question="60 is 30% of what number?"
                  options={[
                    "150",
                    "180",
                    "200",
                    "240"
                  ]}
                  correctAnswer="200"
                  explanation="Let's solve step by step:
1. Write the equation: 30/100 = 60/x
2. Flip the fractions: 100/30 = x/60
3. Multiply both sides by 60: x = 60 × (100/30)
4. Simplify: x = 200"
                  difficulty="medium"
                />

                <Quiz
                  id="q3"
                  sectionId="percentages"
                  question="What percentage is 15 out of 75?"
                  options={[
                    "15%",
                    "20%",
                    "25%",
                    "30%"
                  ]}
                  correctAnswer="20%"
                  explanation="Let's solve:
1. Use the formula: percent/100 = 15/75
2. Multiply both sides by 100: percent = (15/75) × 100
3. Simplify: percent = 20%"
                  difficulty="medium"
                />

                <Quiz
                  id="q4"
                  sectionId="percentages"
                  question="If 40% of a number is 80, what is the number?"
                  options={[
                    "160",
                    "200",
                    "240",
                    "320"
                  ]}
                  correctAnswer="200"
                  explanation="Let's solve:
1. Write the equation: 40/100 = 80/x
2. Flip the fractions: 100/40 = x/80
3. Multiply both sides by 80: x = 80 × (100/40)
4. Simplify: x = 200"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h3>Summary</h3>
                <p>In this Percentages module, you've learned:</p>
                <ul>
                  <li>How to understand percentages as fractions of 100</li>
                  <li>The basic percentage formula: percent = part/whole</li>
                  <li>How to find the part when given the percentage and whole</li>
                  <li>How to find the whole when given the part and percentage</li>
                  <li>How to solve real-world percentage problems</li>
                </ul>
                <TipBox>
                  <h4><FaLightbulb /> Remember</h4>
                  <p>Always start by identifying what you're looking for (part, whole, or percentage) and use the formula accordingly!</p>
                </TipBox>
              </Section>
            </ContentSection>
          )
        }
      ]
    },
    {
      id: "intermediate-math",
      title: "Intermediate Mathematics",
      sections: [
        {
          id: "laws-of-exponents",
          title: "Laws of Exponents",
          content: (
            <ContentSection>
              <h1>Laws of Exponents</h1>
              <p>An exponent is the number of times a digit is multiplied by itself. For example, when we say "two raised to the power of two" (2²), it means 2 × 2, which equals 4.</p>

              <Section>
                <h2>Part 1: Basic Laws of Exponents</h2>
                <ExampleBox>
                  <h3>Fundamental Rules</h3>
                  <ul>
                    <li><MathExpression expression="a^0 = 1" /></li>
                    <li><MathExpression expression="a^1 = a" /></li>
                    <li><MathExpression expression="a^m \times a^n = a^{m+n}" /></li>
                    <li><MathExpression expression="\frac{a^m}{a^n} = a^{m-n}" /></li>
                    <li><MathExpression expression="(a^m)^n = a^{mn}" /></li>
                    <li><MathExpression expression="(ab)^m = a^m b^m" /></li>
                    <li><MathExpression expression="\left(\frac{a}{b}\right)^m = \frac{a^m}{b^m}" /></li>
                    <li><MathExpression expression="a^{\frac{m}{n}} = \sqrt[n]{a^m}" /></li>
                  </ul>
                </ExampleBox>

                <TipBox>
                  <h4><FaLightbulb /> Key Concept</h4>
                  <p>When working with exponents, always identify the base and power first. The base is the number being multiplied, and the power tells us how many times to multiply it.</p>
                </TipBox>
              </Section>

              <Section>
                <h2>Part 2: Applying the Laws</h2>
                
                <Section>
                  <h3>Example 1: Adding Exponents with Same Base</h3>
                  <ExampleBox>
                    <p>Simplify: <MathExpression expression="5^3 \times 5^7 \times 5^5" /></p>
                    <p>Step-by-Step Solution:</p>
                    <ol>
                      <li>When multiplying same bases, add the exponents</li>
                      <li><MathExpression expression="5^3 \times 5^7 \times 5^5 = 5^{3+7+5}" /></li>
                      <li><MathExpression expression="= 5^{15}" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Section>
                  <h3>Example 2: Power of a Power</h3>
                  <ExampleBox>
                    <p>Simplify: <MathExpression expression="(x^5)^7" /></p>
                    <p>Step-by-Step Solution:</p>
                    <ol>
                      <li>When raising a power to a power, multiply the exponents</li>
                      <li><MathExpression expression="(x^5)^7 = x^{5 \times 7}" /></li>
                      <li><MathExpression expression="= x^{35}" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Section>
                  <h3>Example 3: Negative Exponents</h3>
                  <ExampleBox>
                    <p>Simplify: <MathExpression expression="5^{-3}" /></p>
                    <p>Step-by-Step Solution:</p>
                    <ol>
                      <li>A negative exponent means to flip the base and make the exponent positive</li>
                      <li><MathExpression expression="5^{-3} = \frac{1}{5^3}" /></li>
                      <li><MathExpression expression="= \frac{1}{125}" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="q1"
                  sectionId="laws-of-exponents"
                  question="Simplify: 2³ × 2⁴"
                  options={[
                    "2⁷",
                    "2¹²",
                    "2⁵",
                    "2¹"
                  ]}
                  correctAnswer="2⁷"
                  explanation="When multiplying same bases, add the exponents:
1. 2³ × 2⁴ = 2³⁺⁴
2. = 2⁷"
                  difficulty="easy"
                />

                <Quiz
                  id="q2"
                  sectionId="laws-of-exponents"
                  question="Simplify: (3⁴)²"
                  options={[
                    "3⁶",
                    "3⁸",
                    "9⁴",
                    "6⁴"
                  ]}
                  correctAnswer="3⁸"
                  explanation="When raising a power to a power, multiply the exponents:
1. (3⁴)² = 3⁴ˣ²
2. = 3⁸"
                  difficulty="medium"
                />

                <Quiz
                  id="q3"
                  sectionId="laws-of-exponents"
                  question="Express with a positive exponent: x⁻³"
                  options={[
                    "³√x",
                    "-x³",
                    "1/x³",
                    "x/3"
                  ]}
                  correctAnswer="1/x³"
                  explanation="For negative exponents:
1. x⁻³ = 1/x³
2. The negative exponent means to flip the base and make the exponent positive"
                  difficulty="medium"
                />

                <Quiz
                  id="q4"
                  sectionId="laws-of-exponents"
                  question="Simplify: (2x)³"
                  options={[
                    "2³x",
                    "6x³",
                    "8x³",
                    "2³x³"
                  ]}
                  correctAnswer="8x³"
                  explanation="Using the power of a product rule:
1. (2x)³ = 2³ × x³
2. = 8 × x³
3. = 8x³"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h3>Summary</h3>
                <p>In this Laws of Exponents module, you've learned:</p>
                <ul>
                  <li>The fundamental laws of exponents</li>
                  <li>How to multiply and divide expressions with same bases</li>
                  <li>How to handle power of powers</li>
                  <li>How to work with negative exponents</li>
                  <li>How to apply these rules to simplify expressions</li>
                </ul>
                <TipBox>
                  <h4><FaLightbulb /> Remember</h4>
                  <p>Always check if the bases are the same before applying the laws of exponents!</p>
                </TipBox>
              </Section>
            </ContentSection>
          )
        },
        {
          id: "negative-exponents",
          title: "Negative Exponents",
          content: (
            <ContentSection>
              <h1>Negative Exponents</h1>
              <p>Negative exponents are a way to represent division using exponent notation. When a number has a negative exponent, it means we need to flip the number and make the exponent positive.</p>

              <Section>
                <h2>Part 1: Understanding Negative Exponents</h2>
                <ExampleBox>
                  <h3>Basic Rule</h3>
                  <MathExpression 
                    inline={false} 
                    expression="x^{-n} = \frac{1}{x^n}" 
                  />
                  <p>This means that any number with a negative exponent can be rewritten as a fraction with 1 in the numerator.</p>
                </ExampleBox>

                <TipBox>
                  <h4><FaLightbulb /> Key Concept</h4>
                  <p>Remember: A negative exponent means to flip the base and make the exponent positive!</p>
                </TipBox>

                <Section>
                  <h3>Examples</h3>
                  <ExampleBox>
                    <p>Example 1: Simplify <MathExpression expression="2^{-3}" /></p>
                    <ol>
                      <li>Flip the base and make exponent positive</li>
                      <li><MathExpression expression="2^{-3} = \frac{1}{2^3}" /></li>
                      <li><MathExpression expression="= \frac{1}{8}" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="ne1"
                  sectionId="negative-exponents"
                  question="Simplify: 5⁻²"
                  options={[
                    "1/25",
                    "-25",
                    "25",
                    "-1/25"
                  ]}
                  correctAnswer="1/25"
                  explanation="Using the negative exponent rule:
1. 5⁻² = 1/5²
2. = 1/25"
                  difficulty="easy"
                />
              </Section>

              <Section>
                <h3>Understanding Negative Exponents</h3>
                <p>A negative exponent indicates how many times to divide by the base number. For example:</p>
                <MathExpression expression="2^{-3} = \frac{1}{2^3} = \frac{1}{8}" />
                <p>Key rules to remember:</p>
                <ul>
                  <li>Any number raised to a negative power equals its reciprocal raised to the positive power</li>
                  <li>Zero raised to a negative power is undefined</li>
                  <li>Negative numbers raised to negative powers follow the same rules</li>
                </ul>
              </Section>

              <Quiz
                id="ne1"
                sectionId="negative-exponents"
                question={<>Simplify: <MathExpression expression="5^{-1}" /></>}
                options={[
                  <MathExpression expression="\frac{1}{5}" />,
                  <MathExpression expression="5" />,
                  <MathExpression expression="-5" />,
                  <MathExpression expression="-\frac{1}{5}" />
                ]}
                correctAnswer={<MathExpression expression="\frac{1}{5}" />}
                explanation={<>
                  When we have a negative exponent (-1), we:
                  <ol>
                    <li>Take the reciprocal of the base (5)</li>
                    <li>Make the exponent positive</li>
                    <li>Therefore: <MathExpression expression="5^{-1} = \frac{1}{5^1} = \frac{1}{5}" /></li>
                  </ol>
                </>}
                difficulty="easy"
              />

              <Quiz
                id="ne2"
                sectionId="negative-exponents"
                question={<>Simplify: <MathExpression expression="(2x^{-3}y^{-2})^{-2}" /></>}
                options={[
                  <MathExpression expression="\frac{x^6y^4}{4}" />,
                  <MathExpression expression="4x^6y^4" />,
                  <MathExpression expression="\frac{4}{x^6y^4}" />,
                  <MathExpression expression="\frac{1}{4x^6y^4}" />
                ]}
                correctAnswer={<MathExpression expression="4x^6y^4" />}
                explanation={<>
                  Let's solve this step by step:
                  <ol>
                    <li>When raising a power to a power, multiply exponents</li>
                    <li><MathExpression expression="(2x^{-3}y^{-2})^{-2} = 2^{-2}x^{(-3)(-2)}y^{(-2)(-2)}" /></li>
                    <li><MathExpression expression="= \frac{1}{2^2}x^6y^4" /></li>
                    <li><MathExpression expression="= \frac{1}{4}x^6y^4 = 4x^6y^4" /></li>
                  </ol>
                </>}
                difficulty="hard"
              />
            </ContentSection>
          )
        },
        {
          id: "polynomials",
          title: "Polynomials",
          content: (
            <ContentSection>
              <h1>Polynomials</h1>
              <p>A polynomial is an expression consisting of variables and coefficients using only addition, subtraction, multiplication, and non-negative integer exponents.</p>

              <Section>
                <h2>Part 1: Types of Polynomials</h2>
                <ExampleBox>
                  <h3>Classification by Terms</h3>
                  <ul>
                    <li>Monomial: <MathExpression expression="5x^2" /></li>
                    <li>Binomial: <MathExpression expression="2x + 3" /></li>
                    <li>Trinomial: <MathExpression expression="x^2 + 2x + 1" /></li>
                  </ul>
                </ExampleBox>

                <Section>
                  <h3>Adding and Subtracting Polynomials</h3>
                  <ExampleBox>
                    <p>Example: <MathExpression expression="(3x^2 + 2x - 1) + (x^2 - 2x + 3)" /></p>
                    <ol>
                      <li>Combine like terms</li>
                      <li><MathExpression expression="= 4x^2 + 0x + 2" /></li>
                      <li><MathExpression expression="= 4x^2 + 2" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="p1"
                  sectionId="polynomials"
                  question="What is (2x² + 3x) + (x² - x + 4)?"
                  options={[
                    "3x² + 2x + 4",
                    "3x² + 4x + 4",
                    "2x² + 2x + 4",
                    "x² + 2x + 4"
                  ]}
                  correctAnswer="3x² + 2x + 4"
                  explanation="Combine like terms:
1. Combine x² terms: 2x² + x² = 3x²
2. Combine x terms: 3x + (-x) = 2x
3. Constants: 4
4. Result: 3x² + 2x + 4"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h3>Advanced Polynomial Operations</h3>
                <p>Polynomials can be manipulated using these key operations:</p>
                <ul>
                  <li>Addition/Subtraction: Combine like terms</li>
                  <li>Multiplication: Use the distributive property</li>
                  <li>Division: Use long division or synthetic division</li>
                  <li>Finding roots: Use factoring or the quadratic formula</li>
                </ul>
              </Section>

              <Quiz
                id="poly1"
                sectionId="polynomials"
                question={<>Multiply: <MathExpression expression="(x + 2)(x - 3)" /></>}
                options={[
                  <MathExpression expression="x^2 - x - 6" />,
                  <MathExpression expression="x^2 + x - 6" />,
                  <MathExpression expression="x^2 - 5x + 6" />,
                  <MathExpression expression="x^2 + 5x + 6" />
                ]}
                correctAnswer={<MathExpression expression="x^2 - x - 6" />}
                explanation={<>
                  Using FOIL method:
                  <ol>
                    <li>First: <MathExpression expression="x \cdot x = x^2" /></li>
                    <li>Outer: <MathExpression expression="x \cdot (-3) = -3x" /></li>
                    <li>Inner: <MathExpression expression="2 \cdot x = 2x" /></li>
                    <li>Last: <MathExpression expression="2 \cdot (-3) = -6" /></li>
                    <li>Combine like terms: <MathExpression expression="x^2 - 3x + 2x - 6 = x^2 - x - 6" /></li>
                  </ol>
                </>}
                difficulty="easy"
              />

              <Quiz
                id="poly2"
                sectionId="polynomials"
                question={<>Find all values of x that satisfy: <MathExpression expression="2x^3 - 3x^2 - 12x + 13 = 0" /></>}
                options={[
                  <MathExpression expression="x = -1, x = 2, x = \frac{13}{2}" />,
                  <MathExpression expression="x = 1, x = -2, x = \frac{13}{2}" />,
                  <MathExpression expression="x = -1, x = 2, x = \frac{13}{4}" />,
                  <MathExpression expression="x = 1, x = 2, x = \frac{13}{2}" />
                ]}
                correctAnswer={<MathExpression expression="x = -1, x = 2, x = \frac{13}{2}" />}
                explanation={<>
                  This requires multiple steps:
                  <ol>
                    <li>Factor out common terms if possible</li>
                    <li>Try factoring by grouping</li>
                    <li>The polynomial can be factored as: <MathExpression expression="(x + 1)(2x - 13)(x - 2)" /></li>
                    <li>Set each factor to zero and solve:
                      <ul>
                        <li><MathExpression expression="x + 1 = 0 \rightarrow x = -1" /></li>
                        <li><MathExpression expression="2x - 13 = 0 \rightarrow x = \frac{13}{2}" /></li>
                        <li><MathExpression expression="x - 2 = 0 \rightarrow x = 2" /></li>
                      </ul>
                    </li>
                  </ol>
                </>}
                difficulty="hard"
              />
            </ContentSection>
          )
        },
        {
          id: "factoring",
          title: "Factoring",
          content: (
            <ContentSection>
              <h1>Factoring</h1>
              <p>Factoring is the process of breaking down an expression into a product of simpler expressions.</p>

              <Section>
                <h2>Part 1: Common Factoring Methods</h2>
                <ExampleBox>
                  <h3>Greatest Common Factor (GCF)</h3>
                  <p>Example: <MathExpression expression="6x^2 + 12x" /></p>
                  <ol>
                    <li>Find GCF: 6</li>
                    <li>Factor out GCF: <MathExpression expression="6(x^2 + 2x)" /></li>
                  </ol>
                </ExampleBox>

                <Section>
                  <h3>Perfect Square Trinomials</h3>
                  <ExampleBox>
                    <p>Example: <MathExpression expression="x^2 + 2x + 1" /></p>
                    <p>This is a perfect square trinomial that factors to: <MathExpression expression="(x + 1)^2" /></p>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="f1"
                  sectionId="factoring"
                  question="Factor: x² + 6x + 9"
                  options={[
                    "(x + 3)²",
                    "(x - 3)²",
                    "(x + 3)(x + 3)",
                    "(x - 3)(x - 3)"
                  ]}
                  correctAnswer="(x + 3)²"
                  explanation="This is a perfect square trinomial:
1. First term is x²
2. Middle term is 2(x)(3) = 6x
3. Last term is 3²= 9
Therefore, it factors to (x + 3)²"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h2>Part 2: Advanced Factoring Techniques</h2>
                <ExampleBox>
                  <h3>Difference of Squares</h3>
                  <p>When you have an expression in the form a² - b², it can be factored as (a+b)(a-b)</p>
                  <MathExpression expression="x^2 - 16 = (x+4)(x-4)" />
                </ExampleBox>

                <ExampleBox>
                  <h3>Sum and Difference of Cubes</h3>
                  <p>For sum of cubes: a³ + b³ = (a + b)(a² - ab + b²)</p>
                  <p>For difference of cubes: a³ - b³ = (a - b)(a² + ab + b²)</p>
                </ExampleBox>

                <Quiz
                  id="f2"
                  sectionId="factoring"
                  question="Factor completely: x² - 25"
                  options={[
                    "(x + 5)(x - 5)",
                    "(x + 5)²",
                    "(x - 5)²",
                    "Cannot be factored"
                  ]}
                  correctAnswer="(x + 5)(x - 5)"
                  explanation="This is a difference of squares:
1. Identify a² = x² and b² = 25
2. Therefore a = x and b = 5
3. Use the formula (a+b)(a-b)
4. Result: (x + 5)(x - 5)"
                  difficulty="easy"
                />

                <Quiz
                  id="f3"
                  sectionId="factoring"
                  question="Factor completely: 2x³ + 54x"
                  options={[
                    "2x(x² + 27)",
                    "2x(x + 9)(x - 3)",
                    "2x(x + 3)(x - 9)",
                    "2x(x + 27)"
                  ]}
                  correctAnswer="2x(x + 9)(x - 3)"
                  explanation="Let's solve step by step:
1. Factor out GCF: 2x(x² + 27)
2. Check if remaining expression can be factored
3. x² + 27 is not a perfect square
4. Factor as difference of squares if possible
5. Result: 2x(x + 9)(x - 3)"
                  difficulty="hard"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "rational-expressions",
          title: "Rational Expressions",
          content: (
            <ContentSection>
              <h1>Rational Expressions</h1>
              <p>A rational expression is a fraction where both the numerator and denominator are polynomials.</p>

              <Section>
                <h2>Part 1: Simplifying Rational Expressions</h2>
                <ExampleBox>
                  <h3>Basic Example</h3>
                  <MathExpression expression="\frac{x^2 + 3x}{x + 3}" />
                  <p>To simplify, factor both numerator and denominator and cancel common factors.</p>
                </ExampleBox>

                <Section>
                  <h3>Adding Rational Expressions</h3>
                  <ExampleBox>
                    <p>Example: <MathExpression expression="\frac{1}{x + 2} + \frac{1}{x - 2}" /></p>
                    <ol>
                      <li>Find common denominator: <MathExpression expression="(x + 2)(x - 2)" /></li>
                      <li>Rewrite with common denominator</li>
                      <li>Add numerators</li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="re1"
                  sectionId="rational-expressions"
                  question="Simplify: (x² + 2x)/(x)"
                  options={[
                    "x + 2",
                    "x²",
                    "2x",
                    "x + 1"
                  ]}
                  correctAnswer="x + 2"
                  explanation="To simplify:
1. Factor out x from numerator: x(x + 2)
2. Cancel common factor x
3. Result: x + 2"
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h2>Part 2: Complex Operations with Rational Expressions</h2>
                <ExampleBox>
                  <h3>Multiplication and Division</h3>
                  <p>When multiplying rational expressions:</p>
                  <ol>
                    <li>Multiply numerators together</li>
                    <li>Multiply denominators together</li>
                    <li>Factor and cancel common factors</li>
                  </ol>
                  <MathExpression expression="\frac{x+1}{x-2} \cdot \frac{x-3}{x+1} = \frac{x-3}{x-2}" />
                </ExampleBox>

                <Quiz
                  id="re2"
                  sectionId="rational-expressions"
                  question="Simplify: (x² - 4)/(x - 2)"
                  options={[
                    "x + 2",
                    "x - 2",
                    "x",
                    "Cannot be simplified"
                  ]}
                  correctAnswer="x + 2"
                  explanation="Let's solve:
1. Factor numerator: (x + 2)(x - 2)
2. Cancel common factor (x - 2)
3. Result: x + 2"
                  difficulty="easy"
                />

                <Quiz
                  id="re3"
                  sectionId="rational-expressions"
                  question="Multiply and simplify: (x² + 2x)/(x - 1) · (x - 1)/(x² + x)"
                  options={[
                    "x/(x + 1)",
                    "x",
                    "(x + 2)/(x + 1)",
                    "x + 2"
                  ]}
                  correctAnswer="x/(x + 1)"
                  explanation="Let's solve step by step:
1. Multiply numerators: x²(x + 2)
2. Multiply denominators: (x - 1)(x² + x)
3. Cancel common factors
4. Factor and simplify
5. Result: x/(x + 1)"
                  difficulty="hard"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "geometry",
          title: "Geometry",
          content: (
            <ContentSection>
              <h1>Geometry</h1>
              <p>Geometry is the study of shapes, sizes, and positions of figures in space.</p>

              <Section>
                <h2>Part 1: Basic Geometric Concepts</h2>
                <ExampleBox>
                  <h3>Area Formulas</h3>
                  <ul>
                    <li>Rectangle: <MathExpression expression="A = l \times w" /></li>
                    <li>Triangle: <MathExpression expression="A = \frac{1}{2}bh" /></li>
                    <li>Circle: <MathExpression expression="A = \pi r^2" /></li>
                  </ul>
                </ExampleBox>

                <Section>
                  <h3>Perimeter and Circumference</h3>
                  <ExampleBox>
                    <p>Example: Find the perimeter of a rectangle with length 8 and width 5</p>
                    <ol>
                      <li>Use formula: <MathExpression expression="P = 2(l + w)" /></li>
                      <li>Substitute values: <MathExpression expression="P = 2(8 + 5)" /></li>
                      <li>Calculate: <MathExpression expression="P = 26" /></li>
                    </ol>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="g1"
                  sectionId="geometry"
                  question={<>What is the area of a circle with radius 4 units? <MathExpression expression="(r = 4)" /></>}
                  options={[
                    <MathExpression expression="16\pi \text{ square units}" />,
                    <MathExpression expression="8\pi \text{ square units}" />,
                    <MathExpression expression="4\pi \text{ square units}" />,
                    <MathExpression expression="12\pi \text{ square units}" />
                  ]}
                  correctAnswer={<MathExpression expression="16\pi \text{ square units}" />}
                  explanation={<>Using the circle area formula:
                    <ol>
                      <li><MathExpression expression="A = \pi r^2" /></li>
                      <li><MathExpression expression="A = \pi(4)^2" /></li>
                      <li><MathExpression expression="A = 16\pi \text{ square units}" /></li>
                    </ol>
                  </>}
                  difficulty="medium"
                />
              </Section>

              <Section>
                <h2>Part 2: Advanced Geometric Concepts</h2>
                <ExampleBox>
                  <h3>Volume Formulas</h3>
                  <ul>
                    <li>Cube: <MathExpression expression="V = s^3" /></li>
                    <li>Cylinder: <MathExpression expression="V = \pi r^2h" /></li>
                    <li>Sphere: <MathExpression expression="V = \frac{4}{3}\pi r^3" /></li>
                  </ul>
                </ExampleBox>

                <Quiz
                  id="g2"
                  sectionId="geometry"
                  question="Find the volume of a cylinder with radius 3 units and height 4 units."
                  options={[
                    <MathExpression expression="36\pi \text{ cubic units}" />,
                    <MathExpression expression="24\pi \text{ cubic units}" />,
                    <MathExpression expression="12\pi \text{ cubic units}" />,
                    <MathExpression expression="9\pi \text{ cubic units}" />
                  ]}
                  correctAnswer={<MathExpression expression="36\pi \text{ cubic units}" />}
                  explanation={<>Using the cylinder volume formula:
                    <ol>
                      <li><MathExpression expression="V = \pi r^2h" /></li>
                      <li><MathExpression expression="V = \pi(3)^2(4)" /></li>
                      <li><MathExpression expression="V = \pi(9)(4)" /></li>
                      <li><MathExpression expression="V = 36\pi \text{ cubic units}" /></li>
                    </ol>
                  </>}
                  difficulty="easy"
                />

                <Quiz
                  id="g3"
                  sectionId="geometry"
                  question="A sphere has a surface area of 36π square units. What is its volume?"
                  options={[
                    <MathExpression expression="36\pi \text{ cubic units}" />,
                    <MathExpression expression="24\pi \text{ cubic units}" />,
                    <MathExpression expression="12\pi \text{ cubic units}" />,
                    <MathExpression expression="48\pi \text{ cubic units}" />
                  ]}
                  correctAnswer={<MathExpression expression="24\pi \text{ cubic units}" />}
                  explanation={<>Let's solve step by step:
                    <ol>
                      <li>Surface area formula: <MathExpression expression="A = 4\pi r^2" /></li>
                      <li>Given 36π = 4πr², solve for r: <MathExpression expression="r^2 = 9" /></li>
                      <li>Therefore r = 3</li>
                      <li>Volume formula: <MathExpression expression="V = \frac{4}{3}\pi r^3" /></li>
                      <li>Substitute r = 3: <MathExpression expression="V = \frac{4}{3}\pi(27)" /></li>
                      <li>Result: <MathExpression expression="V = 24\pi \text{ cubic units}" /></li>
                    </ol>
                  </>}
                  difficulty="hard"
                />
              </Section>
            </ContentSection>
          )
        }
      ]
    },
    {
      id: "advanced-math",
      title: "Advanced Mathematics",
      sections: [
        {
          id: "differential-equations",
          title: "Differential Equations",
          content: (
            <ContentSection>
              <h1>Differential Equations</h1>
              <p>Coming soon...</p>
            </ContentSection>
          )
        },
        {
          id: "linear-algebra",
          title: "Linear Algebra",
          content: (
            <ContentSection>
              <h1>Linear Algebra</h1>
              <p>Coming soon...</p>
            </ContentSection>
          )
        },
        {
          id: "complex-analysis",
          title: "Complex Analysis",
          content: (
            <ContentSection>
              <h1>Complex Analysis</h1>
              <p>Coming soon...</p>
            </ContentSection>
          )
        }
      ]
    }
  ]
};

const BasicMathematics: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const { user, logout } = useAuth();
  const { 
    updateScrollProgress, 
    getCourseProgress, 
    getSectionProgress,
    loading,
    isAuthenticated 
  } = useCourseProgress();
  const contentRef = useRef<HTMLDivElement>(null);
  const courseId = 'math-beg';
  const navigate = useNavigate();

  // Remove the redirect for non-authenticated users
  useEffect(() => {
    if (!activeSection && courseContent.modules.length > 0) {
      const firstModule = courseContent.modules[0];
      if (firstModule.sections.length > 0) {
        setActiveSection(firstModule.sections[0].id);
      }
    }
  }, [activeSection]);

  // Only track progress for authenticated users
  useEffect(() => {
    if (!user) return; // Skip progress tracking for non-authenticated users

    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        
        // Calculate progress as percentage
        const progress = Math.min((scrollPosition / totalHeight) * 100, 100);
        
        // Update both course and section progress
        updateScrollProgress(courseId, progress);
        if (activeSection) {
          updateScrollProgress(activeSection, progress);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [updateScrollProgress, activeSection, courseId, user]);

  // Add scroll handler for navbar
  useEffect(() => {
    let lastScroll = 0;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 0);
      
      if (currentScroll > lastScroll) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const progress = user ? getCourseProgress(courseId) : 0;
  const sectionProgress = user && activeSection ? getSectionProgress(activeSection) : 0;

  const currentModuleIndex = activeSection 
    ? courseContent.modules.findIndex(module =>
        module.sections.some(section => section.id === activeSection)
      )
    : 0;
  
  const currentSectionIndex = activeSection 
    ? courseContent.modules[currentModuleIndex]?.sections.findIndex(
        section => section.id === activeSection
      )
    : 0;

  const handleNavigation = (direction: 'prev' | 'next') => {
    const currentModule = courseContent.modules[currentModuleIndex];
    if (direction === 'next') {
      if (currentSectionIndex < currentModule.sections.length - 1) {
        // Next section in same module
        setActiveSection(currentModule.sections[currentSectionIndex + 1].id);
      } else if (currentModuleIndex < courseContent.modules.length - 1) {
        // First section of next module
        setActiveSection(courseContent.modules[currentModuleIndex + 1].sections[0].id);
      }
    } else {
      if (currentSectionIndex > 0) {
        // Previous section in same module
        setActiveSection(currentModule.sections[currentSectionIndex - 1].id);
      } else if (currentModuleIndex > 0) {
        // Last section of previous module
        const prevModule = courseContent.modules[currentModuleIndex - 1];
        setActiveSection(prevModule.sections[prevModule.sections.length - 1].id);
      }
    }
  };

  // Handle scroll events only if user is authenticated
  const handleScroll = () => {
    if (!isAuthenticated) return;
    
    if (contentRef.current) {
      const element = contentRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const scrollPosition = element.scrollTop;
      const progress = Math.min((scrollPosition / totalHeight), 1);
      updateScrollProgress(courseId, progress * 100);
    }
  };

  return (
    <>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      {isAuthenticated && (
        <CourseProgressBar>
          <span>Course Progress:</span>
          <ProgressBar>
            <Progress $progress={progress} />
          </ProgressBar>
          <span>{progress.toFixed(1)}%</span>
          <Link to="/progress">View Details</Link>
        </CourseProgressBar>
      )}
      <ContentContainer>
        <PageLayout>
          <SidebarWrapper>
            <Sidebar>
              <SidebarTitle>
                <h2>Mathematics</h2>
              </SidebarTitle>
              <NavList>
                {courseContent.modules.map(module => (
                  <div key={module.id}>
                    <div className="module-title">
                      {module.title}
                    </div>
                    {module.sections.map(section => (
                      <NavItem
                        key={section.id}
                        $active={activeSection === section.id}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.title}
                      </NavItem>
                    ))}
                  </div>
                ))}
              </NavList>
            </Sidebar>
          </SidebarWrapper>
          <MainContent ref={contentRef}>
            {isAuthenticated && (
              <ProgressBar>
                <Progress $progress={sectionProgress} />
              </ProgressBar>
            )}
            {activeSection && courseContent.modules.map(module =>
              module.sections.find(section => section.id === activeSection)?.content
            )}
            <NavigationButtons>
              {(currentModuleIndex > 0 || currentSectionIndex > 0) && (
                <NavButton $direction="prev" onClick={() => handleNavigation('prev')}>
                  ← Previous
                </NavButton>
              )}
              {(currentModuleIndex < courseContent.modules.length - 1 || 
                currentSectionIndex < courseContent.modules[currentModuleIndex].sections.length - 1) && (
                <NavButton $direction="next" onClick={() => handleNavigation('next')}>
                  Next →
                </NavButton>
              )}
            </NavigationButtons>
          </MainContent>
        </PageLayout>
      </ContentContainer>
      <Footer />
    </>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default BasicMathematics; 