'use client'
import { checkRefreshToken, getRefreshTokenFromLocalStorage} from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken(){
  const route = useRouter()
  const pathName = usePathname()
  const params = useSearchParams()
  const refreshTokenFormUrl = params.get("refreshToken");
  const redirectPath = params.get('redirect')
    useEffect(() => {
      // if (UNAUTHENTICATED_PATH.includes(pathName)) return;

      if(refreshTokenFormUrl && refreshTokenFormUrl === getRefreshTokenFromLocalStorage()){
         checkRefreshToken({
          onSuccess : () => {
            route.push(redirectPath || '/')
          }
         });
      }
     
    }, [pathName,refreshTokenFormUrl,redirectPath,route]);
  return null
}