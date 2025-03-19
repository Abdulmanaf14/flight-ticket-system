'use client';

import Link from 'next/link';
import FlightSearchForm from './components/FlightSearchForm';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export default function HomePage() {
  const [popularDestinations, setPopularDestinations] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h1 className="ml-2 text-white text-2xl font-bold">Sky Voyager</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-white hover:bg-white/10 px-4 py-2 rounded-md transition duration-150">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-md transition duration-150 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Background image placeholder - in a real app, use a proper next/Image */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
              Your Journey Begins Here
            </h2>
            <p className="mt-6 max-w-md mx-auto text-lg text-blue-100 sm:text-xl md:max-w-3xl drop-shadow-md font-light">
              Book your next adventure with Sky Voyager. Discover amazing destinations and the best deals on flights worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16 relative z-20">
        <FlightSearchForm />
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Sky Voyager</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
            <div className="bg-blue-500 p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Best Price Guarantee</h3>
            <p className="text-blue-100">Find the most competitive prices for your travel needs with our price match promise.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
            <div className="bg-blue-500 p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
            <p className="text-blue-100">Our dedicated customer service team is always available to assist with any questions.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
            <div className="bg-blue-500 p-3 rounded-full w-14 h-14 mb-6 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Flexible Booking</h3>
            <p className="text-blue-100">Change your travel dates with no hassle and minimal fees with our flexible booking options.</p>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white/5 backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white/10 rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              popularDestinations.map((destination) => (
                <div key={destination.code} className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 hover:scale-105 transform border border-white/10">
                  <div className="h-48 bg-gray-300 relative">
                    {/* Placeholder for destination image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{destination.city}</h3>
                    <p className="text-blue-100 mb-4">Explore the wonders of {destination.city} with our exclusive deals.</p>
                    <Link href={`/flights/search?origin=&destination=${destination.code}`} className="text-blue-300 hover:text-white inline-flex items-center transition duration-150">
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

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sky Voyager</h3>
              <p className="text-blue-200 text-sm">Your trusted partner for flights worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link href="/flights/search" className="hover:text-white">Flights</Link></li>
                <li><Link href="/destinations" className="hover:text-white">Destinations</Link></li>
                <li><Link href="/offers" className="hover:text-white">Special Offers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-blue-200 text-sm mb-2">Subscribe for the latest offers</p>
              <div className="flex mt-2">
                <input type="email" placeholder="Your email" className="px-3 py-2 rounded-l-md w-full text-gray-800 text-sm" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300 text-sm">
            <p>© {new Date().getFullYear()} Sky Voyager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
