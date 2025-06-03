
import { useState, useEffect } from 'react';

export interface UserSession {
  pseudonym: string;
  createdAt: string;
}

export const useSession = () => {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('anonshop_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (error) {
        console.error('Failed to parse session:', error);
        localStorage.removeItem('anonshop_session');
      }
    }
  }, []);

  const createSession = (pseudonym: string) => {
    const newSession: UserSession = {
      pseudonym,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('anonshop_session', JSON.stringify(newSession));
    setSession(newSession);
  };

  const destroySession = () => {
    localStorage.removeItem('anonshop_session');
    localStorage.removeItem('anonshop_cart');
    localStorage.removeItem('anonshop_products');
    setSession(null);
  };

  return {
    session,
    createSession,
    destroySession,
    isAuthenticated: !!session
  };
};
