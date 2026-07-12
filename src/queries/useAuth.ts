import { authApiRequest } from "@/apiRequest/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutaition = () => {
  return useMutation({
    mutationFn: authApiRequest.sLogin,
  });
};

export const useLogoutMutaition = ()=> {
  return useMutation({
    mutationFn : authApiRequest.sLogOut
  })
}