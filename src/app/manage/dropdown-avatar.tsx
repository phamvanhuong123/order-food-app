"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogoutMutaition } from "@/queries/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAccountMe } from "@/queries/useAccountProfile";
import { useAppContext } from "@/components/app-provider";
export default function DropdownAvatar() {
  const logoutMutaion = useLogoutMutaition();
  const {data} = useAccountMe()
  const {setIsAuth} = useAppContext()
  const account = data?.payload.data
  const route = useRouter()
  const handleLogout = async () => {
    if (logoutMutaion.isPending) return;
    try {
      await logoutMutaion.mutateAsync()
      toast.success("Đăng xuất thành công", {duration : 2000})
      route.push('/')
      
    } catch (error) {
      console.error(error);
      toast.error("Đang có vấn đề", {duration : 2000})
     
    }finally{
      setIsAuth(false)
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
