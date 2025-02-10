import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  // Add other auth-related methods as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = async (email: string, password: string) => {
    // Implement your login logic here
  };

  const signInWithGoogle = async () => {
    // Implement Google sign-in logic
  };

  const signInWithFacebook = async () => {
    // Implement Facebook sign-in logic
  };

  const value = {
    login,
    signInWithGoogle,
    signInWithFacebook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 