"use client";

import React from 'react';
import { FaGoogle, FaYoutube } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0f111a] text-slate-50 selection:bg-purple-600/40">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[40%] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-pink-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel p-10 rounded-3xl w-full max-w-md relative z-10 border border-dark-700 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
          <FaYoutube size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Fanovix</h1>
        <p className="text-gray-400 mb-8 text-sm">Sign in to connect your YouTube channel and unlock AI insights.</p>
        
        <a 
          href="http://localhost:5000/auth/google" 
          className="flex items-center justify-center gap-3 w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <FaGoogle size={18} className="text-blue-500" />
          Continue with Google
        </a>

        <p className="text-[11px] text-gray-500 mt-6">
          By signing in, you grant read-only access to your YouTube Analytics.
        </p>
      </div>
    </div>
  );
}
