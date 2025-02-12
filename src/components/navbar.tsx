import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Add styled components for the navbar
const MainHeader = styled.header<{ isScrolled: boolean, scrollDirection: string | null }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 1rem 2rem;
  transform: translateY(${(props: { isScrolled: boolean; scrollDirection: string | null }) => 
    props.isScrolled && props.scrollDirection === 'down' ? '-100%' : '0'
  });
  transition: transform 0.3s ease;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  color: #000;
`;

const PiSymbol = styled.span`
  color: #6C63FF;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;

  a {
    text-decoration: none;
    color: #000;
    transition: color 0.2s ease;

    &:hover {
      color: #6C63FF;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const LoginButton = styled(Button)`
  background: #6c63ff;
  color: white;
  border: none;

  &:hover {
    background: #5b54d6;
  }
`;

const SignupButton = styled(Button)`
  background: white;
  color: #6c63ff;
  border: 1px solid #6c63ff;

  &:hover {
    background: #f0f0ff;
  }
`;

const LogoutButton = styled(Button)`
  background: #ff4444;
  color: white;
  border: none;

  &:hover {
    background: #e63939;
  }
`;

const DarkModeToggle = styled(Button)`
  background: transparent;
  border: none;
  color: #666;
  padding: 8px;
  
  &:hover {
    color: #6c63ff;
  }
`;

// Add new styled component for profile button
const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #6C63FF;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(108, 99, 255, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileDropdown = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 280px;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;
  margin-top: 8px;
  transition: opacity 0.15s ease, visibility 0.15s ease;
  padding-top: 8px;

  /* Add invisible padding around dropdown to increase hover area */
  &:before {
    content: '';
    position: absolute;
    top: -20px; /* Increase hover area above dropdown */
    left: 0;
    right: 0;
    height: 20px;
  }

  /* Stay visible when hovering over the dropdown itself */
  &:hover {
    opacity: 1;
    visibility: visible;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  
  &:hover ${ProfileDropdown} {
    opacity: 1;
    visibility: visible;
  }
`;

const UserInfo = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #6C63FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: 500;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1c1d1f;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #6a6f73;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #1c1d1f;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #f7f9fa;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #1c1d1f;
  text-align: left;

  &:hover {
    background: #f7f9fa;
  }
`;

// Add a wrapper to increase the hover area around the profile button
const ProfileButtonWrapper = styled.div`
  padding: 8px;
  margin: -8px;
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setShowLoginModal: (value: boolean) => void;
  setShowSignupModal: (value: boolean) => void;
  isScrolled: boolean;
  scrollDirection: string | null;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  setShowLoginModal,
  setShowSignupModal,
  isScrolled,
  scrollDirection,
  isLoggedIn,
  onLogout
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignupModal(true);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile settings page
  };

  return (
    <MainHeader isScrolled={isScrolled} scrollDirection={scrollDirection}>
      <HeaderContent>
        <LogoLink to="/">
          <PiSymbol>π</PiSymbol>gram
        </LogoLink>
        <NavLinks>
          <Link to="/mathematics">Mathematics</Link>
          <Link to="/programming">Programming</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About</Link>
        </NavLinks>
        <AuthButtons>
          {isLoggedIn && user ? (
            <ProfileContainer>
              <ProfileButtonWrapper>
                <ProfileButton>
                  <UserAvatar>
                    {getInitials(user.firstName, user.lastName)}
                  </UserAvatar>
                </ProfileButton>
              </ProfileButtonWrapper>
              <ProfileDropdown>
                <UserInfo>
                  <UserAvatar>
                    {getInitials(user.firstName, user.lastName)}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{`${user.firstName} ${user.lastName}`}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserDetails>
                </UserInfo>
                <DropdownItem to="/profile">Profile Settings</DropdownItem>
                <DropdownItem to="/edit-profile">Edit Profile</DropdownItem>
                <DropdownItem to="/progress">Track My Progress</DropdownItem>
                <DropdownItem to="/help">Help and Support</DropdownItem>
                <DropdownButton onClick={handleLogout}>Log Out</DropdownButton>
              </ProfileDropdown>
            </ProfileContainer>
          ) : (
            <>
              <LoginButton onClick={handleLogin}>Login</LoginButton>
              <SignupButton onClick={handleSignup}>Sign up</SignupButton>
            </>
          )}
          <DarkModeToggle onClick={() => setDarkMode(!darkMode)}>
            <FontAwesomeIcon icon={darkMode ? 'sun' : 'moon'} />
          </DarkModeToggle>
        </AuthButtons>
      </HeaderContent>
    </MainHeader>
  );
};

export default Navbar;
