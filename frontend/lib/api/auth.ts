import { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";
import { ApiError } from "@/lib/utils/error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const login = async (credentials: LoginFormValues) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      // Handle plain text error response
      const errorMessage = await response.text();
      throw new ApiError(errorMessage, response.status);
    }

    // Handle successful JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to connect to the server'
    );
  }
};

export const register = async (data: RegisterFormValues) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to connect to the server'
    );
  }
};