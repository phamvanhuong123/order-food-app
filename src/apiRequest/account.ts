import http from "@/lib/http"
import { AccountResType } from "@/modelValidation/account.schema"

const me = ()=> {
  return http.get<AccountResType>('/accounts/me')
}

export const accountApiRequest = {
  me
}