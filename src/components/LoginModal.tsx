import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

interface LoginModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

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

const Input = styled.input`
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

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const toastId = toast.loading('Logging in...', { toastId: 'login' });
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData) {
        login({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });

        toast.update(toastId, {
          render: 'Logged in successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });

        setTimeout(onClose, 1000);
      }
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

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    const toastId = toast.loading('Connecting...', { toastId: `login-${provider}` });
    
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

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData) {
        login({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });

        toast.update(toastId, {
          render: 'Logged in successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        
        setTimeout(onClose, 1000);
      } else {
        // If user doesn't exist in Firestore, create a new document
        const newUserData = {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          createdAt: new Date().toISOString(),
          provider: provider,
          photoURL: user.photoURL || '',
        };

        await setDoc(doc(db, 'users', user.uid), newUserData);
        
        login({
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          email: newUserData.email,
        });

        toast.update(toastId, {
          render: 'Account created and logged in successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        
        setTimeout(onClose, 1000);
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Welcome Back</Title>
        
        <StyledForm onSubmit={handleEmailLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Continue with email'}
          </SubmitButton>
        </StyledForm>

        <Divider><span>or continue with</span></Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SocialButton 
            type="button"
            $provider="google"
            onClick={() => handleSocialLogin('google')}
          >
            <FaGoogle /> Continue with Google
          </SocialButton>
          
          <SocialButton 
            type="button"
            $provider="facebook"
            onClick={() => handleSocialLogin('facebook')}
          >
            <FaFacebook /> Continue with Facebook
          </SocialButton>
          
          <SocialButton 
            type="button"
            $provider="apple"
            onClick={() => handleSocialLogin('apple')}
          >
            <FaApple /> Continue with Apple
          </SocialButton>
        </div>

        <Footer>
          Don't have an account? <a onClick={onSwitch}>Sign up</a>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
