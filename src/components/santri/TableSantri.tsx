'use client'

import React, { useEffect, useState } from 'react'
import { getColumns } from './column'
import { DataTable } from './DataTable'
import EditSantriModal from './EditSantriModal'
import { getAsrama } from '@/actions/absenAction'
import {
  getAllSantri,
  SantriWithRelations,
  updateSantri,
} from '@/actions/santri'
import { toast } from '@/hooks/use-toast'
import { Card } from '../ui/card'

export type Asrama = {
  id: number
  name: string
}

export type Kelas = {
  id: number
  name: string
  teacher: string
  asramaId: number
}

const TableSantri = () => {
  const [selectedSiswa, setSelectedSiswa] =
    useState<SantriWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [asrama, setAsrama] = useState<Asrama[]>([])
  const [santris, setSantris] = useState<SantriWithRelations[]>()
  const openModal = (siswa: SantriWithRelations) => {
    setSelectedSiswa(siswa)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSiswa(null)
  }

  const loadSantri = async () => {
    const santri = await getAllSantri()
    setSantris(santri)
  }

  useEffect(() => {
    const fetchAsrama = async () => {
      try {
        const res = await getAsrama()
        setAsrama(res)
      } catch (error) {
        console.error('Error fetching asrama:', error)
      }
    }
    fetchAsrama()
    loadSantri()
  }, [])

  const columns = getColumns({
    onOpenModal: openModal,
  })

  const handleCreate = async (data: any) => {
    if (!selectedSiswa) return
    await updateSantri(selectedSiswa.id, data)
    closeModal()
    await loadSantri()
    toast({
      title: 'berhasil',
      description: 'Santri Berhasil diupdate',
    })
  }
  return (
    <div>
      <Card className="p-4">
        <DataTable
          onCreate={loadSantri}
          columns={columns}
          data={santris ?? []}
        />
      </Card>

      <EditSantriModal
        isOpen={isModalOpen}
        santri={selectedSiswa || undefined}
        onClose={closeModal}
        asrama={asrama}
        onSubmit={handleCreate}
      />
    </div>
  )
}

export default TableSantri
