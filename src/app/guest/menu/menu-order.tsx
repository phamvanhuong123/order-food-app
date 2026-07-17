"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useListDish } from "@/queries/useDish";
import Quantity from "@/app/guest/menu/quanlity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/modelValidation/guest.schema";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useCreateGuestOrder } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DishStatus } from "@/constants/type";
export const MenuOrder = () => {
  const { data } = useListDish();
  const route = useRouter()
  const createOrderMutation = useCreateGuestOrder()
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

  const handleOrderFood = async ()=> {
    if(orders.length === 0) {
      toast.error('Bạn chưa gọi món vui lòng thử lại', {duration : 2000})
      return
    }
    if(createOrderMutation.isPending) return
    try {
      await createOrderMutation.mutateAsync(orders)
      route.push('/guest/orders')

    } catch (error) {
      handleErrorApi({error})
    }
  }
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
      {dishes.filter(dish => dish.status !== DishStatus.Hidden).map((dish) => (
        <div key={dish.id} className={cn('flex gap-4',{
            'cursor-not-allowed' : dish.status === DishStatus.Unavailable
          })}>
          <div className="shrink-0 relative">
            {dish.status === DishStatus.Unavailable && <div  className="absolute text-sm w-full h-full flex items-center justify-center bg-black opacity-55">Hết hàng</div>}
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
              disabled={dish.status === DishStatus.Unavailable}
              value={
                orders.find((order) => order.dishId == dish.id)?.quantity ?? 0
              }
              onChange={(value) => {
                if(dish.status === DishStatus.Unavailable) return         
                handleOnChange(dish.id, value)
              }}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button onClick={handleOrderFood} className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
};
