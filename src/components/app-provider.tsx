"use client";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  disconnectSocket,
} from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RoleType } from "@/types/jwt.types";
import { Socket } from "socket.io-client";
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
  socket: undefined as Socket | undefined,
  setSocket: (socket?: undefined | Socket) => {
    console.log(socket);
  },
  disConnectSocket: () => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const socketRef = useRef<Socket | undefined>(undefined);

  const [isRoleState, setIsRoleState] = useState<RoleType | undefined>(() => {
    if (getAccessTokenFromLocalStorage()) {
      const role = decodeToken(getAccessTokenFromLocalStorage()!).role;
      return role;
    }
    return undefined;
  });
  const setRole = (role?: RoleType) => {
    setIsRoleState(role);
    if (!role) removeTokenFromLocalStorage();
  };
  const disConnectSocket = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = undefined;
    disconnectSocket();
    setSocket(undefined);
  }, [setSocket]);
  useEffect(() => {
    const token = getAccessTokenFromLocalStorage();
    if (!token) return;
    if (!socketRef.current) {
      
      socketRef.current = generateSocketInstance(token)
      socketRef.current.connect()
      console.log(socketRef.current)
      setSocket(socketRef.current)
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = undefined;
      disconnectSocket();
      setSocket(undefined);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext
        value={{
          role: isRoleState,
          setRole: setRole,
          setSocket,
          socket,
          disConnectSocket,
        }}
      >
        {children}
      </AppContext>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
