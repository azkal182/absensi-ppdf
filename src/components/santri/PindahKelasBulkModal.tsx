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
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { SantriWithRelations } from '@/actions/santri'
import { getClassByAsramaId } from '@/actions/absenAction'

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

interface PindahKelasBulkModalProps {
  isOpen: boolean
  asramaIds: number[]
  onClose: () => void
  asrama: Asrama[]
  onSubmit: (data: Partial<SantriWithRelations>) => void
}

const PindahKelasBulkModal = ({
  isOpen,
  onClose,
  asrama,
  asramaIds,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
}: PindahKelasBulkModalProps) => {
  const { handleSubmit, setValue, watch, reset } = useForm<
    Partial<SantriWithRelations>
  >({
    defaultValues: {
      name: '',
      asramaId: undefined,
      kelasId: undefined,
    },
  })

  const [kelas, setKelas] = useState<Kelas[]>([]) // State untuk menyimpan daftar kelas

  const selectedAsramaId = watch('asramaId')

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

  useEffect(() => {
    if (!isOpen) {
      reset({
        name: '',
        asramaId: undefined,
        kelasId: undefined,
      })
    }
  }, [isOpen, reset])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFormSubmit = async (data: Partial<SantriWithRelations>) => {
    // onSubmit(data)
    console.log(asramaIds)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        reset({
          name: '',
          asramaId: undefined,
          kelasId: undefined,
        })
        onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pindah Santri?</DialogTitle>
        </DialogHeader>

        <form
          id="update-kelas-santri"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="space-y-4">
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

            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PindahKelasBulkModal
