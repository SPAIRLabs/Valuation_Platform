
'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {showLogin ? <LoginForm /> : <SignupForm />}
        <div className="text-center">
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="text-sm text-primary-600 hover:underline"
          >
            {showLogin ? 'Need an account? Sign up' : 'Have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
