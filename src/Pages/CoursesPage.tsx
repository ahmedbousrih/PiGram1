import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { FaSquareRootAlt, FaCode, FaHtml5, FaJs } from 'react-icons/fa';
import { auth } from '../config/firebase';

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

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const SubjectCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const SubjectDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const subjects = [
    {
      id: 'mathematics',
      title: 'Mathematics',
      icon: <FaSquareRootAlt />,
      description: 'Comprehensive mathematics courses from basic to advanced concepts.',
      path: '/courses/mathematics'
    },
    {
      id: 'python',
      title: 'Python Programming',
      icon: <FaCode />,
      description: 'Learn Python programming from fundamentals to advanced applications.',
      path: '/courses/python'
    },
    {
      id: 'webdev',
      title: 'Web Development',
      icon: <><FaHtml5 style={{ marginRight: '8px' }} /><FaJs /></>,
      description: 'Master web development with HTML, CSS, and JavaScript.',
      path: '/courses/webdev'
    }
  ];

  return (
    <>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      <Container>
        <Content>
          <Header>
            <Title>Our Courses</Title>
            <Subtitle>
              Explore our comprehensive collection of courses designed to take you from beginner to expert
            </Subtitle>
          </Header>

          <SubjectsGrid>
            {subjects.map(subject => (
              <SubjectCard key={subject.id} onClick={() => navigate(subject.path)}>
                <SubjectIcon>{subject.icon}</SubjectIcon>
                <div>
                  <SubjectTitle>{subject.title}</SubjectTitle>
                  <SubjectDescription>{subject.description}</SubjectDescription>
                </div>
              </SubjectCard>
            ))}
          </SubjectsGrid>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default CoursesPage; 