'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getClassByAsramaId,
  getDaftarAbsenTodayByKelasId,
  updateDataAbsen,
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
import { Label } from '@/components/ui/label'
import SearchInput from '@/components/search-input'
import { format, toZonedTime } from 'date-fns-tz'
import { id } from 'date-fns/locale'
import { useCurrentSession } from '@/hooks/useCurrentUser'
import { toast } from 'sonner'

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
  jamAbsensiId: number
  name: string
  kelasId: number
}[]

export type SelectedAttendance = {
  kelasId?: number
  asramaId?: number
  jamKe?: number
  date?: Date
  data: { jamAbsensiId: number; siswaId: number; status: string }[]
}

const TableData = ({ asrama }: { asrama: AsramaProps }) => {
  const [asramaId, setAsramaId] = useState<number | undefined>()
  const [kelas, setKelas] = useState<KelasData | []>([])
  const [siswa, setSiswa] = useState<SiswaData | []>([])
  const [dialog, setDialog] = useState(false)
  const [jamKe, setJamKe] = useState<string | undefined>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avail, setAvail] = useState<Record<number, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
  })
  const selectRef = useRef<HTMLButtonElement | null>(null)
  const [selectedAttendance, setSelectedAttendance] =
    useState<SelectedAttendance>({
      kelasId: undefined,
      asramaId: undefined,
      jamKe: 1,
      date: undefined,
      data: [],
    })
  const [query, setQuery] = useState('')
  const { session, status } = useCurrentSession()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [kelasId, setKelasId] = useState<number | null>(null)
  const [countdown, setCountdown] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [listJam, setListJam] = useState<any[]>([])
  const [globalData, setGlobalData] = useState<any>([])

  useEffect(() => {
    if (status === 'loading') return
    const timeZone = 'Asia/Jakarta'

    const updateCountdown = () => {
      const now = toZonedTime(new Date(), timeZone)
      const target = new Date(now)
      target.setHours(17, 0, 0, 0)

      const diff = target.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown('Waktu habis')
        if (session?.user?.role !== 'ADMIN') {
          setIsDisabled(true)
        }
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(`${hours}:${minutes}:${seconds}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [session?.user?.role, status])
  const handleCheckboxChange = (
    jamAbsensiId: number,
    siswaId: number,
    status: string
  ) => {
    setSelectedAttendance((prev) => {
      const updatedData = prev.data.filter((item) => item.siswaId !== siswaId)
      console.log(updatedData)

      updatedData.push({ siswaId, status, jamAbsensiId })

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
    setKelasId(id)
    setJamKe(undefined)
    try {
      const data = await getDaftarAbsenTodayByKelasId(id)
      console.log(id, data)

      if (Array.isArray(data)) {
        const listJamArray = [
          ...new Set(
            data.flatMap((item: any) => item.data.map((d: any) => d.jamKe))
          ),
        ]

        setListJam(listJamArray)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setSiswa(data)

        // const defaultAttendance = data?.data.map((item: any) => ({
        //   siswaId: item.id,
        //   status: 'HADIR',
        // }))

        // console.log(JSON.stringify(data, null, 2))
        setGlobalData(data)

        setSelectedAttendance((prev) => ({
          ...prev,
          kelasId: id,
          asramaId: asramaId,
          // jamKe: parseInt(jamKe), // Gunakan nilai jamKe yang sudah ada
          //   date: new Date(new Date().setDate(new Date().getDate())),
          //   data: defaultAttendance,
        }))
      }
    } catch (error) {
      alert(error)
    }
  }

  const findByJamKe = (data: any, jamKe: any) => {
    return data
      .map((siswa: any) => {
        const statusData = siswa.data.find((d: any) => d.jamKe === jamKe)
        return statusData
          ? {
              siswaId: siswa.id,
              status: statusData.status,
              jamAbsensiId: statusData.jamAbsensiId,
            }
          : null
      })
      .filter(Boolean) // Menghapus nilai null jika tidak ada data yang sesuai
  }
  const handleChangeJam = (jam: number) => {
    const filterData = findByJamKe(globalData, jam)
    const mappedData = siswa.map((item: any) => {
      const matchingData = filterData.find(
        (data: any) => data.siswaId === item.id
      )

      return {
        ...item,
        jamAbsensiId: matchingData ? matchingData.jamAbsensiId : null,
      }
    })

    setSiswa(mappedData)

    setSelectedAttendance((prev) => ({
      ...prev,
      jamKe: jam,
      date: new Date(new Date().setDate(new Date().getDate())),
      data: filterData,
    }))
  }

  const countStatus = (status: string) => {
    return selectedAttendance.data.filter((item) => item.status === status)
      .length
  }

  const handleSubmit = async () => {
    try {
      if (!selectedAttendance.jamKe) {
        toast.error('Jam ke belum dipilih')
        return
      }

      const response = await updateDataAbsen(selectedAttendance)

      if (!response.success) {
        toast.error(response.message)
      } else {
        setDialog(false)
        toast.success('Data Absensi berhasil di update')
        setJamKe(undefined)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Gagal menyimpan data')
    }
  }

  const handleConfirm = async () => {
    if (!jamKe) {
      toast.error('Jam ke belum dipilih')
      selectRef.current?.focus()

      return
    }
    if (selectedAttendance.data.length > 0 && jamKe) {
      setDialog(true)
    }
  }

  const handleSearch = (query: string) => {
    setQuery(query)
  }

  const filteredSiswa = useMemo(() => {
    return siswa.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [siswa, query])

  return (
    <>
      {' '}
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Validasi Absensi Santri PPDF</h1>
        <h1 className="font-semibold">
          {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
        </h1>
        <p className="mt-2 text-lg">Sisa Waktu Validasi: {countdown}</p>
      </div>
      <div
        className={`container mx-auto w-full p-6 ${isDisabled && 'pointer-events-none opacity-50'}`}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label>Asrama</Label>
            <Select onValueChange={handleChangeAsrama}>
              <SelectTrigger className="w-full">
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
              <SelectTrigger className="w-full">
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
              value={jamKe ?? ''}
              onValueChange={(val) => {
                setJamKe(val)
                handleChangeJam(parseInt(val))
                setSelectedAttendance((prev) => ({
                  ...prev,
                  jamKe: parseInt(val),
                }))
              }}
            >
              <SelectTrigger ref={selectRef} className="w-full">
                <SelectValue placeholder="Jam Ke" />
              </SelectTrigger>
              <SelectContent>
                {listJam.length > 0 ? (
                  listJam?.map((jam) => (
                    <SelectItem key={jam} value={jam}>
                      {jam}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value={'0'}>
                    belum ada absen hari ini
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-6 rounded-lg p-4 shadow-md">
          <div className="">
            <h3 className="text-center text-lg font-semibold">
              Rekap Kehadiran
            </h3>
            {selectedAttendance.kelasId && (
              <h3 className="mb-2 text-center text-lg font-semibold">
                {asrama.find((a) => a.id === selectedAttendance.asramaId)?.name}{' '}
                - {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name}{' '}
                -{' '}
                {
                  kelas.find((k) => k.id === selectedAttendance.kelasId)
                    ?.teacher
                }
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

        <div className="mb-4 ml-auto w-full md:max-w-[300px]">
          <SearchInput
            value={query}
            placeholder="Cari Nama"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Table className="overflow-hidden rounded-lg border">
          <TableCaption>Daftar Kehadiran Siswa</TableCaption>
          <TableHeader className="">
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
            {jamKe &&
              filteredSiswa?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedAttendance.data.some(
                        (att) =>
                          att.siswaId === item.id && att.status === 'HADIR'
                      )}
                      onCheckedChange={() =>
                        handleCheckboxChange(
                          item.jamAbsensiId,
                          item.id,
                          'HADIR'
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedAttendance.data.some(
                        (att) =>
                          att.siswaId === item.id && att.status === 'IZIN'
                      )}
                      onCheckedChange={() =>
                        handleCheckboxChange(item.jamAbsensiId, item.id, 'IZIN')
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedAttendance.data.some(
                        (att) =>
                          att.siswaId === item.id && att.status === 'SAKIT'
                      )}
                      onCheckedChange={() =>
                        handleCheckboxChange(
                          item.jamAbsensiId,
                          item.id,
                          'SAKIT'
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedAttendance.data.some(
                        (att) =>
                          att.siswaId === item.id && att.status === 'ALFA'
                      )}
                      onCheckedChange={() =>
                        handleCheckboxChange(item.jamAbsensiId, item.id, 'ALFA')
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <Button className="ml-auto" onClick={handleConfirm}>
            Simpan
          </Button>
        </div>

        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apakah data sudah benar?</DialogTitle>
            </DialogHeader>
            <div>
              {selectedAttendance.kelasId && (
                <h3 className="mb-2 font-semibold">
                  {
                    asrama.find((a) => a.id === selectedAttendance.asramaId)
                      ?.name
                  }{' '}
                  -{' '}
                  {kelas.find((k) => k.id === selectedAttendance.kelasId)?.name}{' '}
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
    </>
  )
}

export default TableData
