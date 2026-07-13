import { CartOrder } from "@/app/guest/orders/cart-orders";


export default async function OrdersPage() {
  return (
    <div className='max-w-100 mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>Đơn hàng</h1>
        <CartOrder/>
    </div>
  )
}
