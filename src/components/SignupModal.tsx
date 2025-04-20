import React, { useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 24px;
  color: #333;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  input {
    width: 50%;  // Make each input take up equal space
  }
`;

const Input = styled.input`
  width: 100%;  // Make inputs fill their container
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #6c63ff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
`;

const SubmitButton = styled(Button)`
  background: #6c63ff;
  color: white;
  
  &:hover {
    background: #5b54d6;
  }
  
  &:disabled {
    background: #9995ff;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #666;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  span {
    padding: 0 10px;
    font-size: 14px;
  }
`;

const SocialButton = styled(Button)<{ $provider: string }>`
  background: ${props => 
    props.$provider === 'google' ? 'white' : 
    props.$provider === 'facebook' ? '#1877f2' : 
    props.$provider === 'apple' ? '#000' : 'white'};
  color: ${props => props.$provider === 'google' ? '#333' : 'white'};
  border: ${props => props.$provider === 'google' ? '1px solid #ddd' : 'none'};
  
  &:hover {
    background: ${props => 
      props.$provider === 'google' ? '#f5f5f5' : 
      props.$provider === 'facebook' ? '#1664d9' : 
      props.$provider === 'apple' ? '#1a1a1a' : '#f5f5f5'};
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 14px;
  color: #666;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupModal: React.FC = () => {
  const { showSignupModal, setShowSignupModal } = useModal();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const toastId = toast.loading('Creating account...', { toastId: 'signup' });
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      login({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });

      toast.update(toastId, {
        render: 'Account created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => setShowSignupModal(false), 1000);
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    const toastId = toast.loading('Connecting...', { toastId: `signup-${provider}` });
    
    try {
      const authProvider = 
        provider === 'google' ? new GoogleAuthProvider() :
        provider === 'facebook' ? new FacebookAuthProvider() :
        null;

      if (!authProvider) {
        toast.update(toastId, {
          render: 'Service not available',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Get user info from Google profile
      const firstName = user.displayName?.split(' ')[0] || '';
      const lastName = user.displayName?.split(' ').slice(1).join(' ') || '';
      const email = user.email || '';

      // Create or update user document in Firestore
      const userData = {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
        provider: provider, // Store the sign-in method
        photoURL: user.photoURL || '',
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // Update auth context
      login({
        firstName,
        lastName,
        email,
      });

      toast.update(toastId, {
        render: 'Account created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      
      setTimeout(() => setShowSignupModal(false), 1000);
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return showSignupModal ? (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowSignupModal(false)}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Create Account</Title>
        
        <StyledForm onSubmit={handleEmailSignup}>
          <InputGroup>
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </InputGroup>
          
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up with email'}
          </SubmitButton>
        </StyledForm>

        <Divider><span>or sign up with</span></Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SocialButton 
            type="button"
            $provider="google"
            onClick={() => handleSocialSignup('google')}
          >
            <FaGoogle /> Continue with Google
          </SocialButton>
          
          <SocialButton 
            type="button"
            $provider="facebook"
            onClick={() => handleSocialSignup('facebook')}
          >
            <FaFacebook /> Continue with Facebook
          </SocialButton>
          
          <SocialButton 
            type="button"
            $provider="apple"
            onClick={() => handleSocialSignup('apple')}
          >
            <FaApple /> Continue with Apple
          </SocialButton>
        </div>

        <Footer>
          Already have an account? <a onClick={() => setShowSignupModal(false)}>Log in</a>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  ) : null;
};

export default SignupModal;
