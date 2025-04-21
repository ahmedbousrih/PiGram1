import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './about.css';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

const About: React.FC = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const mathElements = ['∫', '∑', 'π', '√', '∞', 'λ', 'θ', '∂', '±', '∈'];
  const codeElements = ['def', '{}', 'for', '</>', 'class'];

  return (
    <div>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />

      <div className="about-container">
        <div className="floating-math">
          {mathElements.map((element, index) => (
            <span key={index} className="math-element">{element}</span>
          ))}
          {codeElements.map((element, index) => (
            <span key={index} className="code-element">{element}</span>
          ))}
        </div>

        <div className="header">
          <h1>About Us</h1>
          <p>Learn more about our company and team</p>
        </div>

        <div className="content">
          <div className="row">
            <div className="column">
              <h2>Our Story</h2>
              <p>We are senior year graduates with a vision to create a platform accessible to everyone, enhancing skills in Python and math.</p>
            </div>
            <div className="column">
              <h2>Our Mission</h2>
              <p>Our mission is to make learning accessible and engaging, helping individuals improve their skills effectively.</p>
            </div>
          </div>

          <h2 className="team-title">Our Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <h3>Ahmed Riyadh Bousrih</h3>
              <p className="role">CEO & Founder</p>
              <p className="description">Passionate about education technology and making learning accessible to everyone.</p>
            </div>
            <div className="team-card">
              <h3>Eesa Khalid Al-Bulushi</h3>
              <p className="role">CEO & Founder</p>
              <p className="description">Expert in curriculum development with a focus on interactive learning experiences.</p>
            </div>
            <div className="team-card">
              <h3>Ameen Melki</h3>
              <p className="role">CEO & Founder</p>
              <p className="description">Specialized in creating engaging educational content and learning methodologies.</p>
            </div>
            <div className="team-card">
              <h3>Ali Jawad Habash</h3>
              <p className="role">CTO & Co-Founder</p>
              <p className="description">Technology leader with expertise in building educational platforms and interactive learning tools.</p>
            </div>
            <div className="team-card">
              <h3>Younis Mohammed Salman</h3>
              <p className="role">COO & Co-Founder</p>
              <p className="description">Operations specialist focused on making educational content accessible and engaging for all users.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;