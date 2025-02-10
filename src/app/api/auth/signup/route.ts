import { NextResponse } from 'next/server';
import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await createUserWithEmailAndPassword(auth, email, password);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.code === 'auth/email-already-in-use' ? 400 : 500 }
    );
  }
}
