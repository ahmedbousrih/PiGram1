import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { FaChalkboardTeacher, FaUserGraduate, FaLaptopCode, FaComments } from 'react-icons/fa';
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const ServiceCard = styled(Link)`
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

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: #f0f4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #6c63ff;
  font-size: 24px;
`;

const ServiceTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
`;

const ServiceDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const services = [
  {
    id: 'tutoring',
    title: '1-on-1 Tutoring',
    description: 'Get personalized help from expert tutors in mathematics and programming.',
    icon: <FaChalkboardTeacher />,
    path: '/services/tutoring'
  },
  {
    id: 'mentorship',
    title: 'Mentorship',
    description: 'Long-term guidance to help you achieve your learning goals.',
    icon: <FaUserGraduate />,
    path: '/services/mentorship'
  },
  {
    id: 'projects',
    title: 'Project Help',
    description: 'Get assistance with your programming projects and assignments.',
    icon: <FaLaptopCode />,
    path: '/services/projects'
  },
  {
    id: 'consulting',
    title: 'Consulting',
    description: 'Expert advice on your technical questions and career path.',
    icon: <FaComments />,
    path: '/services/consulting'
  }
];

const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
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
      <Container>
        <Content>
          <h1>Our Services</h1>
          <ServicesGrid>
            {services.map(service => (
              <ServiceCard key={service.id} to={service.path}>
                <IconWrapper>{service.icon}</IconWrapper>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default ServicesPage; 