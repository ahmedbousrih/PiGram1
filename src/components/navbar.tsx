import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Add styled components for the navbar
const MainHeader = styled.header<{ $isScrolled: boolean, $scrollDirection: string | null }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 1rem 2rem;
  transform: translateY(${(props) => 
    props.$isScrolled && props.$scrollDirection === 'down' ? '-100%' : '0'
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

// Add new styled component for profile button
const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6c63ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  padding: 8px 0;
  z-index: 1000;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;

const ProfileAvatar = styled(UserAvatar)`
  margin-right: 12px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.span`
  font-weight: 500;
  color: #333;
`;

const ProfileEmail = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  color: #ff4444;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #f5f5f5;
  }
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface NavbarProps {
  setShowLoginModal: (value: boolean) => void;
  setShowSignupModal: (value: boolean) => void;
  isScrolled: boolean;
  scrollDirection: string | null;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  setShowLoginModal,
  setShowSignupModal,
  isScrolled,
  scrollDirection,
  isLoggedIn,
  onLogout
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowProfileDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowProfileDropdown(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
      setShowProfileDropdown(false);
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile settings page
  };

  return (
    <MainHeader $isScrolled={isScrolled} $scrollDirection={scrollDirection}>
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
          {user ? (
            <ProfileContainer 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <UserAvatar>
                {user.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : 'U'}
              </UserAvatar>
              {showProfileDropdown && (
                <ProfileDropdown>
                  <ProfileHeader>
                    <ProfileAvatar>
                      {user.firstName && user.lastName 
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : 'U'}
                    </ProfileAvatar>
                    <ProfileInfo>
                      <ProfileName>{`${user.firstName} ${user.lastName}`}</ProfileName>
                      <ProfileEmail>{user.email}</ProfileEmail>
                    </ProfileInfo>
                  </ProfileHeader>
                  <DropdownItem to="/profile">Profile Settings</DropdownItem>
                  <DropdownItem to="/edit-profile">Edit Profile</DropdownItem>
                  <DropdownItem to="/progress">Track My Progress</DropdownItem>
                  <DropdownItem to="/help">Help and Support</DropdownItem>
                  <DropdownButton onClick={handleLogout}>Log Out</DropdownButton>
                </ProfileDropdown>
              )}
            </ProfileContainer>
          ) : (
            <>
              <LoginButton onClick={() => setShowLoginModal(true)}>Login</LoginButton>
              <SignupButton onClick={() => setShowSignupModal(true)}>Sign up</SignupButton>
            </>
          )}
        </AuthButtons>
      </HeaderContent>
    </MainHeader>
  );
};

export default Navbar;
