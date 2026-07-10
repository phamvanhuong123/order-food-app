'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/modelValidation/guest.schema'
import { Field, FieldError } from '@/components/ui/field'

export default function GuestLoginForm() {
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: '',
      tableNumber: 1
    }
  })

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
  
          <form className='space-y-2 max-w-150 shrink-0 w-full' noValidate>
            <div className='grid gap-4'>
              <Controller
                control={form.control}
                name='name'
                render={({ field,fieldState }) => (
                  <Field>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                    </div>
                  </Field>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
      </CardContent>
    </Card>
  )
}
