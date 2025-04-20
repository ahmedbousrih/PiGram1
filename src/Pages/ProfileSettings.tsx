import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 40px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
`;

const SidebarItem = styled.div`
  padding: 10px 0;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #6c63ff;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #6c63ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #5b54d6;
  }
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 20px;
`;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

const EmailText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    color: #5b54d6;
  }
`;

const ProfileSettings: React.FC = () => {
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
    <div>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      <Container>
        <ContentWrapper>
          <Sidebar>
            <ProfileImage>{user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : ''}</ProfileImage>
            <strong>{user ? `${user.firstName} ${user.lastName}` : ''}</strong>
            <SidebarItem>View public profile</SidebarItem>
            <SidebarItem>Profile</SidebarItem>
            <SidebarItem>Photo</SidebarItem>
            <SidebarItem>Account Security</SidebarItem>
            <SidebarItem>Subscriptions</SidebarItem>
            <SidebarItem>Payment methods</SidebarItem>
            <SidebarItem>Privacy</SidebarItem>
            <SidebarItem>Notification Preferences</SidebarItem>
            <SidebarItem>API clients</SidebarItem>
            <SidebarItem onClick={handleLogout}>Log out</SidebarItem>
          </Sidebar>
          <MainContent>
            <Section>
              <SectionTitle>Account</SectionTitle>
              <p>Edit your account settings and change your password here.</p>
            </Section>
            <Section>
              <SectionTitle>Email:</SectionTitle>
              <EmailContainer>
                <EmailText>Your email address is: <strong>{user?.email}</strong></EmailText>
                <EditButton>✎</EditButton>
              </EmailContainer>
            </Section>
            <Section>
              <SectionTitle>Password:</SectionTitle>
              <Input type="password" placeholder="Enter current password" />
              <Input type="password" placeholder="Enter new password" />
              <Input type="password" placeholder="Re-type new password" />
              <Button>Change password</Button>
            </Section>
          </MainContent>
        </ContentWrapper>
      </Container>
      <Footer />
    </div>
  );
};

export default ProfileSettings; 