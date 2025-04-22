import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage';
import ProfileSettings from './Pages/ProfileSettings';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import About from './Pages/About';
import SearchResultsPage from './Pages/SearchResults';
import { CourseProvider } from './context/CourseContext';
import { SearchProvider } from './context/SearchContext';
import CoursesPage from './Pages/CoursesPage';
import ServicesPage from './Pages/ServicesPage';
import ProgressDashboard from './Pages/ProgressDashboard';
import BasicMathematics from './Pages/CourseContent/BasicMathematics';
import { CourseProgressProvider } from './context/CourseProgressContext';
import { ModalProvider } from './context/ModalContext';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import PythonBasics from './Pages/CourseContent/PythonBasics';

// Add icons to library
library.add(faSun, faMoon);

// Create a new component for the app content
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/mathematics/*" element={<BasicMathematics />} />
        <Route path="/courses/python/*" element={<PythonBasics />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/progress" element={<ProgressDashboard />} />
      </Routes>
    </Router>
  );
};

// Main App component with providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ModalProvider>
          <CourseProvider>
            <CourseProgressProvider>
              <SearchProvider>
                <AppContent />
                <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  limit={1}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  style={{ zIndex: 10000 }}
                  closeButton={true}
                />
                <LoginModal />
                <SignupModal />
              </SearchProvider>
            </CourseProgressProvider>
          </CourseProvider>
        </ModalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 