import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { FaSquareRootAlt, FaCode, FaHtml5, FaJs } from 'react-icons/fa';

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
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #1f2937;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const SubjectSection = styled.div`
  margin-bottom: 60px;
`;

const SubjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const SubjectTitle = styled.h2`
  font-size: 32px;
  color: #1f2937;
`;

const SubjectIcon = styled.div`
  font-size: 32px;
  color: #6c63ff;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const CourseCard = styled(Link)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const DifficultyBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
  background: ${props => {
    switch (props.$level) {
      case 'Beginner':
        return '#E8F5E9';
      case 'Intermediate':
        return '#FFF3E0';
      case 'Advanced':
        return '#FCE4EC';
      default:
        return '#E8F5E9';
    }
  }};
  color: ${props => {
    switch (props.$level) {
      case 'Beginner':
        return '#2E7D32';
      case 'Intermediate':
        return '#EF6C00';
      case 'Advanced':
        return '#C2185B';
      default:
        return '#2E7D32';
    }
  }};
`;

const CourseTitle = styled.h3`
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 8px;
`;

const CourseDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const CoursesPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const courses = {
    mathematics: [
      {
        id: 'math-beg',
        title: 'Basic Mathematics',
        description: 'Learn fundamental mathematical concepts including arithmetic, algebra, and geometry.',
        level: 'Beginner',
        path: '/courses/mathematics/beginner'
      },
      {
        id: 'math-int',
        title: 'Intermediate Mathematics',
        description: 'Explore trigonometry, calculus, and probability concepts.',
        level: 'Intermediate',
        path: '/courses/mathematics/intermediate'
      },
      {
        id: 'math-adv',
        title: 'Advanced Mathematics',
        description: 'Master complex mathematical topics including differential equations and linear algebra.',
        level: 'Advanced',
        path: '/courses/mathematics/advanced'
      }
    ],
    python: [
      {
        id: 'py-beg',
        title: 'Python Fundamentals',
        description: 'Start your programming journey with Python basics and core concepts.',
        level: 'Beginner',
        path: '/courses/python/beginner'
      },
      {
        id: 'py-int',
        title: 'Python Applications',
        description: 'Build real-world applications and learn advanced Python features.',
        level: 'Intermediate',
        path: '/courses/python/intermediate'
      },
      {
        id: 'py-adv',
        title: 'Python Mastery',
        description: 'Deep dive into advanced Python concepts, design patterns, and optimization.',
        level: 'Advanced',
        path: '/courses/python/advanced'
      }
    ],
    webdev: [
      {
        id: 'html-beg',
        title: 'HTML & CSS Basics',
        description: 'Learn the fundamentals of web development with HTML and CSS.',
        level: 'Beginner',
        path: '/courses/html/beginner'
      },
      {
        id: 'js-beg',
        title: 'JavaScript Essentials',
        description: 'Master the basics of JavaScript programming.',
        level: 'Beginner',
        path: '/courses/javascript/beginner'
      },
      {
        id: 'js-int',
        title: 'Advanced JavaScript',
        description: 'Learn advanced JavaScript concepts and modern ES6+ features.',
        level: 'Intermediate',
        path: '/courses/javascript/intermediate'
      }
    ]
  };

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
            <Title>Our Courses</Title>
            <Subtitle>
              Explore our comprehensive collection of courses designed to take you from beginner to expert
            </Subtitle>
          </Header>

          <SubjectSection>
            <SubjectHeader>
              <SubjectIcon>
                <FaSquareRootAlt />
              </SubjectIcon>
              <SubjectTitle>Mathematics</SubjectTitle>
            </SubjectHeader>
            <CourseGrid>
              {courses.mathematics.map(course => (
                <CourseCard key={course.id} to={course.path}>
                  <DifficultyBadge $level={course.level}>
                    {course.level}
                  </DifficultyBadge>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                </CourseCard>
              ))}
            </CourseGrid>
          </SubjectSection>

          <SubjectSection>
            <SubjectHeader>
              <SubjectIcon>
                <FaCode />
              </SubjectIcon>
              <SubjectTitle>Python Programming</SubjectTitle>
            </SubjectHeader>
            <CourseGrid>
              {courses.python.map(course => (
                <CourseCard key={course.id} to={course.path}>
                  <DifficultyBadge $level={course.level}>
                    {course.level}
                  </DifficultyBadge>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                </CourseCard>
              ))}
            </CourseGrid>
          </SubjectSection>

          <SubjectSection>
            <SubjectHeader>
              <SubjectIcon>
                <FaHtml5 style={{ marginRight: '8px' }} />
                <FaJs />
              </SubjectIcon>
              <SubjectTitle>Web Development</SubjectTitle>
            </SubjectHeader>
            <CourseGrid>
              {courses.webdev.map(course => (
                <CourseCard key={course.id} to={course.path}>
                  <DifficultyBadge $level={course.level}>
                    {course.level}
                  </DifficultyBadge>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                </CourseCard>
              ))}
            </CourseGrid>
          </SubjectSection>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default CoursesPage; 