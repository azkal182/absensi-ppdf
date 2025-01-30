'use client'

import * as React from 'react'
import { ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react'

export function TeamSwitcher() {
  return (
    <div className="flex space-x-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">PPDF</span>
        <span className="truncate text-xs">Absensi</span>
      </div>
      <ChevronsUpDown className="ml-auto" />
    </div>
  )
}
