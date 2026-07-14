import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
} from "@/modelValidation/order.schema";
import queryString  from 'query-string'
const prefix = "/orders";
const getListOrder = (queryParams : GetOrdersQueryParamsType) => {
  return http.get<GetOrdersResType>(`${prefix}?${queryString.stringify(queryParams)}`);
};
const getDetailOrder = (orderId : number) => {
  return http.get(`${prefix}/${orderId}`)
}
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
  getDetailOrder
};
