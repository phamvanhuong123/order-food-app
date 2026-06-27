"use client";
import { useAppContext } from "@/components/app-provider";
import { Spinner } from "@/components/ui/spinner";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutaition } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutaition();
  const route = useRouter();
  const ref = useRef<unknown>(null);
  const params = useSearchParams();
  const refreshTokenFormUrl = params.get("refreshToken");
  const accessTokenFormUrl = params.get("accessToken");
  const {setIsAuth} = useAppContext()
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
          setIsAuth(false)
          route.push("/login");
        }, 1000);
      });
    };
    handleLogout();
  }, [mutateAsync, route, refreshTokenFormUrl,accessTokenFormUrl,setIsAuth]);

  return <div className="w-screen h-screen flex items-center justify-center">
    <Spinner className="size-15"/>
  </div>;
}
