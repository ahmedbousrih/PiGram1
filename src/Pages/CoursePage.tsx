import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import CodeEditor from '../components/CodeEditor';

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

const CoursePage: React.FC = () => {
  const { subjectId, courseId } = useParams<{ subjectId: string; courseId: string }>();
  const { isLoggedIn } = useAuth();
  const { getProgress, updateProgress } = useCourse();

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
          <h1>Course Content</h1>
          {/* Add your course content here */}
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default CoursePage; 