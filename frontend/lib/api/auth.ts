// lib/api/auth.ts
import { LoginFormValues } from "@/lib/validations/auth";
import { ApiError } from "@/lib/utils/error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Common headers for all auth requests
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export interface LoginResponse {
  token: string;
  email: string;
  roles: string[];
}

export const login = async (
  credentials: LoginFormValues
): Promise<LoginResponse> => {
  console.log(API_BASE);
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new ApiError(
          "An internal server error occurred. Please try again later.",
          500
        );
      }
      if (response.status === 401) {
        throw new ApiError("Invalid email or password.", 401);
      }

      throw new ApiError("Failed to log in.", response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to connect to the server"
    );
  }
};

export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

export const register = async (
  data: RegistrationRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new ApiError(
          "An internal server error occurred. Please try again later.",
          500
        );
      }
      if (response.status === 409) {
        throw new ApiError("This email is already in use.", 409);
      }

      throw new ApiError("Failed to register.", response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to connect to the server"
    );
  }
};

/**
 * Returns headers needed for authenticated API requests,
 * including the authorization token if available.
 * @param additionalHeaders - Optional additional headers to include
 * @returns Headers object for authenticated requests
 */
export const getAuthHeaders = async (
  additionalHeaders: Record<string, string> = {}
): Promise<HeadersInit> => {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...additionalHeaders,
  };
};
