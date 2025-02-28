'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { updateIzinDepartemen } from '@/actions/izin'

interface DeleteButtonProps {
  item: any
  title: string
}

export default function UpdateIzinButton({ item, title }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  console.log(item)

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await updateIzinDepartemen(item.id)
      if (result.success) {
        toast({ title: 'Data berhasil diupdate', variant: 'default' })
        setOpen(false)
      } else {
        toast({ title: result.message, variant: 'destructive' })
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Update</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah data {item?.siswa?.name} akan di update?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'updating...' : 'Ya, Update'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
