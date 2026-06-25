"use client";

import { authApiRequest } from "@/apiRequest/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAcessTokenToLocalStorage,
  setRefreshToLocalStorage,
} from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
const TIME_OUT = 1000;
export function RefreshToken() {
  const pathName = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const checkRefreshToken = async () => {
      // console.log(pathName);
      const acessTokenFromUrl = getAccessTokenFromLocalStorage();
      const refreshTokenFromUrl = getRefreshTokenFromLocalStorage();
      if (!acessTokenFromUrl || !refreshTokenFromUrl) return;

      // const res = await authApiRequest.sRefreshToken()
      // const {payload : {data}} =  res
      // const {accessToken} = data

      //decode
      const decodeAccessToken = decode(acessTokenFromUrl) as {
        exp: number;
        iat: number;
      };

      const now = Math.round(Date.now() / 1000); // js tinh theo (ms) nên cần phải chia ra thành giây để đồng bộ với jwt

      //Nếu thời gian sử dụng của accesToken chỉ còn 1/3 thì refreshToken
      //ví dụ thời hạn của accessToken là 10s thì khi thời hạn accessToken còn 3s thì gọi api refreshToken
      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.sRefreshToken();
          const {
            payload: { data },
          } = res;
          const { accessToken, refreshToken } = data;
          setAcessTokenToLocalStorage(accessToken);
          setRefreshToLocalStorage(refreshToken);
        } catch (error) {
          console.error(error);
          clearInterval(interval!);
        }
      }
    };
    checkRefreshToken();

    interval = setInterval(checkRefreshToken, TIME_OUT);
    return ()=> {
      clearInterval(interval)
     
    }
  }, [pathName]);

  return null;
}
