import http from "@/lib/http"
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/modelValidation/account.schema"

const me = ()=> {
  return http.get<AccountResType>('/accounts/me')
}
const updateMe = (body : UpdateMeBodyType)=> {
  return http.put<AccountResType>('/accounts/me',body)
}
const changePasswordMe = (body : ChangePasswordBodyType)=> {
  return http.put<AccountResType>('accounts/change-password',body)
}
export const accountApiRequest = {
  me,
  updateMe,
  changePasswordMe
}