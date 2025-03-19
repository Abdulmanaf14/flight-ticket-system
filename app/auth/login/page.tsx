import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-600 to-indigo-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Tally Flights</h1>
          <p className="text-blue-200">Sign in to your account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <AuthForm mode="login" />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Tally Flights?{' '}
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-200 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
} 