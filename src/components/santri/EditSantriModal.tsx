import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { SantriWithRelations } from '@/actions/santri'
import { getClassByAsramaId } from '@/actions/absenAction'
import { getPengurus } from '@/actions/pengurus'
import { Pengurus } from '@prisma/client'

export type Asrama = {
  id: number
  name: string
}

type Kelas = {
  id: number
  name: string
  teacher: string
  asramaId: number
}

interface EditSantriModalProps {
  isOpen: boolean
  onClose: () => void
  santri?: SantriWithRelations
  asrama: Asrama[]
  onSubmit: (data: Partial<SantriWithRelations>) => void
}

const EditSantriModal = ({
  isOpen,
  onClose,
  santri,
  asrama,
  onSubmit,
}: EditSantriModalProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<
    Partial<SantriWithRelations>
  >({
    defaultValues: {
      name: '',
      asramaId: undefined,
      kelasId: undefined,
      pengurusId: santri?.pengurusId,
    },
  })

  const [kelas, setKelas] = useState<Kelas[]>([]) // State untuk menyimpan daftar kelas
  const [pengurus, setPengurus] = useState<Pengurus[]>([])

  // Set default values ketika santri tersedia
  useEffect(() => {
    if (santri) {
      setValue('name', santri.name || '')
      setValue('asramaId', santri.asramaId || undefined)
      setValue('kelasId', santri.kelasId || undefined)
    }
  }, [santri, setValue])

  const selectedAsramaId = watch('asramaId')

  useEffect(() => {
    const loadPengurus = async () => {
      try {
        const res = await getPengurus()
        setPengurus(res)
      } catch (error) {
        console.error('Error fetching kelas:', error)
        setKelas([])
      }
    }
    loadPengurus()
  }, [])

  // Fetch kelas ketika asrama berubah
  useEffect(() => {
    if (!selectedAsramaId) {
      setKelas([])
      setValue('kelasId', undefined)
      return
    }

    const fetchKelas = async () => {
      try {
        console.log('Fetching kelas for asramaId:', selectedAsramaId)
        const res = await getClassByAsramaId(selectedAsramaId)
        console.log('Fetched kelas:', res)
        setKelas(res)
      } catch (error) {
        console.error('Error fetching kelas:', error)
        setKelas([])
      }
    }

    fetchKelas()
  }, [selectedAsramaId, setValue])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        reset({
          name: '',
          asramaId: undefined,
          kelasId: undefined,
          pengurusId: santri?.pengurusId,
        })
        onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Santri?</DialogTitle>
        </DialogHeader>

        <form id="update-kelas-santri" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input {...register('name')} id="name" readOnly disabled />
            </div>

            {/* Pilihan Asrama */}
            <div>
              <Label>Asrama</Label>
              <Select
                value={selectedAsramaId?.toString() ?? ''}
                onValueChange={(id) => {
                  const asramaId = parseInt(id)
                  setValue('asramaId', asramaId)
                  setValue('kelasId', undefined) // Reset kelas saat asrama berubah
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Asrama" />
                </SelectTrigger>
                <SelectContent>
                  {asrama.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pilihan Kelas */}
            <div>
              <Label>Kelas</Label>
              <Select
                value={watch('kelasId')?.toString() ?? ''}
                onValueChange={(id) => {
                  const kelasId = parseInt(id)
                  if (!isNaN(kelasId)) {
                    setValue('kelasId', kelasId)
                  }
                }}
                disabled={kelas.length === 0} // Disable jika kelas belum tersedia
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      kelas.length === 0 ? 'Memuat kelas...' : 'Pilih Kelas'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {kelas.length > 0 ? (
                    kelas.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {`${item.name} - ${item.teacher}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Sedang mengambil data kelas...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Pilihan Pengurus */}
            <div>
              <Label>Pengurus</Label>
              <Select
                value={watch('pengurusId')?.toString() ?? ''}
                onValueChange={(id) => {
                  console.log('Selected pengurusId:', id)
                  const pengurusId = id === 'null' ? null : parseInt(id) // Handle null value
                  setValue('pengurusId', pengurusId)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Pengurus" />
                </SelectTrigger>
                <SelectContent>
                  {/* Menambahkan pilihan null */}
                  <SelectItem value="null">Tidak Pengurus</SelectItem>

                  {pengurus.length > 0 ? (
                    pengurus.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Memuat pengurus...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditSantriModal
