import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';

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
      onLogout(); // This will update the parent component's state
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
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
          {isLoggedIn ? (
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          ) : (
            <>
              <LoginButton onClick={handleLogin}>
                Login
              </LoginButton>
              <SignupButton onClick={handleSignup}>
                Sign up
              </SignupButton>
            </>
          )}
        </AuthButtons>
        <DarkModeToggle 
          onClick={() => setDarkMode(!darkMode)}
        >
          <FontAwesomeIcon icon={darkMode ? 'sun' : 'moon'} />
        </DarkModeToggle>
      </HeaderContent>
    </MainHeader>
  );
};

export default Navbar;
