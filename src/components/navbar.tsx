import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  return (
    <header className={`main-header ${isScrolled ? `scroll-${scrollDirection}` : ''}`}>
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="pi">π</span>gram
        </Link>
        <nav className="nav-links">
          <Link to="/mathematics">Mathematics</Link>
          <Link to="/programming">Programming</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                Login
              </button>
              <button className="signup-btn" onClick={() => setShowSignupModal(true)}>
                Sign up
              </button>
            </>
          )}
        </div>
        <button 
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          <FontAwesomeIcon icon={darkMode ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
