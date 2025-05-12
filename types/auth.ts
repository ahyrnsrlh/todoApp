export interface AuthForm {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
}

export interface User {
  id: string;
  email?: string;
  app_metadata: {
    provider?: string;
    [key: string]: unknown;
  };
  user_metadata: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  aud: string;
}
