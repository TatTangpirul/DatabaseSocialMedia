'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  account: string;
  nickname: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);