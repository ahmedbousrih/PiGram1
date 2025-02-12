import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGraduationCap, faTasks, faChartLine } from '@fortawesome/free-solid-svg-icons';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import CourseSection from '../components/CourseSection';
import './homePage.css';
import { useScrollEffect } from '../hooks/useScrollEffect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

const HomePage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { isScrolled, scrollDirection } = useScrollEffect();
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample search suggestions
  const sampleSuggestions = [
    'Python Basics', 'Calculus', 'Linear Algebra', 'JavaScript',
    'Data Structures', 'Statistics', 'Machine Learning', 'Web Development'
  ];

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (value.length > 0) {
      const filtered = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Typing effect
  useEffect(() => {
    if (!subtitleRef.current) return;

    const text = "Where Mathematics Meets Programming";
    const speed = 50; // Adjust the speed as needed
    const delay = 800; // Initial delay before typing starts

    let index = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    const typeWriter = () => {
      if (index >= text.length) return;

      if (subtitleRef.current) {
        subtitleRef.current.textContent += text.charAt(index);
      }
      index++;
      timeoutId = setTimeout(typeWriter, speed);
    };

    if (subtitleRef.current) {
      subtitleRef.current.textContent = '';
    }
    timeoutId = setTimeout(typeWriter, delay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [subtitleRef]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.topic-card, .feature-card, section').forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Update body class when dark mode changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Add this effect to check login status on component mount
  useEffect(() => {
    // Check if user is logged in
    // For example, check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitch }) => {
    return (
      <div className="auth-modal">
        <div className="auth-container">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2 className="auth-title">Log in to continue your learning journey</h2>
          <div className="auth-form">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="submit-btn">Continue with email</button>
          </div>
          <div className="divider">Other log in options</div>
          <div className="social-buttons">
            <button className="social-btn google">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFC107' d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'/%3E%3C/svg%3E" alt="Google" />
              Continue with Google
            </button>
            <button className="social-btn facebook">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='white' d='M25.638 48H14V24h-4v-8.073h4v-4.745C14 4.83 16.415 0 24.796 0h6.976v8.073h-4.36c-3.264 0-3.475 1.222-3.475 3.5V15.927h7.926L30.996 24h-5.358v24z'/%3E%3C/svg%3E" alt="Facebook" />
              Facebook
            </button>
            <button className="social-btn apple">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='white' d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z'/%3E%3C/svg%3E" alt="Apple" />
              Continue with Apple
            </button>
          </div>
          <div className="auth-footer">
            <span>Don't have an account? <a href="#" onClick={onSwitch}>Sign up</a></span>
            <a href="#" className="org-link">Log in with your organization</a>
          </div>
        </div>
      </div>
    );
  };

  const handleSignup = async (userData: any) => {
    try {
      // Your signup logic here
      console.log('Signing up user:', userData);
      setIsLoggedIn(true);
      setShowSignupModal(false);
      toast.success('Signed up successfully!');
    } catch (error: any) {
      toast.error('Error signing up: ' + error.message);
    }
  };

  return (
    <div className={`home-page ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
      />

      {!isLoggedIn && (
        <div className="auth-buttons">
          <button onClick={() => setShowLoginModal(true)}>Login</button>
          <button onClick={() => setShowSignupModal(true)}>Sign Up</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="wave-background">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`wave wave${num}`} />
          ))}
        </div>

        <div className="floating-math">
          {['∫', '∑', 'π', '√', '∞', 'λ', 'θ', 'def', '{}', 'for', '</>', '∂', '±', 'class', '∈']
            .map((symbol, index) => (
              <span
                key={index}
                className={symbol.length > 1 ? 'code-element' : 'math-element'}
                style={{
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {symbol}
              </span>
            ))} 
        </div>

        <h1 className="main-title">
          Welcome to <span className="highlight">Pigram</span>
        </h1>
        <p ref={subtitleRef} className="subtitle"></p>

        <div className="search-container">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchInput}
            placeholder="Search topics (e.g., Calculus, Python, Algorithms...)"
            className="search-input"
          />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>

          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchValue(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hero-buttons">
          <Link to="#start" className="cta-button primary">
            Start Your Learning Journey →
          </Link>
          <Link to="#explore" className="cta-button secondary">
            Explore Topics
          </Link>
        </div>
      </div>

      <div className="courses-container">
        <CourseSection
          title="HTML"
          subtitle="The language for building web pages"
          language="html"
          theme="light"
          code={`<!DOCTYPE html>
<html>
  <head>
    <title>HTML Tutorial</title>
  </head>
  <body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`}
        />

        <CourseSection
          title="JavaScript"
          subtitle="The language for programming web pages"
          language="javascript"
          theme="dark"
          code={`function myFunction() {
  let x = document.getElementById("demo");
  x.style.fontSize = "25px";
  x.style.color = "red";
}`}
        />

        <CourseSection
          title="Python"
          subtitle="A popular programming language"
          language="python"
          theme="light"
          code={`def calculate_sum(numbers):
  total = 0
  for num in numbers:
    if num > 0:
      total += num
  return total

numbers = [1, -2, 3, 4, -5]
result = calculate_sum(numbers)
print(f"Sum of positive numbers: {result}")`}
        />
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Pigram?</h2>
        <div className="features-grid">
          {[ 
            {
              icon: faGraduationCap,
              title: 'Expert-Led Content',
              description: 'Learn from experienced educators and industry professionals',
            },
            {
              icon: faTasks,
              title: 'Interactive Learning',
              description: 'Practice with hands-on exercises and real-world projects',
            },
            {
              icon: faChartLine,
              title: 'Track Progress',
              description: 'Monitor your learning journey with detailed analytics',
            },
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <FontAwesomeIcon icon={feature.icon} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSwitch={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }} 
        />
      )}

      {showSignupModal && (
        <SignupModal 
          onClose={() => setShowSignupModal(false)} 
          onSwitch={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }} 
          onSignup={handleSignup}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default HomePage;
