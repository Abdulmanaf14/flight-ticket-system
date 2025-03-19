'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-auto">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'New to Tally Flights? ' 
              : 'Already have an account?'}{' '}
            {mode === 'login' && (
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                onClick={() => setMode('signup')}
              >
                Create an account
              </button>
            )}
          </p>
        </div>
        
        <AuthForm mode={mode} />
      </div>
    </div>
  );
} 