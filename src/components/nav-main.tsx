// 'use client'

// import {
//   BoxIcon,
//   ReceiptPoundSterlingIcon,
//   SearchCheck,
//   Upload,
//   UsersIcon,
//   type LucideIcon,
// } from 'lucide-react'

// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from '@/components/ui/sidebar'
// import Link from 'next/link'

// export function NavMain({
//   items,
//   role,
// }: {
//   items: {
//     name: string
//     url: string
//     icon: LucideIcon
//   }[]
//   role: any
// }) {
//   const { setOpenMobile } = useSidebar()

//   return (
//     <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//       <SidebarGroupLabel>Absensi</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           <SidebarMenuItem key={item.name}>
//             <SidebarMenuButton asChild>
//               <Link href={item.url} onClick={() => setOpenMobile(false)}>
//                 <item.icon />
//                 <span>{item.name}</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         ))}
//       </SidebarMenu>
//       {role === 'ADMIN' ||
//         (role === 'USER' && <SidebarGroupLabel>Master</SidebarGroupLabel>)}
//       {role === 'ADMIN' ||
//         (role === 'USER' && (
//           <SidebarMenu>
//             {role === 'ADMIN' ||
//               (role === 'USER' && (
//                 <SidebarMenuItem>
//                   <SidebarMenuButton asChild>
//                     <Link
//                       href={'/validasi-absen'}
//                       onClick={() => setOpenMobile(false)}
//                     >
//                       <SearchCheck />
//                       <span>Validaasi Absen</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             {role === 'ADMIN' && (
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href={'/import'} onClick={() => setOpenMobile(false)}>
//                     <Upload />
//                     <span>Import</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )}
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild>
//                 <Link href={'/data'} onClick={() => setOpenMobile(false)}>
//                   <BoxIcon />
//                   <span>Data</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>

//             {role === 'ADMIN' && (
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href={'/users'} onClick={() => setOpenMobile(false)}>
//                     <UsersIcon />
//                     <span>Users</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )}
//             {role === 'ADMIN' && (
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link
//                     href={'/report-whatsapp'}
//                     onClick={() => setOpenMobile(false)}
//                   >
//                     <ReceiptPoundSterlingIcon />
//                     <span>Laporan Whatsapp</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )}
//           </SidebarMenu>
//         ))}
//     </SidebarGroup>
//   )
// }

'use client'

import {
  BoxIcon,
  HousePlus,
  ReceiptPoundSterlingIcon,
  SearchCheck,
  Shield,
  ShieldEllipsis,
  Stethoscope,
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
  role: string
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Absensi */}
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
      <SidebarGroupLabel>Perizinan</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={'/izin-asrama'} onClick={() => setOpenMobile(false)}>
              <HousePlus />
              <span>Izin Asrama</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={'/izin-keamanan'} onClick={() => setOpenMobile(false)}>
              <ShieldEllipsis />
              <span>Izin Keamanan</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={'/izin-kesehatan'} onClick={() => setOpenMobile(false)}>
              <Stethoscope />
              <span>Izin Kesehatan</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={'/izin-komdis'} onClick={() => setOpenMobile(false)}>
              <Shield />
              <span>Izin Komdis</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Master Section - Hanya untuk ADMIN dan USER */}
      {['ADMIN', 'USER'].includes(role) && (
        <>
          <SidebarGroupLabel>Master</SidebarGroupLabel>
          <SidebarMenu>
            {/* Validasi Absen - Hanya untuk ADMIN dan USER */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/validasi-absen"
                  onClick={() => setOpenMobile(false)}
                >
                  <SearchCheck />
                  <span>Validasi Absen</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Import - Hanya untuk ADMIN */}
            {role === 'ADMIN' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/import" onClick={() => setOpenMobile(false)}>
                    <Upload />
                    <span>Import</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Data - Bisa diakses oleh semua peran */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/data" onClick={() => setOpenMobile(false)}>
                  <BoxIcon />
                  <span>Data</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Users - Hanya untuk ADMIN */}
            {role === 'ADMIN' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/users" onClick={() => setOpenMobile(false)}>
                    <UsersIcon />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Laporan WhatsApp - Hanya untuk ADMIN */}
            {role === 'ADMIN' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/report-whatsapp"
                    onClick={() => setOpenMobile(false)}
                  >
                    <ReceiptPoundSterlingIcon />
                    <span>Laporan Whatsapp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </>
      )}
    </SidebarGroup>
  )
}
