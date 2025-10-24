import { useState } from 'react';
import { LogIn, AlertCircle, UserPlus } from 'lucide-react';
import { useStore } from '../store';
import { authenticateUser, registerUser } from '../utils/csvHelper';
import { cn } from '../utils/cn';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await authenticateUser(username, password);
      
      if (user) {
        setCurrentUser(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = await registerUser(username, password, fullName);
      
      if (result.success && result.user) {
        setSuccess('Account created successfully! You can now sign in.');
        // Clear form
        setUsername('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
        // Switch to login mode after 2 seconds
        setTimeout(() => {
          setIsSignup(false);
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-600 mb-6 shadow-lg shadow-primary-600/30">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600">
            {isSignup ? 'Sign up to start editing documents' : 'Sign in to access the document editor'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}

            {/* Full Name Field (Signup only) */}
            {isSignup && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 border-slate-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200'
                  )}
                />
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 border-slate-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isSignup ? 'Create a password (min 6 characters)' : 'Enter your password'}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 border-slate-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Confirm Password Field (Signup only) */}
            {isSignup && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 border-slate-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200'
                  )}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200',
                'flex items-center justify-center gap-2',
                loading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/20'
              )}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>

            {/* Toggle between Login and Signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setSuccess('');
                  setUsername('');
                  setPassword('');
                  setFullName('');
                  setConfirmPassword('');
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>

          {/* Demo Credentials (Login mode only) */}
          {!isSignup && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center mb-2">Demo Credentials:</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="text-center font-mono bg-slate-50 p-2 rounded">
                  admin / admin123
                </p>
                <p className="text-center font-mono bg-slate-50 p-2 rounded">
                  valuer1 / password123
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
