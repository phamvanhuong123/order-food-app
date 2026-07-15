"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { cn, formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useListGuestOrder } from "@/queries/useGuest";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/lib/socket";
import { UpdateOrderResType } from "@/modelValidation/order.schema";
import { toast } from "sonner";
export const CartOrder = () => {
  const { data, refetch } = useListGuestOrder();
  const orders = useMemo(() => {
    return data?.payload.data || [];
  }, [data]);

  const totalPrice = useMemo(() => {
    return (
      orders.reduce((result, order) => {
        const price = result + order.quantity * order.dishSnapshot.price;
        return price;
      }, 0) || 0
    );
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
      console.log(getVietnameseOrderStatus(data.status))
      toast.success(
        `Món ${dishSnapshot.name} (Số lượng : ${quantity}) vừa cật nhật sang trạng thái "${getVietnameseOrderStatus(data.status).message}" `,
      );
      refetch();
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("update-order", onUpdateOrder);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
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
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <div>Đặt hàng · {orders.length} món</div>
          <p>Tổng giá tiền : {formatCurrency(totalPrice)}</p>
        </Button>
      </div>
    </>
  );
};
