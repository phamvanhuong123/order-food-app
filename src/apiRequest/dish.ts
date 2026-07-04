import http from "@/lib/http"
import { CreateDishBodyType, DishListResType, UpdateDishBodyType } from "@/modelValidation/dish.schema"

const prefix = '/dishes'

const getListDish = ()=> {
  return http.get<DishListResType>(`${prefix}/`)
}
const getDetailDish = (id : number ) => {
    return http.get<DishListResType>(`${prefix}/${id}`)
}
const createDish = (body : CreateDishBodyType)=> {
    return http.post<DishListResType>(`${prefix}/`,body)
}
const updateDish = (id : number,body : UpdateDishBodyType)=> {
    return http.put<DishListResType>(`${prefix}/${id}`,body)
}
const deleteDish = (id : number ) => {
    return http.delete<DishListResType>(`${prefix}/${id}`)
}
export const dishApiRequest = {
  getListDish,
  createDish,
  getDetailDish,
  updateDish,
  deleteDish
}