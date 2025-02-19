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
import TrackProgress from './Pages/TrackProgress';
import { ThemeProvider } from './context/ThemeContext';
import About from './Pages/About';
import SearchResultsPage from './Pages/SearchResults';

// Add icons to library
library.add(faSun, faMoon);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/track-progress" element={<TrackProgress />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResultsPage />} />
            {/* Add other routes here */}
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
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 