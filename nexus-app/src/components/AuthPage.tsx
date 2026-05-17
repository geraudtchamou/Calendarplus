import { useState, useCallback } from 'react';
import { useAuth } from '../store/AuthContext';
import { Mail, Smartphone, Chrome, Apple, Github, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { FadeTransition, SlideTransition } from './TransitionGroup';

type AuthMode = 'signin' | 'signup' | 'phone-verify' | 'phone-code';
type AuthMethod = 'email' | 'phone' | 'social';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const {
    signUpWithEmail,
    signInWithEmail,
    sendPhoneCode,
    signUpWithPhone,
    signInWithGoogle,
    signInWithApple,
    signInWithGithub,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err) {
      // Error already handled in context
    }
  }, [mode, email, password, name, signInWithEmail, signUpWithEmail, clearError]);

  const handleSendPhoneCode = useCallback(async () => {
    clearError();
    try {
      await sendPhoneCode(phone);
      setMode('phone-code');
    } catch (err) {
      // Error already handled
    }
  }, [phone, sendPhoneCode, clearError]);

  const handlePhoneVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await signUpWithPhone(phone, verificationCode, name);
    } catch (err) {
      // Error already handled
    }
  }, [phone, verificationCode, name, signUpWithPhone, clearError]);

  const handleSocialSignIn = useCallback(async (provider: 'google' | 'apple' | 'github') => {
    clearError();
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'apple') {
        await signInWithApple();
      } else {
        await signInWithGithub();
      }
    } catch (err) {
      // Error already handled
    }
  }, [signInWithGoogle, signInWithApple, signInWithGithub, clearError]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setVerificationCode('');
    clearError();
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <FadeTransition>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg scale-enter">
              <Mail size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Nexus
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your intelligent productivity partner
            </p>
          </div>
        </FadeTransition>

        {/* Main Auth Card */}
        <SlideTransition direction="up">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            {/* Header Tabs */}
            {method === 'email' && mode !== 'phone-verify' && mode !== 'phone-code' && (
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => { resetForm(); setMode('signin'); }}
                  className={`flex-1 py-4 text-sm font-medium transition-all button-press ${
                    mode === 'signin'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { resetForm(); setMode('signup'); }}
                  className={`flex-1 py-4 text-sm font-medium transition-all button-press ${
                    mode === 'signup'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Back Button for Phone Flow */}
            {(mode === 'phone-verify' || mode === 'phone-code') && (
              <button
                onClick={() => { resetForm(); setMode('signin'); setMethod('email'); }}
                className="flex items-center gap-2 px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors button-press"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Error Message */}
              {error && (
                <FadeTransition>
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </FadeTransition>
              )}

              {/* Email Method */}
              {method === 'email' && mode !== 'phone-verify' && mode !== 'phone-code' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <FadeTransition>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </FadeTransition>
                  )}

                  <FadeTransition>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </FadeTransition>

                  <FadeTransition>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </FadeTransition>

                  {mode === 'signin' && (
                    <FadeTransition>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                          Forgot password?
                        </button>
                      </div>
                    </FadeTransition>
                  )}

                  <FadeTransition>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all button-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        mode === 'signin' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </FadeTransition>
                </form>
              )}

              {/* Phone Method - Enter Number */}
              {method === 'phone' && mode === 'phone-verify' && (
                <form className="space-y-4">
                  <FadeTransition>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </FadeTransition>

                  <FadeTransition>
                    <button
                      type="button"
                      onClick={handleSendPhoneCode}
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all button-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  </FadeTransition>
                </form>
              )}

              {/* Phone Method - Enter Code */}
              {method === 'phone' && mode === 'phone-code' && (
                <form onSubmit={handlePhoneVerify} className="space-y-4">
                  <FadeTransition>
                    <div className="text-center">
                      <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We sent a 6-digit code to <strong>{phone}</strong>
                      </p>
                    </div>
                  </FadeTransition>

                  <FadeTransition>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                  </FadeTransition>

                  <FadeTransition>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </FadeTransition>

                  <FadeTransition>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all button-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Create Account'
                      )}
                    </button>
                  </FadeTransition>

                  <FadeTransition>
                    <button
                      type="button"
                      onClick={handleSendPhoneCode}
                      className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Resend Code
                    </button>
                  </FadeTransition>
                </form>
              )}

              {/* Divider */}
              {method === 'email' && mode !== 'phone-verify' && mode !== 'phone-code' && (
                <FadeTransition>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </FadeTransition>
              )}

              {/* Social Login Buttons */}
              {method === 'email' && mode !== 'phone-verify' && mode !== 'phone-code' && (
                <FadeTransition>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={isLoading}
                      className="flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all button-press disabled:opacity-50"
                    >
                      <Chrome size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('apple')}
                      disabled={isLoading}
                      className="flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all button-press disabled:opacity-50"
                    >
                      <Apple size={20} className="text-gray-900 dark:text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('github')}
                      disabled={isLoading}
                      className="flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all button-press disabled:opacity-50"
                    >
                      <Github size={20} className="text-gray-900 dark:text-white" />
                    </button>
                  </div>
                </FadeTransition>
              )}

              {/* Switch Auth Method */}
              <FadeTransition>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method === 'email' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                          {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                      </>
                    ) : (
                      <>
                        Prefer email?{' '}
                        <button
                          onClick={() => { resetForm(); setMethod('email'); setMode('signin'); }}
                          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                          Use email instead
                        </button>
                      </>
                    )}
                  </p>
                  {method === 'email' && (
                    <button
                      onClick={() => { resetForm(); setMethod('phone'); setMode('phone-verify'); }}
                      className="mt-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1 mx-auto"
                    >
                      <Smartphone size={14} />
                      Use phone number instead
                    </button>
                  )}
                </div>
              </FadeTransition>
            </div>
          </div>
        </SlideTransition>

        {/* Footer */}
        <FadeTransition>
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>
          </p>
        </FadeTransition>
      </div>
    </div>
  );
}
