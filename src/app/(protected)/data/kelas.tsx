'use client'

import {
  createKelas,
  getKelas,
  KelasWithRelations,
  updateKelas,
} from '@/actions/kelas'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clipboard, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import EditKelasModal from './edit-kelas-modal'
import { toast } from '@/hooks/use-toast'
import { getAsrama } from '@/actions/absenAction'
import KelasModal from './kelas-modal'

type Kelas = {
  id: number
  name: string
  teacher: string
  asramaId: number
}

const KelasComponent = () => {
  const [kelasList, setKelasList] = useState<KelasWithRelations[]>([])
  const [asramaList, setAsramaList] = useState<
    {
      id: number
      name: string
    }[]
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)

  const fetchKelas = async () => {
    const data = await getKelas()
    data.sort((a, b) => a.asrama.name.localeCompare(b.asrama.name))
    console.log(data)
    setKelasList(data)
  }
  const fetchAsrama = async () => {
    const data = await getAsrama()
    setAsramaList(data)
  }

  useEffect(() => {
    fetchKelas()
    fetchAsrama()
  }, [])

  const openCreateModal = () => {
    setSelectedKelas(null)
    setIsModalOpen(true)
  }

  const openEditModal = (kelas: Kelas) => {
    setSelectedKelas(kelas)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: {
    id?: number
    name: string
    teacher: string
    asramaId: number
  }) => {
    if (selectedKelas && data.id) {
      // Mode Edit: Update data yang ada
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore
      await updateKelas(data)

      toast({
        title: 'Berhasil',
        description: 'Kelas berhasil diperbarui',
      })
      fetchKelas()
    } else {
      // Mode Create: Tambah data baru
      createKelas(data).then((data) => {
        if (data.error) {
          toast({
            title: 'Gagal',
            variant: 'destructive',
            description: 'Kelas Gagal dibuat',
          })
        }
      })
      toast({
        title: 'Berhasil',
        description: 'Kelas berhasil dibuat',
      })
      fetchKelas()
    }
    closeModal() // Panggil closeModal untuk konsistensi
  }

  const closeModal = () => {
    console.log('Closing modal, isModalOpen:', isModalOpen)
    setIsModalOpen(false)
    setSelectedKelas(null)
    console.log('Modal closed, isModalOpen:', isModalOpen)
    // Tambahkan timeout untuk memeriksa state setelah render berikutnya
    setTimeout(
      () => console.log('After render, isModalOpen:', isModalOpen),
      1000
    )
  }

  return (
    <Card className="p-4">
      <Button onClick={openCreateModal}>Tambah Kelas</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Asrama</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Wali Kelas</TableHead>
            <TableHead>Jumlah Santri</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kelasList.map((kelas, index) => (
            <TableRow key={kelas.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{kelas.asrama.name}</TableCell>
              <TableCell>{kelas.name}</TableCell>
              <TableCell>{kelas.teacher}</TableCell>
              <TableCell>{kelas._count?.Siswas || 0}</TableCell>
              <TableCell>
                <Button size={'sm'} onClick={() => openEditModal(kelas)}>
                  Edit
                </Button>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(kelas.id.toString())
                      }
                    >
                      <Clipboard className="mr-0.5 h-4 w-4" />
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openCreateModal()}>
                      <Pencil className="mr-0.5 h-4 w-4" />
                      Edit Kelas
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash className="mr-0.5 h-4 w-4 text-red-500" />
                      Hapus Kelas
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditKelasModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        asramaList={asramaList}
        initialData={
          selectedKelas
            ? {
                id: selectedKelas.id,
                name: selectedKelas.name,
                teacher: selectedKelas.teacher,
                asramaId: selectedKelas.asramaId,
              }
            : undefined
        }
      />
      {/* <KelasModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        asramaList={asramaList}
        defaultValues={
          selectedKelas
            ? {
                name: selectedKelas.name,
                teacher: selectedKelas.teacher,
                asramaId: selectedKelas.asramaId,
              }
            : undefined
        }
      /> */}
    </Card>
  )
}

export default KelasComponent
