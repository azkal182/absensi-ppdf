// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select'
// import { Label } from '../ui/label'
// import { Button } from '../ui/button'
// import { SantriWithRelations } from '@/actions/santri'
// import { getClassByAsramaId } from '@/actions/absenAction'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'

// const FormUpdateBulkSantri = z.object({
//   id: z.array(z.number()),
//   asramaId: z.number(),
//   kelasId: z.number(),
// })
// export type Asrama = {
//   id: number
//   name: string
// }

// type Kelas = {
//   id: number
//   name: string
//   teacher: string
//   asramaId: number
// }

// interface PindahKelasBulkModalProps {
//   isOpen: boolean
//   santriIds: number[]
//   onClose: () => void
//   asrama: Asrama[]
//   onSubmit: (data: Partial<SantriWithRelations>) => void
// }

// const PindahKelasBulkModal = ({
//   isOpen,
//   onClose,
//   asrama,
//   santriIds,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   onSubmit,
// }: PindahKelasBulkModalProps) => {
//   const { handleSubmit, setValue, watch, reset } = useForm<
//     z.infer<typeof FormUpdateBulkSantri>
//   >({
//     resolver: zodResolver(FormUpdateBulkSantri),
//     defaultValues: {
//       id: santriIds,
//       asramaId: undefined,
//       kelasId: undefined,
//     },
//   })

//   const [kelas, setKelas] = useState<Kelas[]>([]) // State untuk menyimpan daftar kelas

//   const selectedAsramaId = watch('asramaId')

//   // Fetch kelas ketika asrama berubah
//   useEffect(() => {
//     if (!selectedAsramaId) {
//       setKelas([])
//       //   setValue('kelasId', undefined)
//       return
//     }

//     const fetchKelas = async () => {
//       try {
//         console.log('Fetching kelas for asramaId:', selectedAsramaId)
//         const res = await getClassByAsramaId(selectedAsramaId)
//         console.log('Fetched kelas:', res)
//         setKelas(res)
//       } catch (error) {
//         console.error('Error fetching kelas:', error)
//         setKelas([])
//       }
//     }

//     fetchKelas()
//   }, [selectedAsramaId, setValue])

//   useEffect(() => {
//     if (!isOpen) {
//       //   reset({
//       //     id: '',
//       //     asramaId: undefined,
//       //     kelasId: undefined,
//       //   })
//     }
//   }, [isOpen, reset])

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleFormSubmit = async (
//     data: z.infer<typeof FormUpdateBulkSantri>
//   ) => {
//     // console.log(data)
//     // onSubmit(data)
//     // console.log({ santriIds, selectedAsramaId, selectedKelasId })
//   }

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={() => {
//         reset({
//           id: [],
//           asramaId: undefined,
//           kelasId: undefined,
//         })
//         onClose()
//       }}
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Pindah Santri?</DialogTitle>
//         </DialogHeader>

//         <form
//           id="update-kelas-santri"
//           onSubmit={handleSubmit(handleFormSubmit)}
//         >
//           <div className="space-y-4">
//             {/* Pilihan Asrama */}
//             <div>
//               <Label>Asrama</Label>
//               <Select
//                 value={selectedAsramaId?.toString() ?? ''}
//                 onValueChange={(id) => {
//                   const asramaId = parseInt(id)
//                   setValue('asramaId', asramaId)
//                 }}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Pilih Asrama" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {asrama.map((item) => (
//                     <SelectItem key={item.id} value={item.id.toString()}>
//                       {item.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Pilihan Kelas */}
//             <div>
//               <Label>Kelas</Label>
//               <Select
//                 value={watch('kelasId')?.toString() ?? ''}
//                 onValueChange={(id) => {
//                   const kelasId = parseInt(id)
//                   if (!isNaN(kelasId)) {
//                     setValue('kelasId', kelasId)
//                   }
//                 }}
//                 disabled={kelas.length === 0} // Disable jika kelas belum tersedia
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue
//                     placeholder={
//                       kelas.length === 0 ? 'Memuat kelas...' : 'Pilih Kelas'
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {kelas.length > 0 ? (
//                     kelas.map((item) => (
//                       <SelectItem key={item.id} value={item.id.toString()}>
//                         {`${item.name} - ${item.teacher}`}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value="loading" disabled>
//                       Sedang mengambil data kelas...
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             {/* Pilihan Pengurus */}

//             <Button type="submit">Simpan</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default PindahKelasBulkModal

'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
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
import { Button } from '@/components/ui/button'
import { pindahKelasBulk } from '@/actions/santri'
import { getClassByAsramaId } from '@/actions/absenAction'
import { toast } from '@/hooks/use-toast'

// Schema validasi menggunakan Zod
const FormUpdateBulkSantri = z.object({
  id: z.array(z.number()),
  asramaId: z.number({ required_error: 'Pilih asrama terlebih dahulu' }),
  kelasId: z
    .number({ required_error: 'Pilih kelas terlebih dahulu' })
    .optional(), // kelasId opsional tetapi akan divalidasi saat submit
})

// Tipe data
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
  santriIds: number[]
  onClose: () => void
  asrama: Asrama[]
  onSubmit: () => void
}

export default function PindahKelasBulkModal({
  isOpen,
  onClose,
  asrama,
  santriIds,
  onSubmit,
}: PindahKelasBulkModalProps) {
  const [kelas, setKelas] = useState<Kelas[]>([])

  // Inisialisasi form
  const form = useForm<z.infer<typeof FormUpdateBulkSantri>>({
    resolver: zodResolver(FormUpdateBulkSantri),
    defaultValues: {
      id: santriIds,
      asramaId: undefined,
      kelasId: undefined,
    },
  })

  const selectedAsramaId = form.watch('asramaId')

  // Fetch data kelas berdasarkan asramaId dan reset kelasId
  useEffect(() => {
    if (!selectedAsramaId) {
      setKelas([])
      form.setValue('kelasId', undefined) // Reset kelasId saat asramaId kosong
      return
    }

    const fetchKelas = async () => {
      try {
        form.setValue('kelasId', undefined) // Reset kelasId saat asramaId berubah
        const res = await getClassByAsramaId(selectedAsramaId)
        setKelas(res)
      } catch (error) {
        console.error('Error fetching kelas:', error)
        setKelas([])
        form.setValue('kelasId', undefined)
      }
    }

    fetchKelas()
  }, [selectedAsramaId, form])

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        id: santriIds,
        asramaId: undefined,
        kelasId: undefined,
      })
      setKelas([])
    }
  }, [isOpen, form, santriIds])

  // Handle submit form
  const handleFormSubmit = (data: z.infer<typeof FormUpdateBulkSantri>) => {
    if (!data.kelasId) {
      form.setError('kelasId', {
        type: 'manual',
        message: 'Pilih kelas terlebih dahulu',
      })
      return
    } else {
      console.log(data)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore
      pindahKelasBulk({ data }).then((res) => {
        if (res.error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: res.error,
          })
        } else {
          toast({
            variant: 'default',
            title: 'Berhasil',
            description: `${data.id.length} Santri berhasil dipindah`,
          })
          onClose()
          onSubmit()
        }
      })
    }

    // onSubmit(data)
    // onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.reset()
        onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pindah Santri?</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Field Asrama */}
            <FormField
              control={form.control}
              name="asramaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asrama</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Asrama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asrama.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field Kelas */}
            <FormField
              control={form.control}
              name="kelasId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={kelas.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            kelas.length === 0
                              ? 'Memuat kelas...'
                              : 'Pilih Kelas'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Simpan</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
