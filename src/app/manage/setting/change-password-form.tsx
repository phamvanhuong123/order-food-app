'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Controller, useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/modelValidation/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = ()=> {
    toast("Successful")
  }
  return (
  
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='form-password' onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <Controller
                control={form.control}
                name='oldPassword'
                render={({ field,fieldState }) => (
                  <Field>
                    <div className='grid gap-3'>
                      <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
                      <Input id='oldPassword' type='password' className='w-full' {...field} />
                      {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />)}
                    </div>
                     
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='password'
                render={({ field,fieldState }) => (
                  <Field>
                    <div className='grid gap-3'>
                      <Label htmlFor='password'>Mật khẩu mới</Label>
                      <Input id='password' type='password' className='w-full' {...field} />
                      {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />)}
                    </div>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='confirmPassword'
                render={({ field,fieldState }) => (
                  <Field>
                    <div className='grid gap-3'>
                      <Label htmlFor='confirmPassword'>Nhập lại mật khẩu mới</Label>
                      <Input id='confirmPassword' type='password' className='w-full' {...field} />
                         {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />)}
                    </div>
                  </Field>
                )}
              />
              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm'>
                  Hủy
                </Button>
                <Button size='sm' form='form-password'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
  )
}
