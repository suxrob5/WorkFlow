'use client';

import { auth } from '@/firebase';
import Link from 'next/link';
import { SignedIn } from './signed-in';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { SignedOut } from './signed-out';

const Test = () => {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <h1 className="text-4xl font-bold mb-8">Test Page Login</h1>
      <SignedIn>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-500">
              <h2 className="text-2xl font-bold text-green-600 mb-6">
                ✓ Signed In
              </h2>

              {user?.isAnonymous ? (
                <p className="text-lg text-gray-700">(Anonymous User)</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email:
                    </label>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email Verified:
                    </label>
                    <p
                      className={`text-lg font-bold ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {user?.emailVerified
                        ? '✓ Yes (Verified)'
                        : '✗ No (Not Verified)'}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={signOut}
                className="w-full mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="w-full max-w-md mx-auto text-center space-y-4">
          <Link
            href="/test/sign-in"
            className="block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/test/sign-up"
            className="block px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-colors"
          >
            Create Account
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default Test;
