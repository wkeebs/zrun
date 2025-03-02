"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  // Validation interval (30 minutes)
  const VALIDATION_INTERVAL = 30 * 60 * 1000; 

  // Validate token on app initialization
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");
      const lastValidationTime = sessionStorage.getItem("lastValidation");

      if (storedToken && storedUser) {
        try {
          // Determine if we need to validate
          const shouldValidate =
            !lastValidationTime ||
            Date.now() - parseInt(lastValidationTime) > VALIDATION_INTERVAL;

          if (shouldValidate) {
            // Replace with your actual token validation endpoint
            const response = await fetch(`${API_BASE}/api/auth/validate`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              // Update last validation time
              sessionStorage.setItem("lastValidation", Date.now().toString());

              // Token is valid, set user and token
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
            } else {
              // Token invalid, logout
              logout();
            }
          } else {
            // Use stored token without validation
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
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
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(userData));

    // Set initial validation time
    sessionStorage.setItem("lastValidation", Date.now().toString());
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("lastValidation");

    // Redirect to login
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
