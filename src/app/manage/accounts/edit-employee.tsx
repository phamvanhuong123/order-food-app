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
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/modelValidation/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  useDetailEmployee,
  useUpdateAccountMutation,
} from "@/queries/useAccount";
import { useUploadImage } from "@/queries/useMedia";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";
import { Role } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditEmployee({
  id,
  setId,
  // onSubmitSuccess
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  // onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useDetailEmployee({ id: id as number });
  const uploadloadImage = useUploadImage();
  const updateAccountMutation = useUpdateAccountMutation();
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: "",
      email: "",
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
      role: Role.Employee,
    },
  });
  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const changePassword = form.watch("changePassword");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const reset = () => {
    setFile(null);
    setId(undefined);
    form.reset()
  };
  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    if (updateAccountMutation.isPending || uploadloadImage.isPending) return;
    try {
      let updateBody = { ...values };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const imgageUrl = await uploadloadImage.mutateAsync(formData);
        updateBody = {
          ...updateBody,
          avatar: imgageUrl.payload.data,
        };
      }
      await updateAccountMutation.mutateAsync({
        ...updateBody,
        id: id as number,
      });
      toast.success("Cật nhật thông tin thành công", { duration: 2000 });
      reset();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  useEffect(() => {
    if (data) {
      const { avatar, email, name, role } = data.payload.data;
      const isValidRole = role === Role.Owner || role === Role.Employee;
      form.reset({
        avatar: avatar ?? undefined,
        name,
        email,
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
        changePassword: form.getValues("changePassword"),
        role: isValidRole ? role : Role.Employee,
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
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          id="edit-employee-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 py-4">
            <Controller
              control={form.control}
              name="avatar"
              render={({ field, fieldState }) => (
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
                      ref={avatarInputRef}
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
                      onClick={() => avatarInputRef.current?.click()}
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
                    <Label htmlFor="name">Tên</Label>
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
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="email">Email</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input id="email" className="w-full" {...field} />
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
              name="changePassword"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="email">Đổi mật khẩu</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FieldContent>
                    <FieldLabel>Quyền</FieldLabel>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem key={Role.Owner} value={Role.Owner}>
                        Chủ
                      </SelectItem>
                      <SelectItem key={Role.Employee} value={Role.Employee}>
                        Nhân viên
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </Field>
              )}
            />
            {changePassword && (
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="password"
                          className="w-full"
                          type="password"
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
            )}
            {changePassword && (
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="confirmPassword"
                          className="w-full"
                          type="password"
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
            )}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
