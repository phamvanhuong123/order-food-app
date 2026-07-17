"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/modelValidation/guest.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TablesDialog } from "@/app/manage/orders/tables-dialog";
import { GetListGuestsResType } from "@/modelValidation/account.schema";
import { Switch } from "@/components/ui/switch";
import GuestsDialog from "@/app/manage/orders/guests-dialog";
import { CreateOrdersBodyType } from "@/modelValidation/order.schema";
import Quantity from "@/app/guest/menu/quanlity";
import Image from "next/image";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { DishStatus } from "@/constants/type";
import { DishListResType } from "@/modelValidation/dish.schema";
import { Field, FieldError } from "@/components/ui/field";
import { useListDish } from "@/queries/useDish";
import { useCreateGuestMutation } from "@/queries/useAccount";
import { useCreateOrderMutation } from "@/queries/useOrder";
import { toast } from "sonner";

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType["data"][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);
  const listDishesQuery = useListDish();
  const dishes: DishListResType["data"] = useMemo(
    () => listDishesQuery.data?.payload.data || [],
    [listDishesQuery],
  );

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const createGuestMutation = useCreateGuestMutation();
  const createOrderMutation = useCreateOrderMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });
  const name = form.watch("name");
  const tableNumber = form.watch("tableNumber");

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  const reset = ()=> {
    form.reset({name: "",
      tableNumber: 0})
    setOpen(false)
    setIsNewGuest(true)
    setSelectedGuest(null)
  
  }
  const handleOrder = async () => {
    try {
      let guestId = selectedGuest?.id;
      if (isNewGuest) {
        const guest = await createGuestMutation.mutateAsync({
          name,
          tableNumber,
        });
        guestId = guest.payload.data.id;
      }
      if (!guestId) {
        toast.error("Vui lòng chọn khách hàng", { duration: 2000 });
        return;
      }
      const res = await createOrderMutation.mutateAsync({ guestId, orders });
      toast.success(
        `Đã tạo đơn thành công cho khách hàng ${res.payload.data[0].guest?.name} tại bàn ${res.payload.data[0].tableNumber} thành công`,
      );
      reset()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog onOpenChange={(value) => {
      if(!value) reset()
      setOpen(value)
    }} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 max-h-screen overflow-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">Khách hàng mới</Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="isNewGuest"
              checked={isNewGuest}
              onCheckedChange={setIsNewGuest}
            />
          </div>
        </div>
        {isNewGuest && (
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-employee-form"
            onSubmit={form.handleSubmit(handleOrder)}
          >
            <div className="grid gap-4 py-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    </div>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <Field>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="tableNumber">Chọn bàn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center gap-4">
                          <div>{field.value}</div>
                          <TablesDialog
                            onChoose={(table) => {
                              field.onChange(table.number);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Field>
                )}
              />
            </div>
          </form>
        )}
        {!isNewGuest && (
          <GuestsDialog
            onChoose={(guest) => {
              setSelectedGuest(guest);
            }}
          />
        )}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Khách đã chọn</Label>
            <div className="col-span-3 w-full gap-4 flex items-center">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Bàn: {selectedGuest.tableNumber}</div>
            </div>
          </div>
        )}
        {dishes
          .filter((dish) => dish.status !== DishStatus.Hidden)
          .map((dish) => (
            <div
              key={dish.id}
              className={cn("flex gap-4", {
                "cursor-not-allowed": dish.status === DishStatus.Unavailable,
              })}
            >
              <div className="shrink-0 relative">
                {dish.status === DishStatus.Unavailable && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm w-20 h-20 bg-black opacity-50">
                    Hết hàng
                  </span>
                )}
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
                <p className="text-xs font-semibold">
                  {formatCurrency(dish.price)}
                </p>
              </div>
              <div className="shrink-0 ml-auto flex justify-center items-center">
                <Quantity
                  disabled={dish.status === DishStatus.Unavailable}
                  onChange={(value) => {
                    if(dish.status === DishStatus.Unavailable) return
                    handleQuantityChange(dish.id, value)
                  }}
                  value={
                    
                    orders.find((order) => order.dishId === dish.id)
                      ?.quantity ?? 0
                  }
                />
              </div>
            </div>
          ))}
        <DialogFooter>
          <Button
            className="w-full justify-between"
            onClick={handleOrder}
            disabled={orders.length === 0}
          >
            <span>Đặt hàng · {orders.length} món</span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
