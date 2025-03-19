import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Sky Voyager</h1>
          <p className="text-blue-200 mb-6">Your journey begins here</p>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-blue-200">
          Sign in to access your bookings and profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-md py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-white/20">
          <AuthForm mode="login" />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-blue-200">
            New to Sky Voyager?{' '}
            <Link href="/auth/signup" className="font-medium text-white hover:text-blue-100">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 