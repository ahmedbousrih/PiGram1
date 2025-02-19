import React from 'react';
import Navbar from '../components/navbar';
import { useAuth } from '../context/AuthContext';

const TrackProgress: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      <Navbar 
        setShowLoginModal={() => {}}
        setShowSignupModal={() => {}}
        isScrolled={false}
        scrollDirection={null}
        isLoggedIn={isLoggedIn}
        onLogout={logout}
      />
      <div style={{ paddingTop: '80px' }}>
        <h1>Track Progress</h1>
        {/* Add your progress tracking content here */}
      </div>
    </div>
  );
};

export default TrackProgress; 