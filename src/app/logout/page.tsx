"use client";
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
          route.push("/login");
        }, 1000);
      });
    };
    handleLogout();
  }, [mutateAsync, route, refreshTokenFormUrl,accessTokenFormUrl]);

  return <>Loading</>;
}
