'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import {
  getAsrama,
  getClassByAsramaId,
  getDaftarAbsen,
  getDataByKelasId,
  getKelasById,
} from '@/actions/absenAction'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KelasData } from '../absensi/tableData'
import { Label } from '@/components/ui/label'

const statusIcons = {
  HADIR: <CheckCircle className="mx-auto h-4 w-4 text-green-500" />,
  SAKIT: <AlertCircle className="mx-auto h-4 w-4 text-yellow-500" />,
  IZIN: <HelpCircle className="mx-auto h-4 w-4 text-blue-500" />,
  ALFA: <XCircle className="mx-auto h-4 w-4 text-red-500" />,
}

export default function AbsensiTable() {
  const [weeks, setWeeks] = useState<
    { week: number; days: { date: number; dayName: string }[] }[]
  >([])
  const [asrama, setAsrama] = useState<
    | {
        id: number
        name: string
      }[]
    | []
  >([])
  const [absensi, setAbsensi] = useState([])
  const [kelas, setKelas] = useState<KelasData | []>([])

  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(
    // Default: Bulan dan tahun saat ini
    `${new Date().toLocaleString('id-ID', {
      month: 'long',
    })} ${new Date().getFullYear()}`
  )

  // Fungsi untuk menghasilkan daftar bulan dan tahun
  const generateMonthYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const options: string[] = []

    // Loop untuk 5 tahun ke belakang dan 5 tahun ke depan
    for (let year = currentYear - 1; year <= currentYear + 5; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthName = new Date(year, month - 1).toLocaleString('id-ID', {
          month: 'long',
        })
        options.push(`${monthName} ${year}`)
      }
    }

    return options
  }

  // Parse bulan dan tahun dari string yang dipilih
  const [selectedMonth, selectedYear] = selectedMonthYear.split(' ')
  const monthIndex =
    new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1
  const yearNumber = parseInt(selectedYear)

  useEffect(() => {
    const days = new Date(yearNumber, monthIndex, 0).getDate()

    let currentWeek: { date: number; dayName: string }[] = []
    let weekCounter = 1
    const weeklyData: {
      week: number
      days: { date: number; dayName: string }[]
    }[] = []

    const formatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' })

    for (let day = 1; day <= days; day++) {
      const date = new Date(yearNumber, monthIndex - 1, day)
      const dayOfWeek = date.getDay()
      const dayName = formatter.format(date)

      // Kecualikan Selasa (2) & Jumat (5)
      if (dayOfWeek !== 2 && dayOfWeek !== 5) {
        currentWeek.push({ date: day, dayName })
      }

      // Jika hari Sabtu atau hari terakhir dalam bulan, buat minggu baru
      if (dayOfWeek === 6 || day === days) {
        weeklyData.push({ week: weekCounter, days: [...currentWeek] })
        currentWeek = []
        weekCounter++
      }
    }

    setWeeks(weeklyData)
    fetchAsrama()
  }, [selectedMonthYear])

  const fetchAsrama = async () => {
    const data = await getAsrama()
    setAsrama(data)
  }

  const handleChangeAsrama = async (asramaId: string) => {
    const id = parseInt(asramaId)
    try {
      const result = await getClassByAsramaId(id)
      setKelas(result)
    } catch (error) {
      alert(error)
    }
  }

  const handleChangeKelas = async (kelasId: string) => {
    try {
      const data = await getDaftarAbsen(parseInt(kelasId), 2025, 1)
      setAbsensi(data)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label>Asrama</Label>
          <Select onValueChange={handleChangeAsrama}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih Asrama" />
            </SelectTrigger>
            <SelectContent>
              {asrama?.map((item, index) => (
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
          <Label>Bulan & Tahun</Label>
          <Select
            value={selectedMonthYear}
            onValueChange={(value) => setSelectedMonthYear(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Bulan & Tahun" />
            </SelectTrigger>
            <SelectContent>
              {generateMonthYearOptions().map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {weeks.map(({ week, days }) => (
        <Card key={week} className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Minggu {week}</h2>
          <Table className="overflow-x-auto">
            <TableHeader>
              <TableRow className="bg-gray-200 text-sm text-gray-700">
                <TableHead rowSpan={2} className="border p-2 text-center">
                  No
                </TableHead>
                <TableHead rowSpan={2} className="text-nowrap border p-2">
                  Nama
                </TableHead>
                {days.map(({ date, dayName }) => (
                  <TableHead
                    key={date}
                    colSpan={3}
                    className="border p-2 text-center"
                  >
                    {dayName} ({date})
                  </TableHead>
                ))}
              </TableRow>

              <TableRow className="bg-gray-200 text-sm text-gray-700">
                {days.flatMap(({ date }) => [
                  <TableHead
                    key={`day-${date}-1`}
                    className="border p-2 text-center"
                  >
                    1
                  </TableHead>,
                  <TableHead
                    key={`day-${date}-2`}
                    className="border p-2 text-center"
                  >
                    2
                  </TableHead>,
                  <TableHead
                    key={`day-${date}-3`}
                    className="border p-2 text-center"
                  >
                    3
                  </TableHead>,
                ])}
              </TableRow>
            </TableHeader>

            <TableBody>
              {absensi.map((siswa, index) => (
                <TableRow key={siswa.id}>
                  <TableCell className="border p-2 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-nowrap border p-2">
                    {siswa.name}
                  </TableCell>

                  {days.flatMap(({ date }) => {
                    const absensiForDay = siswa.absensi[date] || []

                    const availableHours = [1, 2, 3]

                    return availableHours.map((hour) => {
                      const entry = absensiForDay.find(
                        (entry) => entry.jamKe === hour
                      )

                      return (
                        <TableCell
                          key={`day-${date}-${hour}`}
                          className="border p-2 text-center"
                        >
                          {entry ? statusIcons[entry.status] : '-'}
                        </TableCell>
                      )
                    })
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  )
}
