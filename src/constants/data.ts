import { NavItem } from '@/types'

export type Product = {
  photo_url: string
  name: string
  description: string
  created_at: string
  price: number
  id: number
  category: string
  updated_at: string
}

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Absensi',
    url: '/absensi',
    icon: 'listCheck',
    isActive: false,
    items: [],
  },
  {
    title: 'Daftar Absensi',
    url: '/daftar',
    icon: 'listChecks',
    isActive: false,
    items: [],
  },
]

export const navIzins: NavItem[] = [
  {
    title: 'Izin Asrama',
    url: '/izin-asrama',
    icon: 'housePlus',
    isActive: false,
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Izin Keamanan',
    url: '/izin-keamanan',
    icon: 'listChecks',
    isActive: false,
    items: [],
  },
  {
    title: 'Izin Kesehatan',
    url: '/izin-kesehatan',
    icon: 'stethoscope',
    isActive: false,
    items: [],
  },
  {
    title: 'Izin Komdis',
    url: '/izin-komdis',
    icon: 'shield',
    isActive: false,
    items: [],
  },
]

export const navMasters: NavItem[] = [
  {
    title: 'Validasi Absen',
    url: '/validasi-absen',
    icon: 'housePlus',
    isActive: false,
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Import',
    url: '/import',
    icon: 'listChecks',
    isActive: false,
    items: [],
  },
  {
    title: 'Data',
    url: '/data',
    icon: 'stethoscope',
    isActive: false,
    items: [],
  },
  {
    title: 'Users',
    url: '/users',
    icon: 'users',
    isActive: false,
    items: [],
  },
  {
    title: 'Laporan Whatsapp',
    url: '/report-whatsapp',
    icon: 'receiptPoundSterlingIcon',
    isActive: false,
    items: [],
  },
]

export interface SaleUser {
  id: number
  name: string
  email: string
  amount: string
  image: string
  initials: string
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM',
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL',
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN',
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK',
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD',
  },
]
