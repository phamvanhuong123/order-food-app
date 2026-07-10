"use client";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useState } from "react";
import { RoleType } from "@/types/jwt.types";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isRoleState, setIsRoleState] = useState<RoleType | undefined>(()=> {
    if(getAccessTokenFromLocalStorage()){
      const role = decodeToken(getAccessTokenFromLocalStorage()!).role
      return role
    }
    return undefined
  });
      const setRole = (role?: RoleType) => {
      setIsRoleState(role);
      if (!role) removeTokenFromLocalStorage();
    };
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext value={{role : isRoleState,setRole : setRole}}>{children}</AppContext>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
