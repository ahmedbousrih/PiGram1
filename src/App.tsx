import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage';
import ProfileSettings from './components/ProfileSettings';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfileSettings />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 