"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useListDish } from "@/queries/useDish";
import Quantity from "@/app/guest/menu/quanlity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/modelValidation/guest.schema";
import { formatCurrency } from "@/lib/utils";
export const MenuOrder = () => {
  const { data } = useListDish();
  const dishes = useMemo(()=> {return data?.payload.data || []},[data])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const handleOnChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
    //Nếu quantity = 0 xoá khỏi danh sách
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }

      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      //Nếu chưa có thì thêm
      if (index === -1) {
        return [...prevOrders, { dishId: dishId, quantity: quantity }];
      }
      //Nếu đã có thì cật nhật quatity
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  const totalPrice  = useMemo(()=>{
    return orders.reduce((result,order) => {
    const dish = dishes.find(dish => dish.id === order.dishId)
     if(!dish) return result
    const total = result + (dish.price * order.quantity)
    return total

  },0)
  },[orders,dishes])
  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="shrink-0">
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-20 h-20 rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
          </div>
          <div className="shrink-0 ml-auto flex justify-center items-center">
            <Quantity
              value={
                orders.find((order) => order.dishId == dish.id)?.quantity ?? 0
              }
              onChange={(value) => handleOnChange(dish.id, value)}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{totalPrice}</span>
        </Button>
      </div>
    </>
  );
};
