'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Validate token on app initialization
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Replace with your actual token validation endpoint
          const response = await fetch(`${API_BASE}/api/auth/validate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // Token is valid, set user and token
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token invalid, logout
            logout();
          }
        } catch (error) {
          // Network error or validation failed
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        // No stored token
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = (newToken: string, userData: User) => {
    // Store in state
    setToken(newToken);
    setUser(userData);

    // Store in sessionStorage
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout,
        isAuthenticated: !!token,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}