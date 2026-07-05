import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { handleErrorApi } from "@/lib/utils"
import { TableListResType } from "@/modelValidation/table.schema"
import { useDeleteTableMutation } from "@/queries/useTable"
import { toast } from "sonner"

type TableItem = TableListResType['data'][0]
 export function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}) {
  const deleteTableMutation = useDeleteTableMutation(tableDelete?.number as number)
  const onDelete =async ()=>{
    try {
      const res= await deleteTableMutation.mutateAsync()
      toast.success(res.payload.message,{duration : 2000})
      setTableDelete(null)

    } catch (error) {
      handleErrorApi({error})
    }
  }
  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn <span className='bg-foreground text-primary-foreground rounded px-1'>{tableDelete?.number}</span> sẽ bị
            xóa vĩnh viễn
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