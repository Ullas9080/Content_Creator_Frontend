const TOKEN_KEY = 'token';

export const authToken = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `app_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = 'app_token=; path=/; max-age=0; samesite=lax';
  },
};
