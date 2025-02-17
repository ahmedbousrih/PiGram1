import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import styled from 'styled-components';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc, setDoc } from 'firebase/firestore';

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
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #333;
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 32px;
  color: #1c1d1f;
  font-size: 28px;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e6e6e6;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #6C63FF;
    box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0;
`;

const SocialButton = styled.button<{ $provider: 'google' | 'facebook' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e6e6e6;
  border-radius: 8px;
  background: white;
  color: ${props => props.$provider === 'google' ? '#DB4437' : '#4267B2'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$provider === 'google' ? 'rgba(219, 68, 55, 0.05)' : 'rgba(66, 103, 178, 0.05)'};
    border-color: ${props => props.$provider === 'google' ? '#DB4437' : '#4267B2'};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5b54d6;
  }

  &:active {
    background: #4a43c5;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #666;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e6e6e6;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 15px;

  a {
    color: #6C63FF;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPassword = styled.a`
  color: #6C63FF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  cursor: pointer;
  margin-top: -12px;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitch }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Debug persistence setting
  useEffect(() => {
    console.log('Setting up Firebase persistence...');
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("✅ Persistence set successfully"))
      .catch((error) => console.error("❌ Persistence error:", error));
  }, []);

  // Debug auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Auth state changed:", user ? "User logged in" : "No user");
      if (user) {
        console.log("📝 User details:", {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });
      }
    });
    return () => {
      console.log('Cleaning up auth state listener...');
      unsubscribe();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed: ${name}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Login submission started');
    
    // Validate inputs
    if (!formData.email || !formData.password) {
      console.error('❌ Missing email or password');
      toast.error('Please fill in all fields');
      return;
    }

    console.log('✅ Form validation passed');
    setIsSubmitting(true);
    const loadingToast = toast.loading('Attempting to log in...');

    try {
      console.log('🔑 Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('✅ Firebase auth successful:', userCredential.user.uid);

      // Get user data from Firestore
      console.log('📚 Fetching user data from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      console.log('📄 Firestore user data:', userData);

      if (userData) {
        console.log('🔄 Updating auth context...');
        login({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });

        toast.update(loadingToast, {
          render: 'Logged in successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });

        console.log('✅ Login process completed');
        onClose();
      } else {
        console.error('❌ No user data found in Firestore');
        toast.update(loadingToast, {
          render: 'User data not found',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Failed to login';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }

      toast.update(loadingToast, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      console.log('🏁 Login attempt finished');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🔄 Starting Google Sign In...');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google Sign In successful:', result.user.uid);

      // Get or create user data in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      let userData;

      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('📄 Existing user data found:', userData);
      } else {
        // Create new user document
        userData = {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', result.user.uid), userData);
        console.log('📝 New user data created:', userData);
      }

      login({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
      toast.success('Signed in with Google successfully!');
      onClose();
    } catch (error: any) {
      console.error('❌ Google Sign In error:', error);
      toast.error('Error signing in with Google');
    }
  };

  return (
    <ModalOverlay onClick={(e) => {
      console.log('Modal overlay clicked');
      if (e.target === e.currentTarget) onClose();
    }}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Welcome Back</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          <LoginButton 
            type="submit"
            disabled={isSubmitting}
          >
            Continue with email
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <SocialButtons>
          <SocialButton 
            type="button"
            $provider="google" 
            onClick={handleGoogleSignIn}
          >
            <FaGoogle /> Continue with Google
          </SocialButton>
          <SocialButton 
            type="button"
            $provider="facebook"
            onClick={() => toast.info('Facebook login coming soon')}
          >
            <FaFacebook /> Continue with Facebook
          </SocialButton>
        </SocialButtons>

        <Footer>
          Don't have an account? <a onClick={onSwitch}>Sign up</a>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
