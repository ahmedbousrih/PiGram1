import React from 'react';
import Navbar from '../components/navbar';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding-top: 80px; // To account for fixed navbar
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 40px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
`;

const ProfileEmail = styled.p`
  margin: 0;
  color: #666;
`;

const SettingsSection = styled.section`
  margin-top: 32px;

  h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 16px;
  }
`;

const ProfileSettings: React.FC = () => {
  return (
    <>
      <Navbar 
        darkMode={false}
        setDarkMode={() => {}}
        setShowLoginModal={() => {}}
        setShowSignupModal={() => {}}
        isScrolled={false}
        scrollDirection={null}
        isLoggedIn={true}
        onLogout={() => {}}
      />
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeader>
            <ProfileAvatar>
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%236C63FF' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
                alt="Profile"
              />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>John Doe</ProfileName>
              <ProfileEmail>john.doe@example.com</ProfileEmail>
            </ProfileInfo>
          </ProfileHeader>

          <SettingsSection>
            <h2>Account Settings</h2>
            {/* Add your settings forms/controls here */}
          </SettingsSection>

          <SettingsSection>
            <h2>Preferences</h2>
            {/* Add preferences controls here */}
          </SettingsSection>

          <SettingsSection>
            <h2>Privacy</h2>
            {/* Add privacy settings here */}
          </SettingsSection>
        </ProfileCard>
      </ProfileContainer>
    </>
  );
};

export default ProfileSettings; 