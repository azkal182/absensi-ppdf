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

import { addMonths, format, subDays } from 'date-fns'

import DateRangeSelector from '@/components/DateRangeSelector'

export default function AbsensiTable() {
  const today = new Date()

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
  const [date, setDate] = useState<Date>(new Date())
  const [absensi, setAbsensi] = useState([])

  const formattedDate = format(new Date(date), 'PPP')

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
        <div>
          <Select
            value={date as any}
            onValueChange={(val) => {
              setDate(val as any)
              console.log(val)
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Date">
                {formattedDate}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={today.toISOString()}>Today</SelectItem>
              <SelectItem value={subDays(today, 3).toISOString()}>
                3 Days Ago
              </SelectItem>
              <SelectItem value={subDays(today, 7).toISOString()}>
                A Week Ago
              </SelectItem>

              {/* Menambahkan pilihan bulan ke depan secara dinamis */}
              {[...Array(6)].map((_, index) => {
                const monthDate = addMonths(today, index + 1)
                return (
                  <SelectItem key={index} value={monthDate.toISOString()}>
                    {format(monthDate, 'MMMM yyyy')}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* {weeks.map(({ week, days }) => (
        <Card key={week} className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Minggu {week}</h2>
        </Card>
      ))} */}
      <DateRangeSelector
        onDateRangeChange={(val) => {
          alert(JSON.stringify(val))
        }}
      />
    </div>
  )
}
