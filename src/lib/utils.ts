import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { EntityError, HttpError } from "@/lib/http";
import { toast } from "sonner";
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
  
  if (error instanceof EntityError && setError){
    error.payload.errors.forEach(e => setError(e.field as Path<T>, {
      message : `${e.message}`,
      type : 'server'
    }))
    return
  }
  //Lỗi không xác định
  if(error instanceof HttpError){
    toast.error(error.payload.message ?? "Lỗi không xác định", {
      duration : duration ?? 5000
    })
  }
};


//lấy token
const isBrowser = typeof window !== 'undefined'
export const getAccessTokenFromLocalStorage = () => isBrowser ? localStorage.getItem('accessToken') : null
export const getRefreshTokenFromLocalStorage = () => isBrowser ? localStorage.getItem('refreshToken') : null