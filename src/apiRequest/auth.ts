import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/modelValidation/auth.shema";

//Login bên api server
const login = async (body: LoginBodyType) => {
  return http.post<LoginResType>("auth/login", body);
};
//login bên next server
const sLogin = async (body: LoginBodyType) => {
  return http.post<LoginResType>("/api/auth/login", body, {
    baseUrl: "",
  });
};
const logOut = async (
  body: LogoutBodyType & {
    accessToken: string;
  },
) => {
  return http.post("auth/logout", {
    refreshToken : body.refreshToken
  },{
    headers : {
      Authorization : `Bearer ${body.accessToken}`
    }
  });
};

//KHông cần truyền vì cho dù api có thất bại thì cũng logout
const sLogOut = async () => {
  return http.post("api/auth/logout", null, {
    baseUrl: "",
  });
};
export const authApiRequest = {
  login,
  sLogin,
  logOut,
  sLogOut,
};
