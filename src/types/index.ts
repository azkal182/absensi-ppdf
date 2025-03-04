import { Icons } from '@/components/icons'

export type Siswa = {
  id: number
  name: string
}

export type Kelas = {
  id: number
  name: string
  teacher: string
  students: Siswa[]
}

export type Asrama = {
  id: number
  name: string
  classes: Kelas[]
}

export type Absensi = {
  siswaId: number
  status: 'Hadir' | 'Tidak Hadir'
}

export interface NavItem {
  title: string
  url: string
  disabled?: boolean
  external?: boolean
  shortcut?: [string, string]
  icon?: keyof typeof Icons
  label?: string
  description?: string
  isActive?: boolean
  items?: NavItem[]
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
