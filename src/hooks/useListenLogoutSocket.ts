import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export const useListenSocketLogout = ({ socket }: { socket: Socket | undefined }) => {
  const pathName = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    const onLogout = ()=> {
      console.log('logout')
    }
    socket?.on('logout',onLogout)
    return ()=> {
    socket?.off('logout',onLogout)

    }
  }, [pathName,socket]);
};
