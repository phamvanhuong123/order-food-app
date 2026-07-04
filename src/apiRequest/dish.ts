import http from "@/lib/http"
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/modelValidation/dish.schema"

const prefix = '/dishes'

const getListDish = ()=> {
  return http.get<DishListResType>(`${prefix}/`)
}
const getDetailDish = (id : number ) => {
    return http.get<DishResType>(`${prefix}/${id}`)
}
const createDish = (body : CreateDishBodyType)=> {
    return http.post<DishResType>(`${prefix}`,body)
}
const updateDish = (id : number,body : UpdateDishBodyType)=> {
    return http.put<DishResType>(`${prefix}/${id}`,body)
}
const deleteDish = (id : number ) => {
    return http.delete<DishResType>(`${prefix}/${id}`)
}
export const dishApiRequest = {
  getListDish,
  createDish,
  getDetailDish,
  updateDish,
  deleteDish
}