// 'use client'

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from '@tanstack/react-table'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Button } from '../ui/button'
// import { useState } from 'react'
// import { Input } from '../ui/input'
// import CreateSantriModal from './CreateSantriModal'
// import { createSantri } from '@/actions/santri'
// import { toast } from '@/hooks/use-toast'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { getAsrama, getClassByAsramaId } from '@/actions/absenAction'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   onCreate: () => void
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   onCreate,
// }: DataTableProps<TData, TValue>) {
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [openModalCreate, setOpenModalCreate] = useState(false)
//   const [asramaList, setAsramaList] = useState<any[]>([])
//   const [kelasList, setKelasList] = useState<any[]>([])

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       columnFilters,
//     },
//   })

//   const handleCreate = async (data: any) => {
//     await createSantri(data)
//     setOpenModalCreate(false)
//     toast({
//       title: 'berhasil',
//       description: 'Santri Berhasil Dibuat',
//     })
//     onCreate()
//   }

//   const getAsramaList = async () => {
//     const res = await getAsrama()
//     setAsramaList(res)
//   }

//   const getKelasList = async (asramaId: number) => {
//     const res = await getClassByAsramaId(asramaId)
//     setKelasList(res)
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between py-4">
//         <div>
//           <div className="flex items-center space-x-4">
//             <Input
//               placeholder="Filter Nama..."
//               value={
//                 (table.getColumn('name')?.getFilterValue() as string) ?? ''
//               }
//               onChange={(event) =>
//                 table.getColumn('name')?.setFilterValue(event.target.value)
//               }
//               className="max-w-sm"
//             />
//             <div>
//               <Select>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select asrama" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="id">asrama.name</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Select>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select Kelas" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="id">kelas.name</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//         <div>
//           <Button onClick={() => setOpenModalCreate(true)}>Create</Button>
//         </div>
//       </div>
//       <div className="rounded-md border">
//         <Table className="w-full overflow-auto">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && 'selected'}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>

//       <CreateSantriModal
//         isOpen={openModalCreate}
//         onClose={() => setOpenModalCreate(false)}
//         onSubmit={handleCreate}
//       />
//     </div>
//   )
// }

'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import CreateSantriModal from './CreateSantriModal'
import { createSantri } from '@/actions/santri'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAsrama, getClassByAsramaId } from '@/actions/absenAction'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onCreate: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCreate,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [asramaList, setAsramaList] = useState<any[]>([])
  const [kelasList, setKelasList] = useState<any[]>([])
  const [selectedAsrama, setSelectedAsrama] = useState<string | null>(null)
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null)

  useEffect(() => {
    getAsramaList()
  }, [])

  useEffect(() => {
    if (selectedAsrama) {
      getKelasList(parseInt(selectedAsrama))
    } else {
      setKelasList([])
    }
  }, [selectedAsrama])

  useEffect(() => {
    const filters: ColumnFiltersState = []
    if (selectedAsrama)
      filters.push({ id: 'asramaId', value: selectedAsrama.toString() })
    if (selectedKelas)
      filters.push({ id: 'kelasId', value: selectedKelas.toString() })
    console.log(filters)

    setColumnFilters(filters)
  }, [selectedAsrama, selectedKelas])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      columnVisibility: {
        asramaId: false,
        kelasId: false,
      },
    },
  })

  const handleCreate = async (data: any) => {
    await createSantri(data)
    setOpenModalCreate(false)
    toast({
      title: 'berhasil',
      description: 'Santri Berhasil Dibuat',
    })
    onCreate()
  }

  const getAsramaList = async () => {
    const res = await getAsrama()
    setAsramaList(res)
  }

  const getKelasList = async (asramaId: number) => {
    const res = await getClassByAsramaId(asramaId)
    setKelasList(res)
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Filter Nama..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Select onValueChange={setSelectedAsrama}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select asrama" />
              </SelectTrigger>
              <SelectContent>
                {asramaList.map((asrama) => (
                  <SelectItem key={asrama.id} value={asrama.id.toString()}>
                    {asrama.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedKelas} disabled={!selectedAsrama}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Kelas" />
              </SelectTrigger>
              <SelectContent>
                {kelasList.map((kelas) => (
                  <SelectItem key={kelas.id} value={kelas.id.toString()}>
                    {kelas.name} - {kelas.teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setOpenModalCreate(true)}>Create</Button>
      </div>
      <div className="rounded-md border">
        <Table className="w-full overflow-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <CreateSantriModal
        isOpen={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
