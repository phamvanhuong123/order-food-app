import http from "@/lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/modelValidation/auth.shema";
import { GuestLoginBodyType, GuestLoginResType } from "@/modelValidation/guest.schema";

const prefix = 'guest'

//Login bên api server
const login = async (body: GuestLoginBodyType) => {
  return http.post<GuestLoginResType>(`/${prefix}/auth/login`, body);
};
//login bên next server
const sLogin = async (body: GuestLoginBodyType) => {
  return http.post<GuestLoginResType>(`/api/${prefix}/login`, body, {
    baseUrl: "",
  });
};
const logOut = async (
  body: LogoutBodyType & {
    accessToken: string;
  },
) => {
  return http.post(
    `/${prefix}/auth/logout`,
    {
      refreshToken: body.refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
      },
    },
  );
};

//KHông cần truyền vì cho dù api có thất bại thì cũng logout
const sLogOut = async () => {
  return http.post(`api/${prefix}/logout`, null, {
    baseUrl: "",
  });
};

//refreshToken
let refreshTokenRequest: Promise<{
  status: number;
  payload: RefreshTokenResType;
}> | null;

const refreshToken = (body: RefreshTokenBodyType) => {
  return http.post<RefreshTokenResType>(`/${prefix}/auth/refresh-token`, body);
};
const sRefreshToken =async () => {
  if (refreshTokenRequest) {
  
    return refreshTokenRequest
  }
  refreshTokenRequest = http.post<RefreshTokenResType>(`api/${prefix}/refresh-token`, null, {
      baseUrl: "",
    });
  const result = await refreshTokenRequest
  refreshTokenRequest = null
  return result;
};


export const guestApiRequest = {
  login,
  sLogin,
  sLogOut,
  logOut,
  refreshToken,
  sRefreshToken
}