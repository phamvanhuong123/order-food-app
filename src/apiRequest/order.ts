import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  UpdateOrderBodyType,
} from "@/modelValidation/order.schema";

const prefix = "/orders";
const getListOrder = () => {
  return http.get(prefix);
};
const createOrder = (body: CreateOrdersBodyType) => {
  return http.post<CreateOrdersResType>(prefix, body);
};
const updateOrder = (orderId: number, updateBody: UpdateOrderBodyType) => {
  return http.put(`${prefix}/${orderId}`, updateBody);
};

export const orderApiRequest = {
  getListOrder,
  createOrder,
  updateOrder,
};
