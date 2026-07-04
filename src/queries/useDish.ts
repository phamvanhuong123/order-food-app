import { dishApiRequest } from "@/apiRequest/dish"
import { DishParamsType, UpdateDishBodyType } from "@/modelValidation/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useListDish = ()=> {
  return useQuery({
    queryKey : ['dishs'],
    queryFn :  dishApiRequest.getListDish
  })
}
export const useDetailDish = ({id} : DishParamsType) => {
    return useQuery({
    queryKey : ['dishs',id],
    queryFn :  () => dishApiRequest.getDetailDish(id)
  })
}
export const useCreateDish = ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : dishApiRequest.createDish,
    onSuccess : ()=> { 
      queryClient.invalidateQueries({
        queryKey : ['dishs']
      })
    }
  })
}
export const useUpdateDish = ()=> {
   const queryClient = useQueryClient()
  return useMutation({
    mutationFn : ({id,...updateData} : UpdateDishBodyType & {id : number} )=> dishApiRequest.updateDish(id,updateData),
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['dishs'],
        exact : true
      })
    }
  })
}
export const useDeleteAccountMutation = ()=> {
  const queryClient =  useQueryClient()
  return useMutation({
    mutationFn : ({id} : DishParamsType)=> dishApiRequest.deleteDish(id),
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['dishs']
      })
    }
  })
}
