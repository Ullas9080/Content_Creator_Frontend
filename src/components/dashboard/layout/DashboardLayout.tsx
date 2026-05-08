"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import Header from '@/components/dashboard/layout/Header';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hydrated, isLoading } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isLoading, isAuthenticated, router]);

  if (!hydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-slate-50 selection:bg-purple-600/40 selection:text-white font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Ambient glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[40%] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-pink-600/8 rounded-full blur-[100px] pointer-events-none" />
        <Header />
        <div className="flex-1 overflow-y-auto z-10 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
