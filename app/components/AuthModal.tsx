'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="bg-white/10 backdrop-blur-md py-8 px-6 shadow-xl rounded-lg border border-white/20">
      <div className="mb-6">
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`w-1/2 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
              mode === 'login'
                ? 'bg-white text-blue-700 border-white'
                : 'bg-transparent text-white border-white/30 hover:bg-white/5'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`w-1/2 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
              mode === 'signup'
                ? 'bg-white text-blue-700 border-white'
                : 'bg-transparent text-white border-white/30 hover:bg-white/5'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-white mb-6 text-center">
        {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      <AuthForm mode={mode} />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-200">
          {mode === 'login' 
            ? 'New to Sky Voyager?' 
            : 'Already have an account?'}{' '}
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} 
            className="font-medium text-white hover:text-blue-100"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
} 