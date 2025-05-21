//LOGIN DATA MODEL
export interface AuthLoginData {
  email: string;
  password: string;
}

//LOGIN RESPONSE MODEL
export interface AuthLoginResponse{
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  token: string;
}
