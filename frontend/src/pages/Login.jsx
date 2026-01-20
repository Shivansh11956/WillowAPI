import React, { useState } from 'react';
import { Mail, Key, Lock, Eye, EyeOff, User, ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { auth } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'verify', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      // Add your forgot password API call here
      setMode('reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword.trim()) {
      setError('OTP and new password are required');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      // Add your reset password API call here
      setMode('login');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(mode) {
      case 'signup': return 'Create Account';
      case 'verify': return 'Verify Email';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch(mode) {
      case 'signup': return 'Get started with your free account';
      case 'verify': return 'Enter the OTP sent to your email';
      case 'forgot': return 'Enter your email to receive a reset code';
      case 'reset': return 'Enter OTP and your new password';
      default: return 'Sign in to your account';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {(mode === 'forgot' || mode === 'reset') && (
          <button 
            onClick={() => setMode('login')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Login
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl mr-3" style={{background: 'linear-gradient(135deg, #E6651A 0%, #D84315 100%)'}}>
              <svg className="w-full h-full p-2" viewBox="0 0 32 32" fill="white">
                <path d="M8 10c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-8l-4 3v-3c-1.1 0-2-.9-2-2V10z"/>
                <circle cx="12" cy="14" r="1.5"/>
                <circle cx="16" cy="14" r="1.5"/>
                <circle cx="20" cy="14" r="1.5"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Willow API
            </h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
            <p className="text-gray-600">{getSubtitle()}</p>
          </div>

          {/* Forms */}
          {mode === 'verify' ? (
            <form onSubmit={handleVerifySignup} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-center text-xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-gray-500 text-xs mt-2 text-center">Check your email for the 6-digit code</p>
              </div>
              
              {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{error}</p></div>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{background: 'linear-gradient(135deg, #E6651A 0%, #D84315 100%)'}}
              >
                {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Verifying...</> : 'Verify & Create Account'}
              </button>
              
              <button type="button" onClick={() => setMode('signup')} className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors">
                ← Back to signup
              </button>
            </form>
          ) : mode === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{error}</p></div>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{background: 'linear-gradient(135deg, #E6651A 0%, #D84315 100%)'}}
              >
                {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Sending...</> : 'Send Reset Code'}
              </button>
            </form>
          ) : mode === 'reset' ? (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-center text-xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              
              {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{error}</p></div>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{background: 'linear-gradient(135deg, #E6651A 0%, #D84315 100%)'}}
              >
                {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Resetting...</> : 'Reset Password'}
              </button>
            </form>
          ) : (
            <>
              {/* Tab Navigation */}
              {(mode === 'login' || mode === 'signup') && (
                <div className="flex bg-gray-50 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm ${
                      mode === 'login'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm ${
                      mode === 'signup'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-orange-600 hover:text-orange-700 text-sm transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
                
                {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{error}</p></div>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{background: 'linear-gradient(135deg, #E6651A 0%, #D84315 100%)'}}
                >
                  {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Loading...</> : (mode === 'login' ? 'Sign in' : 'Send OTP')}
                </button>
              </form>
              
              {mode === 'login' && (
                <p className="text-center mt-5 text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button onClick={() => setMode('signup')} className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                    Create account
                  </button>
                </p>
              )}
              
              {mode === 'signup' && (
                <p className="text-center mt-5 text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button onClick={() => setMode('login')} className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                    Sign in
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            AI-powered content moderation with multi-provider fallback
          </p>
        </div>
      </div>
    </div>
  );
}