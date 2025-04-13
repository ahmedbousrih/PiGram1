import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { FaSquareRootAlt, FaCode, FaHtml5 } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Container = styled.div`
  // Add your styles here
`;

const Content = styled.div`
  // Add your styles here
`;

const Header = styled.div`
  // Add your styles here
`;

const SubjectIcon = styled.div`
  // Add your styles here
`;

const Title = styled.h1`
  // Add your styles here
`;

const Subtitle = styled.p`
  // Add your styles here
`;

const LevelsGrid = styled.div`
  // Add your styles here
`;

const CourseCard = styled(Link)`
  // Add your styles here
`;

const DifficultyBadge = styled.span<{ $level: string }>`
  // Add your styles here
`;

const CourseTitle = styled.h2`
  // Add your styles here
`;

const CourseDescription = styled.p`
  // Add your styles here
`;

const TopicsList = styled.ul`
  // Add your styles here
`;

const TopicItem = styled.li`
  // Add your styles here
`;

const Duration = styled.p`
  // Add your styles here
`;

interface Level {
  id: string;
  title: string;
  description: string;
  topics: string[];
  level: string;
  duration: string;
}

interface Subject {
  title: string;
  description: string;
  icon: React.ReactNode;
  levels: Level[];
}

const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { isLoggedIn } = useAuth();

  const subjectData: Record<string, Subject> = {
    mathematics: {
      title: 'Mathematics Courses',
      description: 'Master mathematics from basic arithmetic to advanced calculus',
      icon: <FaSquareRootAlt />,
      levels: [
        {
          id: 'math-beg',
          title: 'Basic Mathematics',
          description: 'Learn fundamental mathematical concepts including arithmetic, algebra, and geometry.',
          topics: ['Arithmetic', 'Basic Algebra', 'Geometry Fundamentals'],
          level: 'Beginner',
          duration: '8 weeks'
        },
        {
          id: 'math-int',
          title: 'Intermediate Mathematics',
          description: 'Explore trigonometry, calculus, and probability concepts.',
          topics: ['Trigonometry', 'Pre-Calculus', 'Probability'],
          level: 'Intermediate',
          duration: '10 weeks'
        },
        {
          id: 'math-adv',
          title: 'Advanced Mathematics',
          description: 'Master complex mathematical topics including differential equations and linear algebra.',
          topics: ['Calculus', 'Linear Algebra', 'Differential Equations'],
          level: 'Advanced',
          duration: '12 weeks'
        }
      ]
    },
    python: {
      title: 'Python Programming',
      description: 'Learn Python from basics to advanced concepts',
      icon: <FaCode />,
      levels: [
        {
          id: 'py-beg',
          title: 'Python Basics',
          description: 'Learn fundamental Python programming concepts.',
          topics: ['Variables', 'Control Flow', 'Functions', 'Basic Data Structures'],
          level: 'Beginner',
          duration: '8 weeks'
        },
        {
          id: 'py-int',
          title: 'Intermediate Python',
          description: 'Explore advanced Python features and applications.',
          topics: ['OOP', 'File Handling', 'Error Handling', 'Modules'],
          level: 'Intermediate',
          duration: '10 weeks'
        },
        {
          id: 'py-adv',
          title: 'Advanced Python',
          description: 'Master advanced Python concepts and frameworks.',
          topics: ['Web Frameworks', 'Data Science', 'Testing', 'Design Patterns'],
          level: 'Advanced',
          duration: '12 weeks'
        }
      ]
    },
    webdev: {
      title: 'Web Development',
      description: 'Master modern web development technologies',
      icon: <FaHtml5 />,
      levels: [
        {
          id: 'web-beg',
          title: 'HTML & CSS Basics',
          description: 'Learn the fundamentals of web development.',
          topics: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox'],
          level: 'Beginner',
          duration: '8 weeks'
        },
        {
          id: 'web-int',
          title: 'JavaScript Essentials',
          description: 'Learn modern JavaScript programming.',
          topics: ['ES6+', 'DOM Manipulation', 'Async Programming', 'APIs'],
          level: 'Intermediate',
          duration: '10 weeks'
        },
        {
          id: 'web-adv',
          title: 'React Development',
          description: 'Build modern web applications with React.',
          topics: ['React', 'State Management', 'Routing', 'Testing'],
          level: 'Advanced',
          duration: '12 weeks'
        }
      ]
    }
  };

  const subject = subjectData[subjectId as keyof typeof subjectData] || null;

  if (!subject) {
    return <div>Subject not found</div>;
  }

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
            <SubjectIcon>{subject.icon}</SubjectIcon>
            <Title>{subject.title}</Title>
            <Subtitle>{subject.description}</Subtitle>
          </Header>

          <LevelsGrid>
            {subject.levels.map(level => (
              <CourseCard key={level.id} to={`/courses/${subjectId}/${level.id}`}>
                <DifficultyBadge $level={level.level}>
                  {level.level}
                </DifficultyBadge>
                <CourseTitle>{level.title}</CourseTitle>
                <CourseDescription>{level.description}</CourseDescription>
                <TopicsList>
                  {level.topics.map(topic => (
                    <TopicItem key={topic}>{topic}</TopicItem>
                  ))}
                </TopicsList>
                <Duration>{level.duration}</Duration>
              </CourseCard>
            ))}
          </LevelsGrid>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default SubjectPage; 