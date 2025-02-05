'use client'

import * as React from 'react'
import { LayoutDashboard, ListCheck, ListChecks, Skull } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { TeamSwitcher } from './team-switcher'
import { useCurrentSession } from '@/hooks/useCurrentUser'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  projects: [
    {
      name: 'Dahsboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Absensi',
      url: '/absensi',
      icon: ListCheck,
    },
    {
      name: 'Daftar Absensi',
      url: '/daftar',
      icon: ListChecks,
    },
    {
      name: 'Pelanggaran',
      url: '/pelanggaran',
      icon: Skull,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useCurrentSession()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name as unknown as string,
            email: session?.user?.username as unknown as string,
            avatar: '/avatars/shadcn.jpg',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
