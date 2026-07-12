import { orderApiRequest } from "@/apiRequest/order";
import { UpdateOrderBodyType } from "@/modelValidation/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetListOrder = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApiRequest.getListOrder,
  });
};
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrder,
  });
};
export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...updateBody }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, updateBody),
  });
};
