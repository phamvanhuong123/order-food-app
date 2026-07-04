import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { handleErrorApi } from "@/lib/utils"
import { DishListResType } from "@/modelValidation/dish.schema"
import { useDeleteDishMutation } from "@/queries/useDish"
import { toast } from "sonner"

type DishItem = DishListResType['data'][0]
export function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete
}: {
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}) {
  const {mutateAsync} = useDeleteDishMutation()
  const onDelete =async ()=> {
    try{
      if(dishDelete?.id){
        const result = await mutateAsync({id : dishDelete.id as number})
        toast.success(result.payload.message,{duration : 2000})
        setDishDelete(null)
      }
    }
    catch(error){
      handleErrorApi({error})
    }
  }
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món <span className='bg-foreground text-primary-foreground rounded px-1'>{dishDelete?.name}</span> sẽ bị xóa
            vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}