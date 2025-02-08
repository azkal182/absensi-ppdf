'use client'

import {
  BoxIcon,
  ReceiptPoundSterlingIcon,
  Upload,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavMain({
  items,
  role,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  role: any
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Absensi</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url} onClick={() => setOpenMobile(false)}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Master</SidebarGroupLabel>
      <SidebarMenu>
        {role === 'ADMIN' && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/import'} onClick={() => setOpenMobile(false)}>
                <Upload />
                <span>Import</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={'/data'} onClick={() => setOpenMobile(false)}>
              <BoxIcon />
              <span>Data</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {role === 'ADMIN' && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/users'} onClick={() => setOpenMobile(false)}>
                <UsersIcon />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {role === 'ADMIN' && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={'/report-whatsapp'}
                onClick={() => setOpenMobile(false)}
              >
                <ReceiptPoundSterlingIcon />
                <span>Laporan Whatsapp</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
