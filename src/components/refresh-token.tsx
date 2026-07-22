"use client";

import { useAppContext } from "@/components/app-provider";
import { checkRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
const TIME_OUT = 1000;
export function RefreshToken() {
  const pathName = usePathname();
  const {socket, setRole, disConnectSocket} = useAppContext()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: ReturnType<typeof setInterval> | null = null;

    const onRefreshToken = (force?: boolean) => {
      checkRefreshToken({
        onError: () => {
          clearInterval(interval!);
          setRole(undefined)
          disConnectSocket()
        },
        force,
      });
    };
    onRefreshToken();
    interval = setInterval(onRefreshToken, TIME_OUT);

    if (socket?.connected) {
      onConnect();
    }
    const onRefreshTokenSocket = () => {
      onRefreshToken(true);
    };
    function onConnect() {
      console.log(socket?.id);
    }
    socket?.on("connect", onConnect);
    socket?.on("refresh-token", onRefreshTokenSocket);
      socket?.on("disconnect", ()=> console.log('disconnect'));
    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", ()=> console.log('disconnect'));

    };
  }, [pathName, socket,setRole,disConnectSocket]);

  return null;
}
