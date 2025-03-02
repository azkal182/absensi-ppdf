'use client'
import React, { useMemo, useRef, useState } from 'react'
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
import SearchInput from '@/components/search-input'

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

export type SiswaData = {
  id: number
  name: string
  kelasId: number
  asramaId: number
  pengurusId: number
  izin: Izin
}

export type Izin = {
  id: number
  description: string
  jamKe: number[]
  startDate: Date
  endDate: null
  onlyOneDay: boolean
  izinStatus: string
}

export type SelectedAttendance = {
  kelasId?: number
  asramaId?: number
  jamKe?: number
  date?: Date
  data: { siswaId: number; status: string; jamAbsensiId?: number }[]
}

// function isDisabled(siswa:SiswaData, jamSekarang:number) {
//     // Jika izin tidak ada, tidak perlu disable
//     if (!siswa.izin) return false;

//     // Jika izin.jamKe adalah array kosong, pasti disable
//     if (siswa.izin.jamKe.length === 0) return true;

//     // Jika jamSekarang ada di dalam izin.jamKe, maka disable
//     return siswa.izin.jamKe.includes(jamSekarang);
//   }

function isDisabled(
  siswa: SiswaData,
  jamSekarang: number | undefined
): boolean {
  const jamKe = siswa.izin?.jamKe // Gunakan optional chaining untuk menangani undefined

  // Jika izin tidak ada, tidak perlu disable
  if (!siswa.izin) return false

  // Jika jamKe undefined atau array kosong, maka disable
  if (!jamKe || jamKe.length === 0) return true

  // Jika jamSekarang tidak didefinisikan, maka disable
  if (jamSekarang === undefined) return true

  // Jika jamSekarang ada dalam jamKe, maka disable
  return jamKe.includes(jamSekarang)
}

const TableData = ({ asrama }: { asrama: AsramaProps }) => {
  const [asramaId, setAsramaId] = useState<number | undefined>()
  const [loadingKelas, setLoadingKelas] = useState(false)
  const [kelas, setKelas] = useState<KelasData | []>([])
  const [siswa, setSiswa] = useState<SiswaData[]>([])
  const [dialog, setDialog] = useState(false)
  const [jamKe, setJamKe] = useState<string | undefined>()
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
  const { session } = useCurrentSession()
  const [kelasId, setKelasId] = useState<number | null>(null)

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
    setLoadingKelas(true)
    const id = parseInt(asramaId)
    try {
      setAsramaId(id)
      const result = await getClassByAsramaId(id)
      setKelas(result)
      setSiswa([])
      setSelectedAttendance((prev) => ({
        ...prev,
        asramaId: id,
        data: [],
      }))

      setLoadingKelas(false)
    } catch (error) {
      alert(error)
    }
  }

  const handleChangeKelas = async (kelasId: string) => {
    const id = parseInt(kelasId)
    try {
      const result = await getDataByKelasId(id)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setSiswa(result)
      setKelasId(id)

      const defaultAttendance = result.map((item) => ({
        siswaId: item.id,
        status: item.izin
          ? item.izin.izinStatus === 'SAKIT'
            ? 'SAKIT'
            : 'IZIN'
          : 'HADIR',
      }))

      setSelectedAttendance((prev) => ({
        ...prev,
        kelasId: id,
        asramaId: asramaId,
        // jamKe: parseInt(jamKe),
        date: new Date(new Date().setDate(new Date().getDate())),
        data: defaultAttendance,
      }))

      const test = await cekAbsensiMultiJam(id, new Date(), [1, 2, 3, 4, 5])
      setAvail(test)
      //   console.log(test)
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
        const test = await cekAbsensiMultiJam(
          kelasId!,
          new Date(),
          [1, 2, 3, 4, 5]
        )
        setAvail(test)
        setJamKe(undefined)
        setSiswa([])
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
    if (!jamKe) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Jam ke belum dipilih',
      })
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
    <div className="container mx-auto w-full p-6">
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
          <Select disabled={loadingKelas} onValueChange={handleChangeKelas}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue
                placeholder={loadingKelas ? 'Memuat kelas...' : 'Pilih Kelas'}
              />
            </SelectTrigger>
            <SelectContent>
              {kelas.length > 0 ? (
                kelas.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} - {item.teacher}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="kelas">Tidak ada kelas</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Jam</Label>
          <Select
            value={jamKe ?? ''}
            onValueChange={(val) => {
              setJamKe(val)
              enum IzinEnum {
                SAKIT = 'SAKIT',
                PULANG = 'PULANG',
              }

              const attendance = siswa.map((item) => {
                const { izin } = item
                const izinStatus = izin?.izinStatus as IzinEnum | undefined
                const jamKe = izin?.jamKe ?? [] // Jika undefined, jadikan array kosong
                const valNum = parseInt(val) // Konversi `val` ke angka

                let status: string

                if (!izinStatus) {
                  // 1. Jika tidak ada izin, maka HADIR
                  status = 'HADIR'
                } else if (jamKe.length === 0) {
                  // 2. Jika jamKe kosong, tergantung izinStatus
                  status = izinStatus === IzinEnum.SAKIT ? 'SAKIT' : 'IZIN'
                } else if (jamKe.includes(valNum)) {
                  // 3. Jika jamKe cocok dengan val, tergantung izinStatus
                  status = izinStatus === IzinEnum.SAKIT ? 'SAKIT' : 'IZIN'
                } else {
                  // 4. Jika jamKe ada tapi tidak cocok dengan val, maka HADIR
                  status = 'HADIR'
                }

                return {
                  siswaId: item.id,
                  status,
                }
              })

              setSelectedAttendance((prev) => ({
                ...prev,
                jamKe: parseInt(val),
                data: attendance,
              }))
            }}
          >
            <SelectTrigger ref={selectRef} className="w-full">
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
              <SelectItem disabled={avail[4]} value="4">
                4
              </SelectItem>
              <SelectItem disabled={avail[5]} value="5">
                5
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

      <div className="mb-4 ml-auto w-full md:max-w-[300px]">
        <SearchInput
          value={query}
          placeholder="Cari Nama"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="sticky top-0 z-10 w-full bg-background">
        <Table>
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
        </Table>
      </div>
      <Table className="overflow-hidden rounded-lg border border-gray-300">
        <TableCaption>Daftar Kehadiran Siswa</TableCaption>
        <TableBody>
          {filteredSiswa?.map((item, index) => {
            const disable = isDisabled(
              item,
              jamKe ? parseInt(jamKe) : undefined
            )
            return (
              <TableRow
                key={index}
                className={disable ? 'pointer-events-none opacity-50' : ''}
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedAttendance.data.some(
                      (att) => att.siswaId === item.id && att.status === 'HADIR'
                    )}
                    onCheckedChange={() =>
                      handleCheckboxChange(item.id, 'HADIR')
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedAttendance.data.some(
                      (att) => att.siswaId === item.id && att.status === 'IZIN'
                    )}
                    onCheckedChange={() =>
                      handleCheckboxChange(item.id, 'IZIN')
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedAttendance.data.some(
                      (att) => att.siswaId === item.id && att.status === 'SAKIT'
                    )}
                    onCheckedChange={() =>
                      handleCheckboxChange(item.id, 'SAKIT')
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedAttendance.data.some(
                      (att) => att.siswaId === item.id && att.status === 'ALFA'
                    )}
                    onCheckedChange={() =>
                      handleCheckboxChange(item.id, 'ALFA')
                    }
                  />
                </TableCell>
              </TableRow>
            )
          })}
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
