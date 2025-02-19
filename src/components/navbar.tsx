import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaCog, FaSignOutAlt, FaUserCircle, FaChartLine, FaQuestionCircle, FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';

// Add styled components for the navbar
const MainHeader = styled.header<{ $isScrolled: boolean, $scrollDirection: string | null }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white'};
  box-shadow: ${props => props.$isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  padding: 8px 24px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #5b54d6;
  }
`;

const SignupButton = styled.button`
  padding: 8px 24px;
  background: white;
  color: #6c63ff;
  border: 1px solid #6c63ff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #f5f7ff;
  }
`;

const LogoutButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;

  &:hover {
    background: #e63939;
  }
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover ${ProfileDropdown} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
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
  font-size: 18px;
  text-transform: uppercase;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const ProfileInfo = styled.div`
  margin-left: 12px;
`;

const ProfileName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const ProfileEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: #6c63ff;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  
  svg {
    margin-right: 12px;
    font-size: 18px;
  }
  
  &:hover {
    background: #fff1f1;
  }
`;

const NavbarContainer = styled.nav<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--nav-bg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 2rem;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    color: #6c63ff;
  }
`;

const NavItem = styled.div`
  position: relative;
  
  &:hover > div {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const NavLink = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #6c63ff;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  width: 200px;
  transition: all 0.3s;
  
  &:focus {
    width: 300px;
    border-color: #6c63ff;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  
  &:hover {
    color: #6c63ff;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #6c63ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
`;

const LoadingAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #6c63ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  opacity: 0.8;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  isLoggedIn: parentIsLoggedIn,
  onLogout
}) => {
  const { user, isLoggedIn: authIsLoggedIn, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const effectiveIsLoggedIn = isLoading ? false : authIsLoggedIn;

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
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile settings page
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <NavbarContainer $isScrolled={isScrolled}>
      <NavContent>
        <LeftSection>
          <Logo to="/">
            <span>π</span>gram
          </Logo>

          <NavLinks>
            <NavItem>
              <NavLink>Courses</NavLink>
              <Dropdown>
                <DropdownItem to="/courses/mathematics">Mathematics</DropdownItem>
                <DropdownItem to="/courses/programming">Programming</DropdownItem>
                <DropdownItem to="/courses/data-science">Data Science</DropdownItem>
                <DropdownItem to="/courses/machine-learning">Machine Learning</DropdownItem>
              </Dropdown>
            </NavItem>

            <NavItem>
              <NavLink>Services</NavLink>
              <Dropdown>
                <DropdownItem to="/services/tutoring">1-on-1 Tutoring</DropdownItem>
                <DropdownItem to="/services/mentorship">Mentorship</DropdownItem>
                <DropdownItem to="/services/projects">Project Help</DropdownItem>
                <DropdownItem to="/services/consulting">Consulting</DropdownItem>
              </Dropdown>
            </NavItem>

            <NavItem>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NavLink>About</NavLink>
              </Link>
            </NavItem>

            <form onSubmit={handleSearch}>
              <SearchContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
            </form>
          </NavLinks>
        </LeftSection>

        <RightSection>
          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>

          {isLoading ? (
            <LoadingAvatar>
              <LoadingSpinner />
            </LoadingAvatar>
          ) : effectiveIsLoggedIn && user ? (
            <ProfileContainer>
              <UserAvatar>
                {getInitials(user.firstName, user.lastName)}
              </UserAvatar>
              <ProfileDropdown>
                <ProfileDetails>
                  <ProfileImage>
                    {getInitials(user.firstName, user.lastName)}
                  </ProfileImage>
                  <div>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <p>{user.email}</p>
                  </div>
                </ProfileDetails>
                <DropdownItem to="/profile-settings">
                  <FaUserCircle /> Profile Settings
                </DropdownItem>
                <DropdownItem to="/edit-profile">
                  <FaCog /> Edit Profile
                </DropdownItem>
                <DropdownItem to="/track-progress">
                  <FaChartLine /> Track My Progress
                </DropdownItem>
                <DropdownItem to="/help-support">
                  <FaQuestionCircle /> Help and Support
                </DropdownItem>
                <DropdownItem to="/" onClick={handleLogout}>
                  <FaSignOutAlt /> Log Out
                </DropdownItem>
              </ProfileDropdown>
            </ProfileContainer>
          ) : (
            <AuthButtons>
              <LoginButton onClick={() => setShowLoginModal(true)}>
                Login
              </LoginButton>
              <SignupButton onClick={() => setShowSignupModal(true)}>
                Sign up
              </SignupButton>
            </AuthButtons>
          )}
        </RightSection>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
