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
import { zodResolver } from "@hookform/resolvers/zod";

import { getTableLink, getVietnameseTableStatus } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/modelValidation/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";

export default function EditTable({
  id,
  setId,

}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
}) {
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  const tableNumber = 0;

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-150 max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>

        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          id="edit-table-form"
        >
          <div className="grid gap-4 py-4">
            <Field>
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label htmlFor="name">Số hiệu bàn</Label>
                <div className="col-span-3 w-full space-y-2">
                  <Input
                    id="number"
                    type="number"
                    className="w-full"
                    value={tableNumber}
                    readOnly
                  />
                  {/* <FormMessage /> */}
                </div>
              </div>
            </Field>
            <Controller
              control={form.control}
              name="capacity"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="price">Sức chứa (người)</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input
                        id="capacity"
                        className="w-full"
                        {...field}
                        type="number"
                        value={field.value}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
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
              render={({ field,fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="description">Trạng thái</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>

                        <SelectContent>
                          {TableStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseTableStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                  </div>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="changeToken"
              render={({ field ,fieldState}) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="price">Đổi QR Code</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="changeToken"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </div>

                       {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                  </div>
                </Field>
              )}
            />
            <Field>
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label>QR Code</Label>
                <div className="col-span-3 w-full space-y-2"></div>
              </div>
            </Field>
            <Field>
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label>URL gọi món</Label>
                <div className="col-span-3 w-full space-y-2">
                  <Link
                    href={getTableLink({
                      token: "123123123",
                      tableNumber: tableNumber,
                    })}
                    target="_blank"
                    className="break-all"
                  >
                    {getTableLink({
                      token: "123123123",
                      tableNumber: tableNumber,
                    })}
                  </Link>
                </div>
              </div>
            </Field>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
