// 'use client'

// import { ColumnDef } from '@tanstack/react-table'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../ui/dropdown-menu'
// import { Button } from '../ui/button'
// import { MoreHorizontal } from 'lucide-react'

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.
// export type Siswa = {
//   id: string
//   name: string
//   asrama: Asrama
//   kelas: Kelas
// }

// type Asrama = {
//   name: string
// }

// type Kelas = {
//   name: string
//   teacher: string
// }
// export const columns: ColumnDef<Siswa>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//   },
//   {
//     accessorKey: 'asrama.name',
//     header: 'Asrama',
//   },
//   {
//     id: 'new-class',
//     header: 'Kelas',
//     cell: ({ row }) => {
//       const santri = row.original
//       return <span>{`${santri.kelas.name} - ${santri.kelas.teacher}`}</span>
//     },
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const payment = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Pindah Kelas</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { SantriWithRelations } from '@/actions/santri'

// export type Santri = {
//   id: number
//   name: string
//   kelasId: number
//   asramaId: number
//   kelas: Kelas
//   asrama: Asrama
// }

// export type Asrama = {
//   name: string
// }

// export type Kelas = {
//   name: string
//   teacher: string
// }

type ColumnsProps = {
  onOpenModal: (siswa: SantriWithRelations) => void
}

export const getColumns = ({
  onOpenModal,
}: ColumnsProps): ColumnDef<SantriWithRelations>[] => [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'asrama.name',
    header: 'Asrama',
  },
  {
    id: 'new-class',
    header: 'Kelas',
    cell: ({ row }) => {
      const santri = row.original
      if (!santri.kelas) {
        return <span>-</span>
      }
      return <span>{`${santri.kelas.name} - ${santri.kelas.teacher}`}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const siswa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(siswa.id.toString())}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onOpenModal(siswa)}>
              Pindah Kelas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
