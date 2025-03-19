export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Sky Voyager</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/flights" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Flights
                </a>
                <a href="/bookings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  My Bookings
                </a>
                <a href="/profile" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Profile
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Available Flights</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Search results for your selected destinations.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {/* Sample flight cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-semibold">New York (JFK) → London (LHR)</div>
                        <div className="text-sm text-gray-500">June {10 + i}, 2024 • 7:30 AM - 9:45 PM</div>
                        <div className="text-sm text-gray-500 mt-1">Flight SV{1000 + i} • Duration: 8h 15m</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">${550 + i * 25}</div>
                        <div className="text-xs text-gray-500">per person</div>
                        <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 