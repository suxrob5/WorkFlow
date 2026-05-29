'use client';

import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const onSubmit = async () => {
    await signInWithEmailAndPassword(email, password);
    // await sendEmailVerification();
    router.push('/test');
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />

      <button
        onClick={onSubmit}
        className=" px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Login
      </button>
    </div>
  );
};

export default SignIn;
