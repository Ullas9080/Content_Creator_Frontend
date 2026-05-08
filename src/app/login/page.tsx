"use client";
import { API_BASE_URL } from '@/config/api';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);
  const token = useAuthStore((state) => state.token);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginWithCredentials(formData.email, formData.password, formData.displayName, isSignUp);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (token) {
      router.replace('/');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f111a] text-slate-50 font-sans relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel p-8 sm:p-10 rounded-[2rem] w-full max-w-[420px] relative z-10 border border-dark-700 shadow-2xl bg-dark-900/60 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-white/20">
            <span className="text-white font-bold text-2xl">✧</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isSignUp 
              ? 'Join Fanovix to manage your entire creator empire.'
              : 'Sign in to access your dashboard and insights.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required={isSignUp}
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="alexmorgan"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center pl-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              {!isSignUp && (
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">Forgot?</a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 px-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-900/60 text-gray-500">Or continue with</span>
          </div>
        </div>

        <a 
          href={`${API_BASE_URL}/auth/google`} 
          className="flex items-center justify-center gap-3 w-full bg-dark-800 border border-dark-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-dark-700 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Google
        </a>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ email: '', password: '', displayName: '' });
              }}
              className="text-white font-semibold hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


