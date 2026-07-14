import { orderApiRequest } from "@/apiRequest/order";
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from "@/modelValidation/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useListOrder = (queryParams : GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders",queryParams],
    queryFn: ()=> orderApiRequest.getListOrder(queryParams),
  });
};
export const useDetailOrder = (id : number) => {
  return useQuery({
    queryKey : ["orders",id],
    queryFn : ()=> orderApiRequest.getDetailOrder(id),
    enabled : !!id
  })
}
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
