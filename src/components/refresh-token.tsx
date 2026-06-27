"use client";

import {
  checkRefreshToken,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
const TIME_OUT = 1000;
export function RefreshToken() {
  const pathName = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: ReturnType<typeof setInterval> | null = null;

    checkRefreshToken({
      onError: () => {
        clearInterval(interval!);
      },
    });

    interval = setInterval(checkRefreshToken, TIME_OUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathName]);

  return null;
}
