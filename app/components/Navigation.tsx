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
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
          <img 
              src="/Thena.webp" 
              alt="THENA Flights Logo"
              className="h-18 w-auto"
            />
          </Link>
        </div>
        
      
        
        <div className="flex items-center">
          {isLoading ? (
            // Show loading state
            <div className="text-gray-700 text-sm">Loading...</div>
          ) : !isAuthenticated ? (
            // Not logged in - show login button
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth-modal'))}
              className="bg-[#4169E1] text-white hover:bg-blue-600 px-8 py-2 rounded-full transition duration-150 font-medium"
            >
              LOGIN
            </button>
          ) : (
            // Logged in - show user menu
            <>
              <Link 
                href="/bookings" 
                className="text-gray-700 hover:text-[#4169E1] px-4 py-2 rounded-md transition duration-150 mr-4"
              >
                My Bookings
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-700 hover:text-[#4169E1] px-3 py-2 rounded-md transition duration-150 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-[#4169E1] rounded-full flex items-center justify-center text-white font-medium mr-2">
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
                  <div className="absolute right-0 mt-2 w-70 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
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
    </nav>
  );
} 