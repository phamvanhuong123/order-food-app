"use client";
import { useAppContext } from "@/components/app-provider";
import { useLogoutMutaition } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export const ListenLogoutSocket = () => {
  const pathName = usePathname();
  const route = useRouter();
  const { socket, setRole, disConnectSocket } = useAppContext();
  const {isPending, mutateAsync} = useLogoutMutaition();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    const onLogout = async () => {
      if (isPending) return;
      try {
        await mutateAsync();
        toast.success("Đăng xuất thành công", { duration: 2000 });
        route.push("/login");
      } catch (error) {
        console.error(error);
        toast.error("Đang có vấn đề", { duration: 2000 });
      } finally {
        setRole(undefined);
        disConnectSocket();
      }
    };
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [pathName, socket, disConnectSocket, route, setRole,isPending, mutateAsync]);
  console.log('ok')
  return null;
};
