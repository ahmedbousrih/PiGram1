  "use client";

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '@/config/firebase';

  export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } catch (error: any) {
        setError(error.message);
        console.error('Signup error:', error);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl mb-4">Sign Up</h1>
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
