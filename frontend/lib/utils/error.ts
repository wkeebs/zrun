// src/lib/utils/error.ts

/**
 * Custom API error class with additional properties
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";

    // This fixes the prototype chain in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Generic error handler that normalizes different error types
 * into a user-friendly message
 */
export const handleError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Parse error response from the API
 */
export const parseApiError = async (response: Response): Promise<ApiError> => {
  try {
    // Try to parse as JSON first
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return new ApiError(
        data.message || data.error || "An error occurred",
        response.status,
        data.code
      );
    } else {
      // Handle plain text errors
      const text = await response.text();
      return new ApiError(text || `Error: ${response.status}`, response.status);
    }
  } catch (err) {
    // If parsing fails, return a generic error
    return new ApiError(
      `Error ${response.status}: ${response.statusText}`,
      response.status
    );
  }
};
