import http from "@/lib/http"
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/modelValidation/account.schema"

const me = ()=> {
  return http.get<AccountResType>('/accounts/me')
}
//Test trường hợp gọi bên server nên phải tự config header
const sMe = (accessToken : string)=> {
  return http.get<AccountResType>('/accounts/me',{
    headers : {
      Authorization : `Bearer ${accessToken}`
    }
  })

}
const updateMe = (body : UpdateMeBodyType)=> {
  return http.put<AccountResType>('/accounts/me',body)
}
const changePasswordMe = (body : ChangePasswordBodyType)=> {
  return http.put<AccountResType>('accounts/change-password',body)
}
export const accountApiRequest = {
  me,
  sMe,
  updateMe,
  changePasswordMe
}