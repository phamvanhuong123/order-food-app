import { guestApiRequest } from "@/apiRequest/guest";
import { useMutation } from "@tanstack/react-query";

export const useLoginGuestMutaition = () => {
  return useMutation({
    mutationFn: guestApiRequest.sLogin,
  });
};

export const useLogoutGuestMutaition = ()=> {
  return useMutation({
    mutationFn : guestApiRequest.sLogOut
  })
}