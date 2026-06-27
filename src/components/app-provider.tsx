"use client";
import {
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState } from "react";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthState, setIsAuthState] = useState(()=> !!getAccessTokenFromLocalStorage());
      const setAuth = (isAuth: boolean) => {
      setIsAuthState(isAuth);
      if (!isAuth) removeTokenFromLocalStorage();
    };
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext value={{isAuth : isAuthState,setIsAuth : setAuth}}>{children}</AppContext>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
