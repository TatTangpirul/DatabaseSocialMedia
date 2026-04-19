// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  account: string;
  email: string;
  profile_image_url: string | null;
  bio: string | null;
  n_posts: number;
  n_likes: number;
  followers: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); 
  }, []);

  if (loading) return null;

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};