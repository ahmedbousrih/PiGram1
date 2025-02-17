import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import styled from 'styled-components';
import ProfileSettings from '../Pages/ProfileSettings';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '../config/firebase';

interface SignupModalProps {
  onClose: () => void;
  onSwitch: () => void;
  onSignup: (userData: any) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #1c1d1f;
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  width: 100%;
  font-size: 15px;
  transition: background 0.2s;

  &:hover {
    background: #f7f9fa;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 24px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #ddd;
  }

  &::before { left: 0; }
  &::after { right: 0; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #6C63FF;
  }
`;

const SignUpButton = styled.button`
  background: #6C63FF;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5b54d6;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;

  a {
    color: #6C63FF;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #d63031;
  font-size: 14px;
  margin-top: -8px;
`;

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitch, onSignup }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when typing
    if (name === 'password' || name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup form submitted:', formData); // Debug log

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      console.log('User data stored in Firestore:', userCredential.user.uid);

      // Make sure this data matches your User interface
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      console.log('Calling login with:', userData); // Debug log
      login(userData);

      toast.success('Account created successfully!');
      onClose();
    } catch (error: any) {
      // Enhanced error handling
      let errorMessage = 'An error occurred during signup';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please try logging in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          console.error('Signup error:', error);
      }
      
      toast.error(errorMessage);
    }
  };

  // Add Google Sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userData = {
        uid: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email || '',
      };

      onSignup(userData);
      toast.success('Signed in with Google successfully!');
      onClose();
    } catch (error) {
      toast.error('Error signing in with Google');
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Sign Up</Title>

        <SocialButtons>
          <SocialButton type="button" onClick={handleGoogleSignIn}>
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512'%3E%3Cpath fill='%234285f4' d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'/%3E%3C/svg%3E"
              alt="Google"
            />
            Continue with Google
          </SocialButton>
          <SocialButton>
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='%231877f2' d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'/%3E%3C/svg%3E"
              alt="Facebook"
            />
            Continue with Facebook
          </SocialButton>
        </SocialButtons>

        <Divider>OR</Divider>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
          <SignUpButton 
            type="submit"
            disabled={!!errors.password || !!errors.confirmPassword}
          >
            Sign Up
          </SignUpButton>
        </Form>

        <Footer>
          Already have an account? <a onClick={onSwitch}>Log in</a>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;
