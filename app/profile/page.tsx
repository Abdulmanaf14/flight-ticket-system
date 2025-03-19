'use client';

import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl text-white font-medium">
                  {user.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-blue-200 mt-1">{user.email}</p>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    disabled
                    value={user.email || ''}
                    className="w-full px-3 py-2 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-blue-200 mb-1">User ID</label>
                  <input
                    type="text"
                    id="userId"
                    disabled
                    value={user.id}
                    className="w-full px-3 py-2 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastLogin" className="block text-sm font-medium text-blue-200 mb-1">Last Login</label>
                  <input
                    type="text"
                    id="lastLogin"
                    disabled
                    value={new Date(user.last_sign_in_at || '').toLocaleString()}
                    className="w-full px-3 py-2 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 border-t border-white/20 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Account Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-white">
                  Receive email notifications for promotions and deals
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="tripReminders"
                  name="tripReminders"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="tripReminders" className="ml-2 block text-sm text-white">
                  Receive trip reminders before departure
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 