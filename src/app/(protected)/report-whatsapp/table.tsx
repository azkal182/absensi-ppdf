'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Prisma } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  createReportWhatsapp,
  deleteReportWhatsapp,
  generatePdf,
  //   sendAbsensiReport,
  sendAbsensiReportById,
  updateReportWhatsapp,
} from '@/actions/report_whatsapp'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

const schema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    jid: z.string().optional(),
    telegramId: z.string().optional(),
    type: z.enum(['GROUP', 'PERSONAL']),
    active: z.boolean().default(false),
    whatsapp: z.boolean().default(false),
    telegram: z.boolean().default(false),
  })
  .refine((data) => !(data.whatsapp && !data.jid), {
    message: 'JID wajib diisi jika WhatsApp diaktifkan',
    path: ['jid'],
  })
  .refine((data) => !(data.telegram && !data.telegramId), {
    message: 'Telegram ID wajib diisi jika Telegram diaktifkan',
    path: ['telegramId'],
  })
  .refine((data) => data.jid || data.telegramId, {
    message: 'Salah satu dari JID atau Telegram ID harus diisi',
    path: ['jid'], // Bisa juga di path ['telegramId'], tergantung di mana ingin menampilkan error
  })
  .refine((data) => data.jid || data.telegramId, {
    message: 'Salah satu dari JID atau Telegram ID harus diisi',
    path: ['telegramId'],
  })

type FormData = z.infer<typeof schema>

const TableReport = ({ data }: { data: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] =
    useState<Prisma.ReportWhatsappSelect | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Tambahkan default values
      name: '',
      type: 'GROUP',
      active: true,
      whatsapp: false,
      telegram: false,
    },
  })

  const handleOpenModal = (item?: any) => {
    setSelectedItem(item || null)
    if (item) {
      form.reset(item) // Gunakan reset untuk sekaligus set semua nilai
    } else {
      form.reset({
        name: '',
        jid: '',
        type: 'GROUP',
        active: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    form.reset()
  }

  const handleDeleteConfirmation = (id: string) => {
    setDeleteItemId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      await deleteReportWhatsapp(deleteItemId)
      setDeleteDialogOpen(false)
      setDeleteItemId(null)
    }
  }

  const onSubmit = async (formData: FormData) => {
    if (selectedItem) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await updateReportWhatsapp(selectedItem.id, formData)
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await createReportWhatsapp(formData)
    }
    handleCloseModal()
  }

  const sentReport = async (id: number) => {
    try {
      await sendAbsensiReportById(id)
      toast({
        title: 'Sukses',
        description: 'Data berhasil dikirim',
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Data Gagal dikirim',
      })
    }
  }

  //   const sentAllReport = async () => {
  //     try {
  //       await sendAbsensiReport()
  //       toast({
  //         title: 'Sukses',
  //         description: 'Data berhasil dikirim',
  //       })
  //     } catch (error: any) {
  //       toast({
  //         variant: 'destructive',
  //         title: 'Gagal',
  //         description: error,
  //       })
  //     }
  //   }

  const sentAllReport = async () => {
    await generatePdf()
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Report Whatsapp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end space-x-4">
            <Button variant={'secondary'} onClick={() => sentAllReport()}>
              Kirim Laporan
            </Button>
            <Button onClick={() => handleOpenModal()}>Add</Button>
          </div>
          <Table>
            <TableCaption>A list of your recent reports.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>NAMA</TableHead>
                <TableHead>TIPE</TableHead>
                <TableHead>JID</TableHead>
                <TableHead>TELEGRAM_ID</TableHead>
                <TableHead>WHATSAPP</TableHead>
                <TableHead>TELEGRAM</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.jid}</TableCell>
                  <TableCell>{item.telegramId}</TableCell>
                  <TableCell>
                    {item.whatsapp ? (
                      <span className="rounded-full bg-green-500 px-1.5 py-1 text-xs text-white">
                        aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-destructive px-1.5 py-1 text-xs text-white">
                        tidak
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.telegram ? (
                      <span className="rounded-full bg-green-500 px-1.5 py-1 text-xs text-white">
                        aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-destructive px-1.5 py-1 text-xs text-white">
                        tidak
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => handleOpenModal(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteConfirmation(item.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      disabled={!(item.whatsapp || item.telegram)}
                      size="sm"
                      variant="outline"
                      onClick={() => sentReport(item.id)}
                    >
                      Kirim
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Data' : 'Add Data'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JID</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        placeholder="JID"
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegramId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram ID</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        placeholder="Telegram id"
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GROUP">GROUP</SelectItem>
                        <SelectItem value="PERSONAL">PERSONAL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whatsapp</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'true')
                      }
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'true')
                      }
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <Button
                  size={'sm'}
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button size={'sm'} type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TableReport
