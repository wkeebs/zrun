// lib/api/auth.ts
import { LoginFormValues } from "@/lib/validations/auth";
import { ApiError } from "@/lib/utils/error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Common headers for all auth requests
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export interface LoginResponse {
  token: string;
  email: string;
  roles: string[];
}

export const login = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new ApiError(errorMessage, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to connect to the server'
    );
  }
};

export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

export const register = async (data: RegistrationRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new ApiError(errorMessage, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to connect to the server'
    );
  }
};