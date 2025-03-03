'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Schema validasi dengan Zod
const KelasSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  teacher: z.string().min(1, 'Nama pengajar wajib diisi'),
  asramaId: z.number().int().positive(),
})

type KelasFormData = z.infer<typeof KelasSchema>

type EditKelasModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: KelasFormData) => void
  initialData?: KelasFormData
  asramaList: {
    id: number
    name: string
  }[]
}

const EditKelasModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  asramaList,
}: EditKelasModalProps) => {
  const isEditMode = !!initialData
  console.log('initialData:', initialData)

  const form = useForm<KelasFormData>({
    resolver: zodResolver(KelasSchema),
    defaultValues: {
      name: '',
      teacher: '',
      asramaId: undefined,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset(initialData) // Mode edit
      } else {
        form.reset({ name: '', teacher: '' }) // Mode create
      }
    }
  }, [isOpen, initialData, form])

  const handleSubmit = (data: KelasFormData) => {
    try {
      onSubmit(data)
      // Jangan panggil onClose di sini, biarkan handleSubmit di induk yang menutup
    } catch (error) {
      console.error('Error during submit:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Kelas' : 'Tambah Kelas'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Ubah detail kelas di sini.'
              : 'Tambahkan kelas baru di sini.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Nama Kelas</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Masukkan nama kelas"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Pengajar</FormLabel>
                  <FormControl>
                    <Input
                      id="teacher"
                      placeholder="Masukkan nama pengajar"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asramaId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Asrama</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value))
                    }}
                    defaultValue={
                      field.value ? field.value.toString() : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Pilih Asrama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asramaList.map((asrama) => (
                        <SelectItem
                          key={asrama.id}
                          value={asrama.id.toString()}
                        >
                          {asrama.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditKelasModal
