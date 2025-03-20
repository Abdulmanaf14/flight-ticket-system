import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-600 to-indigo-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">THENA Flights</h1>
          <p className="text-blue-200">Create your account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <AuthForm mode="signup" />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
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