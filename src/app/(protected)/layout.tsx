import type { Metadata } from 'next'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// import { AppSidebar } from '@/components/app-sidebar'
import { cookies } from 'next/headers'
import KBar from '@/components/kbar'
import Header from '@/components/layout/header'
import AppSidebar from '@/components/layout/app-sidebar'

export const metadata: Metadata = {
  title: 'SIGAP',
  description: 'Sistem Digital Absensi PPDF',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    //     <header className="flex h-16 shrink-0 items-center gap-2 border-b">
    //       <div className="flex items-center gap-2 px-3">
    //         <SidebarTrigger />
    //         <Separator orientation="vertical" className="mr-2 h-4" />
    //         <Breadcrumb>
    //           <BreadcrumbList>
    //             <BreadcrumbItem className="hidden md:block">
    //               <BreadcrumbLink href="#">APP</BreadcrumbLink>
    //             </BreadcrumbItem>
    //             <BreadcrumbSeparator className="hidden md:block" />
    //             <BreadcrumbItem>
    //               <BreadcrumbPage>Absensi Digital PPDF</BreadcrumbPage>
    //             </BreadcrumbItem>
    //           </BreadcrumbList>
    //         </Breadcrumb>
    //       </div>
    //     </header>
    //     <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    //   </SidebarInset>
    // </SidebarProvider>
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
