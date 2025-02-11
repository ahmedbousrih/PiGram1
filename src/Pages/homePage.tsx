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

  const handleLogout = () => {
    // Add your logout logic here
    // For example:
    // - Clear local storage/session storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // - Reset any user-related state
    setIsLoggedIn(false);
    // - Show a success message
    toast.success('Logged out successfully');
  };

  // Add this effect to check login status on component mount
  useEffect(() => {
    // Check if user is logged in
    // For example, check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
        onLogout={handleLogout}
      />

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

      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onSwitch={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }} />
      )}

      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} onSwitch={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }} />
      )}

      <ToastContainer />
    </div>
  );
};

export default HomePage;
