import React, { useState } from 'react';
import { Mail, Key, Lock } from 'lucide-react';
import { auth } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await auth.signup(email, password);
      setMode('verify');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await auth.verifySignup(email, password, otp);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await auth.login(email, password);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Willow API</h2>
          <p className="mt-2 text-gray-600">
            {mode === 'verify' ? 'Verify your email' : mode === 'signup' ? 'Create an account' : 'Sign in to your account'}
          </p>
        </div>

        {mode === 'verify' ? (
          <form onSubmit={handleVerifySignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP Code</label>
              <div className="mt-1 relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Check your email for the OTP code</p>
            </div>
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="w-full text-blue-600 hover:text-blue-800"
            >
              Back
            </button>
          </form>
        ) : (
          <>
            <div className="flex border-b">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 ${mode === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 ${mode === 'signup' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}