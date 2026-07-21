import { Role } from '@/constants/type'
import { Home, LineChart, ShoppingCart, Users2, Salad, Table } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard',
    roles : [Role.Employee,Role.Owner]
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders',
    roles : [Role.Employee,Role.Owner]

  },
  {
    title: 'Bàn ăn',
    Icon: Table,
    href: '/manage/tables',
    roles : [Role.Employee,Role.Owner]

  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes',
    roles : [Role.Employee,Role.Owner]

  },

  {
    title: 'Phân tích',
    Icon: LineChart,
    href: '/manage/analytics',
    roles : [Role.Employee,Role.Owner]

  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
    roles : [Role.Owner]

  }
]

export default menuItems
