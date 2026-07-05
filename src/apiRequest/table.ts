import http from "@/lib/http"
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from "@/modelValidation/table.schema"

const prefix =  '/tables'
const list = ()=> {
  return http.get<TableListResType>(`${prefix}`)
}
const detail = (number : number) => {
  return http.get<TableResType>(`${prefix}/${number}`)
}
const create = (body : CreateTableBodyType) => {
  return http.post<TableResType>(`${prefix}`,body)
}
const update = (number : number, body : UpdateTableBodyType) => {
  return http.put<TableResType>(`${prefix}/${number}`,body)
}
const remove = (number : number) => {
  return http.delete<TableResType>(`${prefix}/${number}`)
}
export const tableApiRequest = {
  list,
  detail,
  create,
  update,
  remove
}