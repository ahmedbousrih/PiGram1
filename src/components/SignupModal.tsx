import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import styled from 'styled-components';

interface SignupModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
  }
`;

const Divider = styled.div`
  margin: 1rem 0;
  text-align: center;
  color: #666;
`;

const SocialButton = styled.button`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  width: 100%;
`;

const Footer = styled.div`
  margin-top: 1rem;
  text-align: center;

  button {
    background: none;
    border: none;
    color: #6c63ff;
    cursor: pointer;
  }
`;

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store the token
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      toast.success('Account created successfully!');
      onClose();
      window.location.reload(); // Refresh to update login state
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Store the token
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      toast.success('Account created successfully with Google!');
      onClose();
      window.location.reload(); // Refresh to update login state
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Create Your Account</Title>
        <Form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </SubmitButton>
        </Form>

        <Divider>Or sign up with</Divider>

        <SocialButton onClick={handleGoogleSignUp}>
          Continue with Google
        </SocialButton>

        <Footer>
          <p>Already have an account? <button onClick={onSwitch}>Log in</button></p>
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupModal;
