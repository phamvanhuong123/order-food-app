import { accountApiRequest } from "@/apiRequest/account"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAccountMe = ()=> {
  return useQuery({
    queryKey : ['account-me'],
    queryFn : accountApiRequest.me
  })
}

export const useUpdateAccountMe = ()=> {
  const queryClient = useQueryClient()


  return useMutation({
    mutationFn : accountApiRequest.updateMe,
    onSuccess  : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['account-me']
      })
    }
  })
}