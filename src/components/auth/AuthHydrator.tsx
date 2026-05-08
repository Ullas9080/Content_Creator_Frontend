"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocialAccountStore } from '@/store/useSocialAccountStore';

export default function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const logout = useAuthStore((state) => state.logout);
  const refreshSocial = useSocialAccountStore((state) => state.refresh);
  const clearSocial = useSocialAccountStore((state) => state.clear);

  useEffect(() => {
    hydrateAuth().then(() => refreshSocial());
    const onUnauthorized = () => {
      clearSocial();
      logout();
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, [hydrateAuth, logout, refreshSocial, clearSocial]);

  return <>{children}</>;
}
