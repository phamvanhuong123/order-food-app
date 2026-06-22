import http from "@/lib/http"
import { AccountResType, UpdateMeBodyType } from "@/modelValidation/account.schema"

const me = ()=> {
  return http.get<AccountResType>('/accounts/me')
}
const updateMe = (body : UpdateMeBodyType)=> {
  return http.put<AccountResType>('/accounts/me',body)
}
export const accountApiRequest = {
  me,
  updateMe
}