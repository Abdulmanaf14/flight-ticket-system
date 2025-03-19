'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, signOut, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // No need for duplicate state - directly use the user object to determine authentication status
  const isAuthenticated = !!user;

  // Log for debugging
  useEffect(() => {
    console.log("Navigation auth status updated:", isAuthenticated, user?.email);
  }, [user, isAuthenticated]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    // No need to reload - the auth state change will trigger a re-render
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h1 className="ml-2 text-white text-2xl font-bold">Sky Voyager</h1>
            </Link>
          </div>
          
          <div className="flex space-x-4 items-center">
            {isLoading ? (
              // Show loading state
              <div className="text-white text-sm">Loading...</div>
            ) : !isAuthenticated ? (
              // Not logged in - show login/signup button
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth-modal'))}
                className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-md transition duration-150 font-medium"
              >
                Sign In / Sign Up
              </button>
            ) : (
              // Logged in - show user menu
              <>
                <Link 
                  href="/bookings" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition duration-150"
                >
                  My Bookings
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition duration-150 focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-2">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[150px] truncate">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                    <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        {user?.email}
                      </div>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 