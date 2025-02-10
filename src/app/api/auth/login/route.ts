import { NextResponse } from 'next/server';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Sign in user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return NextResponse.json({ message: 'User logged in successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' ? 400 : 500 }
    );
  }
}
