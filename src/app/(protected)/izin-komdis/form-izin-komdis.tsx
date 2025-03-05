/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSantriByName } from '@/actions/santri'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createIzin } from '@/actions/izin'
import { useCurrentSession } from '@/hooks/useCurrentUser'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function FormIzinKomdis() {
  const { session } = useCurrentSession()
  const [searchValue, setSearchValue] = useState('')
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSantri, setSelectedSantri] = useState<any | null>(null)
  const [izin, setIzin] = useState('')
  const [openJam, setOpenJam] = useState(false)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]) // Mulai dengan array kosong

  const handleValueChange = (values: number[]) => {
    setSelectedNumbers(values)
  }
  const { data, isLoading } = useQuery({
    queryKey: ['santri', searchValue],
    queryFn: () => getSantriByName(searchValue, false),
    // enabled: !!searchValue, // Query hanya berjalan saat ada input
  })

  const handleSubmit = async () => {
    try {
      await createIzin({
        data: {
          description: 'komdis',
          jamKe: [],
          onlyOneDay: false,
          izinStatus: 'PULANG',
          siswaId: selectedSantri.id,
          userId: session!.user!.id as any,
          komdis: true,
        },
      })
      toast.success('Izin berhasil dibuat')
      setModalOpen(false)
    } catch (error) {
      // toast("'Error creating izin:')
      toast.error('Izin gagal dibuat')
    }
  }

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Tambah</Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen} modal={false}>
        {modalOpen && <div className="fixed inset-0 z-40 bg-black/75" />}

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Izin KBM</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search" className="text-right">
                Cari
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="col-span-3 w-full justify-between"
                  >
                    {selectedSantri ? selectedSantri.name : 'Pilih santri...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-44 w-full overflow-y-auto p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      id="search"
                      placeholder="Cari santri..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      {isLoading ? (
                        <div className="py-2 text-center text-sm">
                          Memuat...
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>Tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {data?.map((santri) => (
                              <CommandItem
                                key={santri.id}
                                value={santri.id.toString()}
                                onSelect={() => {
                                  setSelectedSantri(santri)
                                  console.log(santri)

                                  setSelectedSantriId(santri.id)
                                  setTimeout(() => setOpen(false), 100) // Agar tidak bentrok dengan fokus
                                  setSearchValue('')
                                }}
                              >
                                {santri.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={selectedSantri?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kelas" className="text-right">
                Kelas
              </Label>
              <Input
                id="kelas"
                value={selectedSantri?.kelas.name}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wali-kelas" className="text-right">
                Wali kelas
              </Label>
              <Input
                id="wali-kelas"
                value={selectedSantri?.kelas.teacher}
                className="col-span-3"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} type="submit">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FormIzinKomdis
