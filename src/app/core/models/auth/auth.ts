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

//REGISTER DATA MODEL
export interface AuthRegisterData{
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}


//FORGOTPASSWORD DATA MODEL
export interface AuthForgotPasswordData {
  email: string;
}

//FORGOTPASSWORD RESPONSE MODEL
export interface AuthForgotPasswordResponse {
  status : string;
}


//RESETPASSWORD DATA MODEL
export interface AuthPasswordResetData {
  token: string;
  email: string;
  password : string;
  password_confirmation: string;
}
