import { accountApiRequest } from "@/apiRequest/account";
import {
  AccountIdParamType,
  UpdateEmployeeAccountBodyType,
} from "@/modelValidation/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useListEmployee = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApiRequest.getListAccountEmployee,
  });
};
export const useDetailEmployee = ({ id }: AccountIdParamType) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequest.getDetailAccountEmployee({ id }),
    enabled : !!id
  });
};
export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.createAccountEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...updateData
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateDetailAccountEmployee(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
        exact : true
      });
    },
  });
};

export const useDeleteAccountMutation = ()=> {
  const queryClient =  useQueryClient()
  return useMutation({
    mutationFn : ({id} : {id : number})=> accountApiRequest.deleteAccountEmployee(id),
    onSuccess : ()=> {
      queryClient.invalidateQueries({
        queryKey : ['accounts']
      })
    }
  })
}
