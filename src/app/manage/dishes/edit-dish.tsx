"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVietnameseDishStatus, handleErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateDishBody,
  UpdateDishBodyType,
} from "@/modelValidation/dish.schema";
import { DishStatus, DishStatusValues } from "@/constants/type";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";

export default function EditDish({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      status: DishStatus.Unavailable,
    },
  });
  const image = form.watch("image");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>
            Các trường sau đây là bắ buộc: Tên, ảnh
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          id="edit-dish-form"
        >
          <div className="grid gap-4 py-4">
            <Controller
              control={form.control}
              name="image"
              render={({ field,fieldState }) => (
                <Field>
                  <div className="flex gap-2 items-start justify-start">
                    <Avatar className="aspect-square w-25 h-25 rounded-md object-cover">
                      <AvatarImage src={previewAvatarFromFile} />
                      <AvatarFallback className="rounded-none">
                        {name || "Avatar"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          field.onChange("http://localhost:3000/" + file.name);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      className="flex aspect-square w-25 items-center justify-center rounded-md border border-dashed"
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </button>
                  </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="name">Tên món ăn</Label>
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
              name="price"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="price">Giá</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input
                        id="price"
                        className="w-full"
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="description">Mô tả sản phẩm</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Textarea
                        id="description"
                        className="w-full"
                        {...field}
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
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>

                        <SelectContent>
                          {DishStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseDishStatus(status)}
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
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="edit-dish-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
