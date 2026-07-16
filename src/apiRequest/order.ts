import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
} from "@/modelValidation/order.schema";
import queryString from "query-string";
const prefix = "/orders";
const getListOrder = (queryParams: GetOrdersQueryParamsType) => {
  return http.get<GetOrdersResType>(
    `${prefix}?${queryString.stringify({ fromDate: queryParams.fromDate?.toISOString(), toDate: queryParams.toDate?.toISOString() })}`,
  );
};
const getDetailOrder = (orderId: number) => {
  return http.get<GetOrderDetailResType>(`${prefix}/${orderId}`);
};
const createOrder = (body: CreateOrdersBodyType) => {
  return http.post<CreateOrdersResType>(prefix, body);
};
const updateOrder = (orderId: number, updateBody: UpdateOrderBodyType) => {
  return http.put(`${prefix}/${orderId}`, updateBody);
};
const payOrder = (body : PayGuestOrdersBodyType) => {
  return http.post<PayGuestOrdersResType>(`${prefix}/pay`, body);

}
export const orderApiRequest = {
  getListOrder,
  createOrder,
  updateOrder,
  getDetailOrder,
  payOrder
};
