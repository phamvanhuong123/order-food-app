import http from "@/lib/http"
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/modelValidation/dish.schema"

const prefix = '/dishes'

const list = ()=> {
  return http.get<DishListResType>(`${prefix}/`)
}
const detail = (id : number ) => {
    return http.get<DishResType>(`${prefix}/${id}`)
}
const create = (body : CreateDishBodyType)=> {
    return http.post<DishResType>(`${prefix}`,body)
}
const update = (id : number,body : UpdateDishBodyType)=> {
    return http.put<DishResType>(`${prefix}/${id}`,body)
}
const remove = (id : number ) => {
    return http.delete<DishResType>(`${prefix}/${id}`)
}
export const dishApiRequest = {
  list,
  create,
  detail,
  update,
  remove
}