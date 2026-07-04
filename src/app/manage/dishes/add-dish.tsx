"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVietnameseDishStatus } from "@/lib/utils";
import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/modelValidation/dish.schema";
import { DishStatus, DishStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
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
  const onSubmit = (values: CreateDishBodyType) => {
    console.log(values);
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Thêm món ăn
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>

        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          id="add-dish-form"
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
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
              render={({ field, fieldState }) => (
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
          <Button type="submit" form="add-dish-form">
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
