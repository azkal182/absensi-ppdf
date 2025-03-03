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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import PindahKelasBulkModal from './PindahKelasBulkModal'

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onCreate: () => void
  onUpdateBulk: () => void
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  onCreate,
  onUpdateBulk,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [asramaList, setAsramaList] = useState<any[]>([])
  const [kelasList, setKelasList] = useState<any[]>([])
  const [selectedAsrama, setSelectedAsrama] = useState<string | null>(null)
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null)
  const [PindahKelasBulkOpen, setPindahKelasBulkOpen] = useState(false)

  const closeModalPindahKelas = () => {
    setPindahKelasBulkOpen(false)
  }
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
  useEffect(() => {
    setSelectedKelas(null)
  }, [selectedAsrama])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id.toString(),
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
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        {/* Filter Section */}
        <div className="w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
            <Input
              placeholder="Filter Nama..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="w-full md:w-60"
            />
            <Select onValueChange={setSelectedAsrama}>
              <SelectTrigger className="w-full md:w-40">
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
              <SelectTrigger className="w-full md:w-40">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant={'outline'}
              onClick={() => setPindahKelasBulkOpen(true)}
            >
              {table.getFilteredSelectedRowModel().rows.length} Santri Pindah
              kelas
            </Button>
          )}
          <Button onClick={() => setOpenModalCreate(true)}>Create</Button>
        </div>
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
      {/* <div>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
      </div> */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-y-4 px-2">
        {/* Bagian kiri: Jumlah row terpilih */}
        <div className="w-full text-center text-sm text-muted-foreground sm:w-auto sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* Bagian kanan: Pagination Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
          {/* Dropdown jumlah row per halaman */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informasi Halaman */}
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>

          {/* Tombol Navigasi */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      <PindahKelasBulkModal
        isOpen={PindahKelasBulkOpen}
        santriIds={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => Number(row.id))}
        onClose={closeModalPindahKelas}
        asrama={asramaList}
        // reset checkbox
        onSubmit={() => {
          onUpdateBulk()
          table.resetRowSelection()
        }}
      />

      <CreateSantriModal
        isOpen={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
