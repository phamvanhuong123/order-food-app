"use client";

import { envConfig } from "@/config";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { io } from "socket.io-client";

//Được khởi tạo duy nhất một lần khi chạy chương trình
export const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT,{
    auth : {
        Authorization : `Bearer ${getAccessTokenFromLocalStorage()}`
    },
    autoConnect : false
});