"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn } from "@/lib/utils";
import { useLogoutMutaition } from "@/queries/useAuth";
import { useLogoutGuestMutaition } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const menuItems: {
  title: string;
  href: string;
  roles?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Món ăn",
    href: "/guest/menu",
    roles: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/orders",
    roles: [Role.Guest],
  },

  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutaion = useLogoutMutaition();
  const guestLogoutMutation = useLogoutGuestMutaition();
  const route = useRouter();
  const handleLogout = async () => {
    if (logoutMutaion.isPending || guestLogoutMutation.isPending) return;
    try {
      if (role === Role.Guest) {
        await guestLogoutMutation.mutateAsync();
      } else {
        await logoutMutaion.mutateAsync();
      }

      toast.success("Đăng xuất thành công", { duration: 2000 });
      route.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Đang có vấn đề", { duration: 2000 });
    } finally {
      setRole(undefined);
    }
  };
  console.log(role);
  return (
    <>
      {menuItems.map((menu) => {
        const isAuth = menu.roles && role && menu.roles.includes(role);
        const canShow =
          (menu.roles === undefined && !menu.hideWhenLogin) ||
          (!role && menu.hideWhenLogin);
        if (isAuth || canShow)
          return (
            <Link href={menu.href} key={menu.href} className={className}>
              {menu.title}
            </Link>
          );
      })}
      {role && (
        <div onClick={handleLogout} className={cn(className, "cursor-pointer")}>
          Đăng xuất
        </div>
      )}
    </>
  );
}
