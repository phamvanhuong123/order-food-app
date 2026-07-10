"use client";
import { useAppContext } from "@/components/app-provider";
import { Spinner } from "@/components/ui/spinner";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutaition } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function LogoutComponent(){
const { mutateAsync } = useLogoutMutaition();
  const route = useRouter();
  const ref = useRef<unknown>(null);
  const params = useSearchParams();
  const refreshTokenFormUrl = params.get("refreshToken");
  const accessTokenFormUrl = params.get("accessToken");
  const {setRole} = useAppContext()
  useEffect(() => {
    const handleLogout = async () => {
      if (
        ref.current !== null ||
        (refreshTokenFormUrl && refreshTokenFormUrl !== getRefreshTokenFromLocalStorage()) ||
        (accessTokenFormUrl && accessTokenFormUrl !== getAccessTokenFromLocalStorage())
      )
        return;
      ref.current = mutateAsync;
      mutateAsync().then(() => {
        setTimeout(() => {
          setRole(undefined)
          route.push("/login");
        }, 1000);
      });
    };
    handleLogout();
  }, [mutateAsync, route, refreshTokenFormUrl,accessTokenFormUrl,setRole]);

  return <div className="w-screen h-screen flex items-center justify-center">
    <Spinner className="size-15"/>
  </div>;
}


export default function LogoutPage() {
  return <Suspense>
    <LogoutComponent/>
  </Suspense>
}
