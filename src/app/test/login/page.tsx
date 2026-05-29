'use client';

import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const onsubmit = async () => {
    await signInWithEmailAndPassword(email, password);
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Login</h1>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        className="text-xl px-4 py-2 rounded-md border border-gray-300 mb-4"
      />
      <button
        onClick={onsubmit}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Login
      </button>
    </div>
  );
}
