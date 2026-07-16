"use client";
import Image from "next/image";

import { useEffect, useMemo } from "react";
import { cn, formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useListGuestOrder } from "@/queries/useGuest";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/lib/socket";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/modelValidation/order.schema";
import { toast } from "sonner";
import { OrderStatus } from "@/constants/type";
import { GuestCreateOrdersResType } from "@/modelValidation/guest.schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";

const sumPrice = (data: GuestCreateOrdersResType["data"]) => {
  return (
    data.reduce((result, order) => {
      const price = result + order.quantity * order.dishSnapshot.price;
      return price;
    }, 0) || 0
  );
};
export const CartOrder = () => {
  const { data, refetch } = useListGuestOrder();
  const orders = useMemo(() => {
    return data?.payload.data || [];
  }, [data]);

  const {
    ordersPaid,
    ordersWatingForPaying,
    totalPriceOfForPaying,
    totalPriceOfPaid,
  } = useMemo(() => {
    const ordersWatingForPaying = orders.filter(
      (order) =>
        order.status !== OrderStatus.Paid &&
        order.status !== OrderStatus.Rejected,
    );
    const ordersPaid = orders.filter(
      (order) => order.status === OrderStatus.Paid,
    );
    const totalPriceOfForPaying = sumPrice(ordersWatingForPaying);
    const totalPriceOfPaid = sumPrice(ordersPaid);

    return {
      ordersWatingForPaying,
      ordersPaid,
      totalPriceOfForPaying,
      totalPriceOfPaid,
    };
  }, [orders]);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }
    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const { dishSnapshot, quantity } = data;
      toast.success(
        `Món ${dishSnapshot.name} (Số lượng : ${quantity}) vừa cật nhật sang trạng thái "${getVietnameseOrderStatus(data.status).message}" `,
      );
      refetch();
    }
    function paymentOrder(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `Khách hàng ${guest?.name} tại bàn ${guest?.tableNumber} đã thanh toán thành công`,
      );
      refetch();
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("update-order", onUpdateOrder);
    socket.on("payment", paymentOrder);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
      socket.off("payment", paymentOrder);
    };
  }, [refetch]);
  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="flex gap-4 border p-1.5 rounded-2xl">
          <div className="shrink-0">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-20 h-20 rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <p className="text-xs">{order.dishSnapshot.description}</p>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)}
            </p>
          </div>
          <div className="shrink-0 ml-auto flex-col justify-center">
            <div className="text-sm">Số lượng : {order.quantity}</div>
            <Badge
              className={cn(
                "text-sm",
                getVietnameseOrderStatus(order.status).cssClass,
              )}
            >
              {getVietnameseOrderStatus(order.status).message}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 grid w-full max-w-md items-start gap-4">
        {ordersWatingForPaying.length !== 0 && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Đơn chưa thanh toán</AlertTitle>
            <AlertDescription>
              <div>Số đơn · {ordersWatingForPaying.length} món</div>
              <p>Tổng giá tiền : {formatCurrency(totalPriceOfForPaying)}</p>
            </AlertDescription>
          </Alert>
        )}
        {ordersPaid.length !== 0 && (
          <Alert className="border-green-500/40 bg-green-50 text-green-900 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-100">
            <CheckCircle2Icon className="text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">
              Đã thanh toán
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-200">
              <div>Số đơn: {ordersPaid.length} món</div>
              <p>Tổng giá tiền: {formatCurrency(totalPriceOfPaid)}</p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};
