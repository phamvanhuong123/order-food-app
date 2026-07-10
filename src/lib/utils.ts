import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt, { decode } from "jsonwebtoken";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { EntityError, HttpError } from "@/lib/http";
import { toast } from "sonner";
import { authApiRequest } from "@/apiRequest/auth";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { envConfig } from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import { cookies } from "next/headers";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = <Payload = unknown>(token: string) => {
  return jwt.decode(token) as Payload;
};

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError,
  duration,
}: {
  error: unknown;
  setError?: UseFormSetError<T>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((e) =>
      setError(e.field as Path<T>, {
        message: `${e.message}`,
        type: "server",
      }),
    );
    return;
  }
  //Lỗi không xác định
  if (error instanceof HttpError) {
    toast.error(error.payload.message ?? "Lỗi không xác định", {
      duration: duration ?? 5000,
    });
  }
};

export function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

//lấy token
const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;
export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAcessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);
export const setRefreshToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const removeTokenFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const checkRefreshToken = async (params?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const acessTokenFromUrl = getAccessTokenFromLocalStorage();
  const refreshTokenFromUrl = getRefreshTokenFromLocalStorage();
  if (!acessTokenFromUrl || !refreshTokenFromUrl) return;

  //decode
  const decodeAccessToken = decode(acessTokenFromUrl) as {
    exp: number;
    iat: number;
  };

  const now = Math.round(Date.now() / 1000); // js tinh theo (ms) nên cần phải chia ra thành giây để đồng bộ với jwt

  //Nếu thời gian sử dụng của accesToken chỉ còn 1/3 thì refreshToken
  //ví dụ thời hạn của accessToken là 10s thì khi thời hạn accessToken còn 3s thì gọi api refreshToken
  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.sRefreshToken();
      const {
        payload: { data },
      } = res;
      const { accessToken, refreshToken } = data;
      setAcessTokenToLocalStorage(accessToken);
      setRefreshToLocalStorage(refreshToken);
      params?.onSuccess?.();
    } catch (error) {
      console.error(error);
      params?.onError?.();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus],
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus],
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus],
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

// export function removeAccents(str: string) {
//   return str
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/đ/g, 'd')
//     .replace(/Đ/g, 'D')
// }

// export const simpleMatchText = (fullText: string, matchText: string) => {
//   return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
// }

// export const formatDateTimeToLocaleString = (date: string | Date) => {
//   return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
// }

// export const formatDateTimeToTimeString = (date: string | Date) => {
//   return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
// }

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const setAccesTokenToCookie = async ({
  accessToken,
  exp,
}: {
  accessToken: string;
  exp: number;
}) => {
  const cookiesStore = await cookies();
  cookiesStore.set("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp * 1000,
  });
};
export const setRefreshTokenToCookie = async ({
  refreshToken,
  exp,
}: {
  refreshToken: string;
  exp: number;
}) => {
  const cookiesStore = await cookies();
  cookiesStore.set("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp * 1000,
  });
};
