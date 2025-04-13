import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import SubjectPage from './Pages/SubjectPage';
import ProgressDashboard from './Pages/ProgressDashboard';

// Add icons to library
library.add(faSun, faMoon);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CourseProvider>
          <SearchProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:subjectId" element={<SubjectPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/progress" element={<ProgressDashboard />} />
              </Routes>
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
            </BrowserRouter>
          </SearchProvider>
        </CourseProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 