"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/modelValidation/guest.schema";
import { Field, FieldError } from "@/components/ui/field";
import { useParams, useSearchParams } from "next/navigation";
import { useLoginGuestMutaition } from "@/queries/useGuest";
import { useAppContext } from "@/components/app-provider";
import { useRouter } from "next/navigation";
import { generateSocketInstance, handleErrorApi } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const loginGuestMutaion = useLoginGuestMutaition();
  const route = useRouter();
  const { number } = useParams();
  const { setRole, setSocket } = useAppContext();
  const token = searchParams.get("token");
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber: Number(number) || 1,
    },
  });
  const onSubmit = async (values: GuestLoginBodyType) => {
    if (loginGuestMutaion.isPending) return;
    try {
      const result = await loginGuestMutaion.mutateAsync(values);
      setRole(result.payload.data.guest.role);
      setSocket(generateSocketInstance(result.payload.data.accessToken));
      toast.success("Đăng nhập thành công", { duration: 2000 });
      route.push("/guest/menu");
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };
  useEffect(() => {
    if (!token) {
      setRole(undefined);
      route.push("/");
    }
  }, [setRole, token, route]);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2 max-w-150 shrink-0 w-full"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tên khách hàng</Label>
                    <Input id="name" type="text" required {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
