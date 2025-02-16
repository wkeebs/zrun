export class ApiError extends Error {
    constructor(
      message: string,
      public statusCode: number = 400,
      public code?: string
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  export const handleError = (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };