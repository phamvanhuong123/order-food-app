'use client'
import { Spinner } from "@/components/ui/spinner";
import { checkRefreshToken, getRefreshTokenFromLocalStorage} from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/"];


function RefreshTokenComponent(){
const route = useRouter()
  const pathName = usePathname()
  const params = useSearchParams()
  const refreshTokenFormUrl = params.get("refreshToken");
  const redirectPath = params.get('redirect')
  console.log(refreshTokenFormUrl)
    useEffect(() => {
      if (UNAUTHENTICATED_PATH.includes(pathName)) return;

      if(refreshTokenFormUrl && refreshTokenFormUrl === getRefreshTokenFromLocalStorage()){
         checkRefreshToken({
          onSuccess : () => {
            route.push(redirectPath || '/')
          }
         });
      }
     
    }, [pathName,refreshTokenFormUrl,redirectPath,route]);
  return <div className="w-sreen h-screen flex items-center justify-center">
    <Spinner className="size-15"/>
  </div>;
}
export default function RefreshToken(){
  return <Suspense>
    <RefreshTokenComponent/>
  </Suspense>
}