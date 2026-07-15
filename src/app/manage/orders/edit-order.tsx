"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/modelValidation/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DishesDialog } from "@/app/manage/orders/dishes-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { DishListResType } from "@/modelValidation/dish.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useDetailOrder, useListOrder, useUpdateOrderMutation } from "@/queries/useOrder";
import { toast } from "sonner";
import { endOfDay, startOfDay } from "date-fns";
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const { data } = useDetailOrder(id!);
  const updateOrderMutation = useUpdateOrderMutation();
  const {refetch} = useListOrder({fromDate : initFromDate,toDate : initToDate})
  const [selectedDish, setSelectedDish] = useState<
    DishListResType["data"][0] | null
  >(null);
  const currentDish = selectedDish ?? data?.payload.data.dishSnapshot;
  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending) return;
    try {
      await updateOrderMutation.mutateAsync({...values, orderId : id!})
      toast.success('Cật nhật trạng thái đơn hàng thành công', {duration : 2000})
      refetch()
      reset()
      onSubmitSuccess?.()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const reset = () => {
    setId(undefined);
    setSelectedDish(null);
  };

  useEffect(() => {
    if (data) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity,
      } = data.payload.data;
      form.reset({
        dishId: dishId || 0,
        status,
        quantity,
      });
    }
  }, [data, form]);
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-150 max-h-screen overflow-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>

        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          id="edit-order-form"
          onSubmit={form.handleSubmit(onSubmit, console.log)}
        >
          <div className="grid gap-4 py-4">
            <Controller
              control={form.control}
              name="dishId"
              render={({ field }) => (
                <Field className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <FieldLabel>Món ăn</FieldLabel>
                  <div className="flex items-center col-span-2 space-x-4">
                    <Avatar className="aspect-square w-12.5 h-12.5 rounded-md object-cover">
                      <AvatarImage src={currentDish?.image} />
                      <AvatarFallback className="rounded-none">
                        {currentDish?.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>{currentDish?.name}</div>
                  </div>

                  <DishesDialog
                    onChoose={(dish) => {
                      field.onChange(dish.id);
                      setSelectedDish(dish);
                    }}
                  />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="quantity">Số lượng</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input
                        id="quantity"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-16 text-center"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numberValue = Number(value);
                          if (isNaN(numberValue)) {
                            return;
                          }
                          field.onChange(numberValue);
                        }}
                      />
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
              name="status"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FieldLabel>Trạng thái</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-50">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>

                      <SelectContent>
                        {OrderStatusValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {getVietnameseOrderStatus(status).message}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="edit-order-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
