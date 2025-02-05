'use client'
import { useEffect, useState } from 'react'

// import { Card } from '@/components/ui/card'
import { getAsrama, getDaftarAlfa } from '@/actions/absenAction'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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

  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(
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
      if (dayOfWeek !== 5) {
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

    console.log(absensi)
  }, [selectedMonthYear, absensi, monthIndex, yearNumber])
  console.log(weeks)

  const fetchAsrama = async () => {
    const data = await getAsrama()

    setAsrama(data)
  }

  const handleChangeAsrama = async (asramaId: string) => {
    const id = parseInt(asramaId)
    try {
      const data = await getDaftarAlfa(id, 2025, 2)
      console.log(data)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
      {/* {weeks.map(({ week, days }) => (
        <Card key={week} className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Minggu {week}</h2>
        </Card>
      ))} */}
    </div>
  )
}
