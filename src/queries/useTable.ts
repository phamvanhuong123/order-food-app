import { tableApiRequest } from "@/apiRequest/table"
import { UpdateTableBodyType } from "@/modelValidation/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useListTable = ()=> {
  return useQuery({
    queryKey : ['tables'],
    queryFn : tableApiRequest.list
  })
}
export const useDetailTable = (number : number)=> {
  return useQuery({
    queryKey : ['tables',number],
    queryFn : ()=> tableApiRequest.detail(number),
    enabled : !!number,
     staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
export const useCreateTableMutation= ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : tableApiRequest.create,
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['tables']
      })
    }
  })
}
export const useUpdateTableMutation = ()=> {
   const queryClient = useQueryClient()
  return useMutation({
    mutationFn : ({number,...updateBody} : UpdateTableBodyType & {number : number})=> tableApiRequest.update(number,updateBody),
    onSuccess : (_, variables)=> {
      queryClient.invalidateQueries({
        queryKey : ['tables'],
        exact : true
      })
       queryClient.invalidateQueries({
        queryKey : ['tables',variables.number],
        
      })
    }
  })
}
export const useDeleteTableMutation = (number : number)=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : ()=> tableApiRequest.remove(number),
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['tables'],
        exact : true
      })
  
    }
  })
}