'use client';

import Link from 'next/link';
import FlightSearchForm from './components/FlightSearchForm';
import AuthModal from './components/AuthModal';
import Navigation from './components/Navigation';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import Image from 'next/image';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [popularDestinations, setPopularDestinations] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  
  // Directly compute authentication state from user object
  const isAuthenticated = !!user;

  useEffect(() => {
    // Log authentication state for debugging
    console.log("HomePage auth state:", isAuthenticated, user?.email);
    
    // If user just authenticated, close the auth modal
    if (user && showAuth) {
      setShowAuth(false);
    }
  }, [user, showAuth, isAuthenticated]);
  
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from('airports')
          .select('code, name, city, country')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setPopularDestinations(data || []);
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  // Handle auth modal toggle
  useEffect(() => {
    const handleToggleAuthModal = () => {
      // Don't show auth modal if user is already authenticated
      if (isAuthenticated) {
        console.log("Toggle auth modal ignored - user already authenticated");
        return;
      }
      
      setShowAuth(prev => !prev);
    };

    window.addEventListener('toggle-auth-modal', handleToggleAuthModal);
    return () => {
      window.removeEventListener('toggle-auth-modal', handleToggleAuthModal);
    };
  }, [isAuthenticated]);

  // Handle escape key to close auth modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAuth(false);
      }
    };

    if (showAuth) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAuth]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showAuth) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Big centered title */}
          <div className="text-center mb-12">
            <h1 className="text-[#4169E1] text-8xl font-bold tracking-wider drop-shadow-md">
              THENA FLIGHTS
            </h1>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {/* Taglines */}
            <div className="grid grid-cols-2 gap-x-48 text-center mb-4">
              <p className="text-gray-700 text-lg">
                A TEAM DEDICATED TO IMPROVING<br />
                AVIATION STANDARDS
              </p>
              <p className="text-gray-700 text-lg">
                WITH OUR MODERN FLEET AND<br />
                WELL-TRAINED CREW
              </p>
            </div>
            
            {/* Airplane image */}
            <div className="relative w-full max-w-5xl mx-auto py-8">
              <img 
                src="/airplane.png"
                alt="Airplane"
                className="w-full h-auto object-contain" 
              />
            </div>

            {/* Flight search form below airplane */}
            <div className="w-full max-w-5xl mx-auto -mt-4 mb-16 relative z-20">
              <div className="text-center mb-6">
                <h2 className="text-[#4169E1] text-3xl md:text-4xl font-bold tracking-wide">
                  Let the Journey Begin
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Discover your next adventure with just a few clicks</p>
              </div>
              <div className="bg-blue-50 rounded-2xl shadow-xl p-8">
                <FlightSearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <div className="relative">
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-200"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <AuthModal />
            </div>
          </div>
        </div>
      )}

      {/* Features Section with lighter colors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-[#4169E1] text-center mb-12">Why Choose THENA Flights</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-[#4169E1] p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Best Price Guarantee</h3>
            <p className="text-gray-600">Find the most competitive prices for your travel needs with our price match promise.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-[#4169E1] p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our dedicated customer service team is always available to assist with any questions.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-[#4169E1] p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Flexible Booking</h3>
            <p className="text-gray-600">Change your travel dates with no hassle and minimal fees with our flexible booking options.</p>
          </div>
        </div>
      </div>

      {/* Popular Destinations with lighter colors */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#4169E1] text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              popularDestinations.map((destination) => (
                <div key={destination.code} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 hover:scale-105 transform">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for destination image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-300/60 to-transparent">
                    <img src="travel.jpeg" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.city}</h3>
                  <p className="text-gray-600 mb-4">Explore the wonders of {destination.city} with our exclusive deals.</p>
                  <Link href={`/flights/search?origin=&destination=${destination.code}`} className="text-[#4169E1] hover:text-blue-800 inline-flex items-center transition duration-150">
                    View Flights 
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer with lighter colors */}
      <footer className="bg-[#4169E1] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">THENA Flights</h3>
              <p className="text-blue-100 text-sm">Your trusted partner for flights worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li><Link href="/flights/search" className="hover:text-white">Flights</Link></li>
                <li><Link href="/destinations" className="hover:text-white">Destinations</Link></li>
                <li><Link href="/deals" className="hover:text-white">Deals</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-blue-100 text-sm mb-2">Subscribe for the latest offers</p>
              <div className="flex mt-2">
                <input type="email" placeholder="Your email" className="px-3 py-2 rounded-l-md w-full text-gray-800 text-sm" />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-300 mt-8 pt-8 text-center text-blue-100 text-sm">
            <p>© {new Date().getFullYear()} THENA Flights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
