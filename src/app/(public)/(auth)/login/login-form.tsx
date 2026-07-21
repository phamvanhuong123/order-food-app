"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { LoginBody, LoginBodyType } from "@/modelValidation/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import { useLoginMutaition } from "@/queries/useAuth";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAppContext } from "@/components/app-provider";


function LoginFormConponent() {
   const loginMutation = useLoginMutaition();
  const route = useRouter()
  const searchParams = useSearchParams()
  const {setRole} = useAppContext()
  const clearToken = searchParams.get('clearTokens')
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const res =await loginMutation.mutateAsync(data);
      toast.success("Đăng nhập thành công", {
        duration: 2000,
       
      });
      setRole(res.payload.data.account.role)
      route.push('/manage/dashboard')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
        duration: 2000,
      });
    }
  };
  useEffect(()=>{
    if(clearToken) setRole(undefined)
  },[setRole,clearToken])
  return (
    <Card className="mx-auto max-w-sm w-150">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-login"
          className="space-y-2 max-w-150 shrink-0 w-full"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" required {...field} />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button form="form-login" type="submit" className="w-full">
              Đăng nhập
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              form="form-login"
            >
              Đăng nhập bằng Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


export default function LoginForm() {
 return <Suspense>
  <LoginFormConponent/>
 </Suspense>
}
