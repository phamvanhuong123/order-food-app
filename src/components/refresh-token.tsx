"use client";

import { socket } from "@/lib/socket";
import { checkRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
const TIME_OUT = 1000;
export function RefreshToken() {
  const pathName = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: ReturnType<typeof setInterval> | null = null;

    const onRefreshToken = (force?: boolean) => {
      checkRefreshToken({
        onError: () => {
          clearInterval(interval!);
        },
        force,
      });
    };
    onRefreshToken();
    interval = setInterval(onRefreshToken, TIME_OUT);

    if (socket.connected) {
      onConnect();
    }
    const onRefreshTokenSocket = () => {
      onRefreshToken(true);
    };
    function onConnect() {
      console.log(socket.id);
    }
    socket.on("connect", onConnect);
    socket.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket.off("connect", onConnect);
    };
  }, [pathName]);

  return null;
}
