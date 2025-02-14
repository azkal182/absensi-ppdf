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
import { getAsrama, getClassByAsramaId } from '@/actions/absenAction'
import { CreateSantriInput } from '@/schemas/santriSchema'

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

interface CreateSantriModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateSantriInput) => void
}

const CreateSantriModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateSantriModalProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: '',
      asramaId: undefined as number | undefined,
      kelasId: undefined as number | undefined,
    },
  })

  const [kelas, setKelas] = useState<Kelas[]>([])
  const [asrama, setAsrama] = useState<Asrama[]>([])

  useEffect(() => {
    if (isOpen) {
      const fetchAsrama = async () => {
        try {
          const res = await getAsrama()
          setAsrama(res)
        } catch (error) {
          console.error('Error fetching Asrama:', error)
          setAsrama([]) // Hanya kosongkan asrama jika terjadi error
        }
      }
      fetchAsrama()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      reset()
      setKelas([])
    }
  }, [isOpen, reset])

  const selectedAsramaId = watch('asramaId')

  useEffect(() => {
    if (!selectedAsramaId) {
      setKelas([])
      setValue('kelasId', undefined)
      return
    }

    const fetchKelas = async () => {
      try {
        const res = await getClassByAsramaId(selectedAsramaId)
        setKelas(res)
      } catch (error) {
        console.error('Error fetching kelas:', error)
        setKelas([])
      }
    }

    fetchKelas()
  }, [selectedAsramaId, setValue])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Santri</DialogTitle>
        </DialogHeader>

        <form id="create-santri" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                {...register('name', { required: true })}
                id="name"
                placeholder="Nama Santri"
              />
            </div>

            {/* Pilihan Asrama */}
            <div>
              <Label>Asrama</Label>
              <Select
                onValueChange={(id) => {
                  const asramaId = parseInt(id)
                  setValue('asramaId', asramaId)
                  setValue('kelasId', undefined)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Asrama" />
                </SelectTrigger>
                <SelectContent>
                  {asrama?.length > 0 ? (
                    asrama.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Memuat data asrama...
                    </SelectItem>
                  )}
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
                disabled={kelas.length === 0}
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

            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSantriModal
