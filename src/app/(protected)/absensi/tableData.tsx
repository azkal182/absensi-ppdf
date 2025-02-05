'use client'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  cekAbsensiMultiJam,
  getClassByAsramaId,
  getDataByKelasId,
  saveData,
} from '@/actions/absenAction'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useCurrentSession } from '@/hooks/useCurrentUser'
import { Label } from '@/components/ui/label'

export type AsramaProps = {
  name: string
  id: number
}[]

export type KelasData = {
  id: number
  name: string
  teacher: string
  asramaId: number
}[]

type SiswaData = {
  id: number
  name: string
  kelasId: number
}[]

export type SelectedAttendance = {
  kelasId?: number
  asramaId?: number
  jamKe?: number
  date?: Date
  data: { siswaId: number; status: string }[]
}

const TableData = ({ asrama }: { asrama: AsramaProps }) => {
  const [asramaId, setAsramaId] = useState<number | undefined>()
  const [kelas, setKelas] = useState<KelasData | []>([])
  const [siswa, setSiswa] = useState<SiswaData | []>([])
  const [dialog, setDialog] = useState(false)
  const [jamKe, setJamKe] = useState<string>('1')
  const [avail, setAvail] = useState<Record<number, boolean>>({
    '1': true,
    '2': true,
    '3': true,
  })
  const [selectedAttendance, setSelectedAttendance] =
    useState<SelectedAttendance>({
      kelasId: undefined,
      asramaId: undefined,
      jamKe: 1,
      date: undefined,
      data: [],
    })
  const { session } = useCurrentSession()

  const { toast } = useToast()

  const handleCheckboxChange = (siswaId: number, status: string) => {
    setSelectedAttendance((prev) => {
      const updatedData = prev.data.filter((item) => item.siswaId !== siswaId)
      updatedData.push({ siswaId, status })

      return {
        ...prev,
        data: updatedData,
      }
    })
  }

  const handleChangeAsrama = async (asramaId: string) => {
    const id = parseInt(asramaId)
    try {
      setAsramaId(id)
      const result = await getClassByAsramaId(id)
      setKelas(result)
      setSelectedAttendance((prev) => ({
        ...prev,
        asramaId: id,
      }))
    } catch (error) {
      alert(error)
    }
  }

  const handleChangeKelas = async (kelasId: string) => {
    const id = parseInt(kelasId)
    try {
      const result = await getDataByKelasId(id)
      setSiswa(result)

      const defaultAttendance = result.map((item) => ({
        siswaId: item.id,
        status: 'HADIR',
      }))

      setSelectedAttendance((prev) => ({
        ...prev,
        kelasId: id,
        asramaId: asramaId,
        jamKe: parseInt(jamKe), // Gunakan nilai jamKe yang sudah ada
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        data: defaultAttendance,
      }))

      const test = await cekAbsensiMultiJam(id, new Date(), [1, 2, 3])
      setAvail(test)
      console.log(test)
    } catch (error) {
      alert(error)
    }
  }

  const countStatus = (status: string) => {
    return selectedAttendance.data.filter((item) => item.status === status)
      .length
  }

  const handleSubmit = async () => {
    try {
      if (!selectedAttendance.jamKe) {
        toast({
          title: 'Error',
          description: 'Jam ke belum dipilih',
        })
        return
      }

      const response = await saveData(
        selectedAttendance,
        parseInt(session?.user?.id as unknown as string)
      )

      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message,
        })
      } else {
        setDialog(false)
        toast({
          title: 'Sukses',
          description: 'Data berhasil disimpan',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan data',
      })
    }
  }

  const handleConfirm = async () => {
    if (selectedAttendance.data.length > 0 && jamKe) {
      setDialog(true)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label>Asrama</Label>
          <Select onValueChange={handleChangeAsrama}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih Asrama" />
            </SelectTrigger>
            <SelectContent>
              {asrama.map((item, index) => (
                <SelectItem key={index} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Kelas</Label>
          <Select onValueChange={handleChangeKelas}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {kelas.map((item, index) => (
                <SelectItem key={index} value={item.id.toString()}>
                  {item.name} - {item.teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Jam</Label>
          <Select
            value={jamKe}
            onValueChange={(val) => {
              setJamKe(val)
              setSelectedAttendance((prev) => ({
                ...prev,
                jamKe: parseInt(val),
              }))
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Jam Ke" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={avail[1]} value="1">
                1
              </SelectItem>
              <SelectItem disabled={avail[2]} value="2">
                2
              </SelectItem>
              <SelectItem disabled={avail[3]} value="3">
                3
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="my-6 rounded-lg bg-gray-100 p-4 shadow-md">
        <div className="">
          <h3 className="text-center text-lg font-semibold">Rekap Kehadiran</h3>
          {selectedAttendance.kelasId && (
            <h3 className="mb-2 text-center text-lg font-semibold">
              {asrama.find((a) => a.id === selectedAttendance.asramaId)?.name} -{' '}
              {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name} -{' '}
              {kelas.find((k) => k.id === selectedAttendance.kelasId)?.teacher}
            </h3>
          )}
        </div>

        <ul className="grid grid-cols-2 gap-2 md:grid-cols-5">
          <li>Total: {siswa.length}</li>
          <li>Hadir: {countStatus('HADIR')}</li>
          <li>Izin: {countStatus('IZIN')}</li>
          <li>Sakit: {countStatus('SAKIT')}</li>
          <li>Alfa: {countStatus('ALFA')}</li>
        </ul>
      </div>

      <Table className="overflow-hidden rounded-lg border border-gray-300">
        <TableCaption>Daftar Kehadiran Siswa</TableCaption>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="md:w-16">Hadir</TableHead>
            <TableHead className="md:w-16">Izin</TableHead>
            <TableHead className="md:w-16">Sakit</TableHead>
            <TableHead className="md:w-16">Alfa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {siswa?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === 'HADIR'
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, 'HADIR')}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === 'IZIN'
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, 'IZIN')}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === 'SAKIT'
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, 'SAKIT')}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedAttendance.data.some(
                    (att) => att.siswaId === item.id && att.status === 'ALFA'
                  )}
                  onCheckedChange={() => handleCheckboxChange(item.id, 'ALFA')}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleConfirm}>Submit</Button>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah data sudah benar?</DialogTitle>
          </DialogHeader>
          <div>
            {selectedAttendance.kelasId && (
              <h3 className="mb-2 font-semibold">
                {asrama.find((a) => a.id === selectedAttendance.asramaId)?.name}{' '}
                - {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name}{' '}
                -{' '}
                {
                  kelas.find((k) => k.id === selectedAttendance.kelasId)
                    ?.teacher
                }
              </h3>
            )}
            <ul className="grid grid-cols-3">
              <li>Total: {siswa.length}</li>
              <li>Hadir: {countStatus('HADIR')}</li>
              <li>Izin: {countStatus('IZIN')}</li>
              <li>Sakit: {countStatus('SAKIT')}</li>
              <li>Alfa: {countStatus('ALFA')}</li>
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                setDialog(false)
              }}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TableData
