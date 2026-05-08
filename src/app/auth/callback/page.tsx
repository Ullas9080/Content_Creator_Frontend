"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authToken } from '@/lib/auth-token';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginWithToken = useAuthStore((state) => state.loginWithToken);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    const handle = async () => {
      const token = searchParams.get('token');
      try {
        if (token) {
          await loginWithToken(token);
        } else {
          // Cookie-based OAuth callback path.
          const fallbackToken = authToken.get();
          if (fallbackToken) {
            await fetchMe();
          } else {
            await fetchMe();
          }
        }
        router.replace('/');
      } catch {
        router.replace('/login');
      }
    };
    handle();
  }, [router, searchParams, loginWithToken, fetchMe]);

  return (
    <div className="flex items-center justify-center h-screen bg-dark-900 text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Authenticating with Google...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-dark-900 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
