'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function TestAuth() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [error, setError] = useState<string>('');

  const testGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      console.log('Google sign in successful');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <p>Current Auth Status:</p>
        <pre className="bg-gray-100 p-2 rounded">
          {user ? `Logged in as: ${user.email}` : 'Not logged in'}
        </pre>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={testGoogleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Google Sign In
        </button>
        
        {user && (
          <button
            onClick={logout}
            className="block bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
} 