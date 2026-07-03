import http from "@/lib/http";
import {
  AccountIdParamType,
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/modelValidation/account.schema";

const prefix = "/accounts";
const me = () => {
  return http.get<AccountResType>(`${prefix}/me`);
};
//Test trường hợp gọi bên server nên phải tự config header
const sMe = (accessToken: string) => {
  return http.get<AccountResType>(`${prefix}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
const updateMe = (body: UpdateMeBodyType) => {
  return http.put<AccountResType>(`${prefix}/me`, body);
};
const changePasswordMe = (body: ChangePasswordBodyType) => {
  return http.put<AccountResType>(`${prefix}/change-password`, body);
};

const getListAccountEmployee = () => {
  return http.get<AccountListResType>(`${prefix}/`);
};

const createAccountEmployee = (body: CreateEmployeeAccountBodyType) => {
  return http.post<AccountResType>(`${prefix}/`, body);
};
const getDetailAccountEmployee = ({ id }: AccountIdParamType) => {
  return http.get<AccountResType>(`${prefix}/detail/${id}`);
};
const updateDetailAccountEmployee = (id : number,body : UpdateEmployeeAccountBodyType) => {
  return http.put<AccountResType>(`${prefix}/detail/${id}`,body)
}
const deleteAccountEmployee = (id : number) => {
  return http.delete<AccountResType>(`${prefix}/detail/${id}`)

}
export const accountApiRequest = {
  me,
  sMe,
  updateMe,
  changePasswordMe,
  getListAccountEmployee,
  createAccountEmployee,
  getDetailAccountEmployee,
  updateDetailAccountEmployee,
  deleteAccountEmployee
};
