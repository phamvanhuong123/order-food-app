import { dishApiRequest } from "@/apiRequest/dish"
import { DishParamsType, UpdateDishBodyType } from "@/modelValidation/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useListDish = ()=> {
  return useQuery({
    queryKey : ['dishs'],
    queryFn :  dishApiRequest.list
  })
}
export const useDetailDish = ({id} : DishParamsType) => {
    return useQuery({
    queryKey : ['dishs',id],
    queryFn :  () => dishApiRequest.detail(id),
    enabled : !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
export const useCreateDishMutation = ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : dishApiRequest.create,
    onSuccess : ()=> { 
      queryClient.invalidateQueries({
        queryKey : ['dishs']
      })
    }
  })
}
export const useUpdateDishMutation = ()=> {
   const queryClient = useQueryClient()
  return useMutation({
    mutationFn : ({id,...updateData} : UpdateDishBodyType & {id : number} )=> dishApiRequest.update(id,updateData),
    onSuccess : (_, variables)=> {
      queryClient.invalidateQueries({
        queryKey : ['dishs'],
        exact : true
      })
       queryClient.invalidateQueries({
        queryKey : ['dishs',variables.id],
        
        
      })
    }
  })
}
export const useDeleteDishMutation = ()=> {
  const queryClient =  useQueryClient()
  return useMutation({
    mutationFn : ({id} : DishParamsType)=> dishApiRequest.remove(id),
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['dishs']
      })
    }
  })
}
