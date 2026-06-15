import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/modelValidation/auth.shema";

//Login bên api server
const login = async (body: LoginBodyType) => {
  return http.post<LoginResType>('auth/login', body);
};
//login bên next server
const sLogin = async (body: LoginBodyType) => {
  return http.post<LoginResType>('/api/auth/login', body, {
    baseUrl : ''
  });
};

export const authApiRequest = {
  login,
  sLogin,
};
