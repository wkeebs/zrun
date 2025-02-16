export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface User {
    email: string;
    name: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface AuthError {
    message: string;
    code?: string;
  }