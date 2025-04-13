import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CourseProgress from '../components/CourseProgress';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { FaSquareRootAlt, FaCode, FaHtml5 } from 'react-icons/fa';

const Container = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 16px;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

interface Lesson {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalLessons: number;
  chapters: Chapter[];
}

interface Progress {
  completed: string[];
}

const courseData: Course[] = [
  {
    id: 'math-beg',
    title: 'Basic Mathematics',
    description: 'Learn fundamental mathematical concepts',
    icon: <FaSquareRootAlt />,
    totalLessons: 10,
    chapters: [
      {
        id: 'math-beg-ch1',
        title: 'Arithmetic',
        lessons: [
          { id: 'math-beg-l1', title: 'Numbers and Counting' },
          { id: 'math-beg-l2', title: 'Addition and Subtraction' }
        ]
      },
      {
        id: 'math-beg-ch2',
        title: 'Basic Algebra',
        lessons: [
          { id: 'math-beg-l3', title: 'Variables' },
          { id: 'math-beg-l4', title: 'Simple Equations' }
        ]
      }
    ]
  },
  // Add more courses with their chapters and lessons...
];

const ProgressDashboard: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { getProgress } = useCourse();
  
  const progressData = courseData.map(course => {
    const progress = getProgress(course.id);
    return {
      course,
      progress: {
        completed: progress?.completed ?? []
      }
    };
  });

  return (
    <>
      <Navbar
        setShowLoginModal={() => {}}
        setShowSignupModal={() => {}}
        isScrolled={false}
        scrollDirection={null}
        isLoggedIn={isLoggedIn}
        onLogout={() => {}}
      />
      <Container>
        <Content>
          <Header>
            <Title>Your Learning Progress</Title>
          </Header>
          <ProgressGrid>
            {progressData.map(({ course, progress }) => (
              <CourseProgress
                key={course.id}
                course={course}
                progress={progress}
              />
            ))}
          </ProgressGrid>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default ProgressDashboard; 