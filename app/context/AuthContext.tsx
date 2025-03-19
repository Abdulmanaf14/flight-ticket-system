'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh session data - can be called after login
  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log("Session refreshed successfully:", data.session.user?.email);
      } else {
        setSession(null);
        setUser(null);
        console.log("No active session found during refresh");
      }
    } catch (err) {
      console.error('Unexpected error during refresh:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial session fetch
  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (data.session) {
          console.log("Session found during initialization for:", data.session.user?.email);
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log("No active session found during initialization");
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Unexpected auth error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        // Clear user data
        setUser(null);
        setSession(null);
        console.log("User signed out successfully");
      }
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 