import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  showLoginModal: boolean;
  showSignupModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <ModalContext.Provider value={{
      showLoginModal,
      showSignupModal,
      setShowLoginModal,
      setShowSignupModal,
      closeAllModals
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 