import { guestApiRequest } from "@/apiRequest/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginGuestMutaition = () => {
  return useMutation({
    mutationFn: guestApiRequest.sLogin,
  });
};

export const useLogoutGuestMutaition = () => {
  return useMutation({
    mutationFn: guestApiRequest.sLogOut,
  });
};

export const useListGuestOrder = () => {
  return useQuery({
    queryKey: ["guest-order"],
    queryFn: guestApiRequest.getListGuestOrder,
  });
};
export const useCreateGuestOrder = () => {
  return useMutation({
    mutationFn: guestApiRequest.createGuestOrder,
  });
};
