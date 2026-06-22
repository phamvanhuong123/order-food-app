"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/modelValidation/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccountMe, useUpdateAccountMe } from "@/queries/useAccountProfile";
import { useUploadImage } from "@/queries/useMedia";
import { handleErrorApi } from "@/lib/utils";

export default function UpdateProfileForm() {
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });
  const { data } = useAccountMe();
  const updateAccountMe = useUpdateAccountMe()
  const uploadloadImage = useUploadImage()
  const inputAvataRef = useRef<HTMLInputElement>(null);
  const avatar = form.getValues("avatar");
  const [file, setFile] = useState<File | null>(null);
  const previewAvatar = useMemo(() => {
    if (file) {
      const urlFileImage = URL.createObjectURL(file);

      return urlFileImage;
    }
    return avatar;
  }, [file,avatar]);
  const onSubmit =async (values : UpdateMeBodyType) => {
    if(updateAccountMe.isPending || !form.formState.isDirty) return
    try{
      let updateBody = {
        ...values
      }
      if(file){
        const formData = new FormData()
        formData.append('file',file)
        const imgageUrl = await uploadloadImage.mutateAsync(formData)
        updateBody = {
          ...updateBody,
          avatar : imgageUrl.payload.data
        }
      }
      await updateAccountMe.mutateAsync(updateBody)
      toast.success("Cật nhật thông tin thành công", {duration : 2000})
      setFile(null)
    }
    catch(error){
      handleErrorApi({error,setError : form.setError})
    }
  };
  const onReset = ()=> {
    form.reset()
    setFile(null)
  }
  useEffect(()=> {
    if(data) {
      const {name,avatar} = data.payload.data
      form.reset({
        name,
        avatar : avatar ??''
      })
    }
  },[data,form])
  return (
    <form
      noValidate
      className="grid auto-rows-max items-start gap-4 md:gap-8"
      id="form-info-user"
      onSubmit={form.handleSubmit(onSubmit, (e)=> {console.log(e)})}
      onReset={onReset}
    >
      <Card x-chunk="dashboard-07-chunk-0">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <FieldGroup>
              <Controller
                control={form.control}
                name="avatar"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-25 h-25 rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">
                          {"Huong"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputAvataRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file){
                            setFile(file)
                            field.onChange("https://temp-avatar.local")
                          };
                        }}
                      />
                      <button
                        className="flex aspect-square w-25 items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => {
                          inputAvataRef.current?.click();
                        }}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
            <div className=" items-center gap-2 md:ml-auto flex">
              <Button variant="outline" size="sm" type="reset">
                Hủy
              </Button>
              <Button size="sm" type="submit" form="form-info-user">
                Lưu thông tin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
