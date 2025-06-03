// 'use client'
// import { useEffect, useState } from 'react'
// import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Card } from '@/components/ui/card'
// import {
//   getAsrama,
//   getClassByAsramaId,
//   getDaftarAbsen,
// } from '@/actions/absenAction'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { KelasData } from '../absensi/tableData'
// import { Label } from '@/components/ui/label'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip'
// // import { toZonedTime } from 'date-fns-tz'

// const statusIcons: any = {
//   HADIR: (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <CheckCircle className="mx-auto h-4 w-4 text-green-500" />
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Hadir</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   ),

//   SAKIT: (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <AlertCircle className="mx-auto h-4 w-4 text-yellow-500" />
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Sakit</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   ),

//   IZIN: (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <HelpCircle className="mx-auto h-4 w-4 text-blue-500" />
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Izin</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   ),
//   ALFA: (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <XCircle className="mx-auto h-4 w-4 text-red-500" />
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Alfa</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   ),
// }

// export default function AbsensiTable() {
//   const [weeks, setWeeks] = useState<
//     { week: number; days: { date: number; dayName: string }[] }[]
//   >([])
//   const [asrama, setAsrama] = useState<
//     | {
//         id: number
//         name: string
//       }[]
//     | []
//   >([])
//   const [absensi, setAbsensi] = useState([])
//   const [kelas, setKelas] = useState<KelasData | []>([])

//   const [selectedMonthYear, setSelectedMonthYear] = useState<string>(
//     `${new Date().toLocaleString('id-ID', {
//       month: 'long',
//     })} ${new Date().getFullYear()}`
//   )

//   // Fungsi untuk menghasilkan daftar bulan dan tahun
//   const generateMonthYearOptions = () => {
//     const currentYear = new Date().getFullYear()
//     const options: string[] = []

//     // Loop untuk 5 tahun ke belakang dan 5 tahun ke depan

//     for (let year = currentYear - 1; year <= currentYear + 5; year++) {
//       for (let month = 1; month <= 12; month++) {
//         const monthName = new Date(year, month - 1).toLocaleString('id-ID', {
//           month: 'long',
//         })
//         options.push(`${monthName} ${year}`)
//       }
//     }
//     return options
//   }

//   // Parse bulan dan tahun dari string yang dipilih
//   const [selectedMonth, selectedYear] = selectedMonthYear.split(' ')
//   const monthIndex =
//     new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1
//   const yearNumber = parseInt(selectedYear)

//   useEffect(() => {
//     console.log(yearNumber)
//     console.log(monthIndex)
//   }, [yearNumber, monthIndex])

//   useEffect(() => {
//     fetchAsrama()
//   }, [])

//   //   useEffect(() => {
//   //     if (selectedAsrama) {

//   //     }
//   //   }, [selectedAsrama, seletedKelas, monthIndex, selectedMonthYear])

//   const generateWeek = (asrama: string) => {
//     const daysInMonth = new Date(yearNumber, monthIndex, 0).getDate()
//     let currentWeek: { date: number; dayName: string }[] = []
//     let weekCounter = 1
//     const weeklyData: {
//       week: number
//       days: { date: number; dayName: string }[]
//     }[] = []
//     const isIlliyyin = asrama.toLowerCase() === 'illiyyin'

//     const formatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' })

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(yearNumber, monthIndex - 1, day)
//       const dayOfWeek = date.getDay()
//       const dayName = formatter.format(date)

//       // Kecualikan Selasa (2) & Jumat (5)
//       if (dayOfWeek !== 5) {
//         currentWeek.push({ date: day, dayName })
//       }

//       console.log(isIlliyyin)

//       // Tentukan akhir minggu berdasarkan asrama
//       const isEndOfWeek = isIlliyyin ? dayOfWeek === 2 : dayOfWeek === 5
//       if (isEndOfWeek || day === daysInMonth) {
//         weeklyData.push({ week: weekCounter++, days: currentWeek })
//         currentWeek = []
//       }
//     }

//     setWeeks(weeklyData)
//   }

//   const fetchAsrama = async () => {
//     const data = await getAsrama()
//     setAsrama(data)
//   }

//   const handleChangeAsrama = async (asramaId: string) => {
//     const id = parseInt(asramaId)
//     try {
//       const selectedAsrama = asrama.find((val) => val.id === id)
//       generateWeek(selectedAsrama?.name as string)
//       const result = await getClassByAsramaId(id)
//       setKelas(result)
//       setAbsensi([])
//     } catch (error) {
//       alert(error)
//     }
//   }

//   const handleChangeKelas = async (kelasId: string) => {
//     try {
//       const data = await getDaftarAbsen(
//         parseInt(kelasId),
//         yearNumber,
//         monthIndex + 1
//       )

//       // Convert all UTC dates to Asia/Jakarta timezone
//       //   const convertedData = data.map((siswa: any) => {
//       //     return {
//       //       ...siswa,
//       //       absensi: siswa.absensi.map((absen: any) => {
//       //         if (absen.date) {
//       //           // Assuming absen.date is a UTC date string
//       //           const jakartaDate = toZonedTime(absen.date, 'Asia/Jakarta')
//       //           return { ...absen, date: jakartaDate }
//       //         }
//       //         return absen
//       //       }),
//       //     }
//       //   })
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       setAbsensi(data)
//     } catch (error) {
//       alert(error)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <div>
//           <Label>Asrama</Label>
//           <Select onValueChange={handleChangeAsrama}>
//             <SelectTrigger className="w-full md:w-[300px]">
//               <SelectValue placeholder="Pilih Asrama" />
//             </SelectTrigger>
//             <SelectContent>
//               {asrama?.map((item, index) => (
//                 <SelectItem key={index} value={item.id.toString()}>
//                   {item.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label>Kelas</Label>
//           <Select onValueChange={handleChangeKelas}>
//             <SelectTrigger className="w-full md:w-[300px]">
//               <SelectValue placeholder="Pilih Kelas" />
//             </SelectTrigger>
//             <SelectContent>
//               {kelas.map((item, index) => (
//                 <SelectItem key={index} value={item.id.toString()}>
//                   {item.name} - {item.teacher}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label>Bulan & Tahun</Label>
//           <Select
//             value={selectedMonthYear}
//             onValueChange={(value) => {
//               console.log(value)

//               setSelectedMonthYear(value)
//             }}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Pilih Bulan & Tahun" />
//             </SelectTrigger>
//             <SelectContent>
//               {generateMonthYearOptions().map((option) => (
//                 <SelectItem key={option} value={option}>
//                   {option}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//   {absensi.length > 0 &&
//     weeks.map(({ week, days }) => (
//       <Card key={week} className="p-4">
//         <h2 className="mb-4 text-lg font-semibold">Minggu {week}</h2>
//         <Table className="overflow-x-auto">
//           <TableHeader>
//             <TableRow className="bg-gray-200 text-sm text-gray-700">
//               <TableHead rowSpan={2} className="border p-2 text-center">
//                 No
//               </TableHead>
//               <TableHead rowSpan={2} className="text-nowrap border p-2">
//                 Nama
//               </TableHead>
//               {days.map(({ date, dayName }) => (
//                 <TableHead
//                   key={date}
//                   colSpan={5}
//                   className="border p-2 text-center"
//                 >
//                   {dayName} ({date})
//                 </TableHead>
//               ))}
//             </TableRow>

//             <TableRow className="bg-gray-200 text-sm text-gray-700">
//               {days.flatMap(({ date }) => [
//                 <TableHead
//                   key={`day-${date}-1`}
//                   className="border p-2 text-center"
//                 >
//                   1
//                 </TableHead>,
//                 <TableHead
//                   key={`day-${date}-2`}
//                   className="border p-2 text-center"
//                 >
//                   2
//                 </TableHead>,
//                 <TableHead
//                   key={`day-${date}-3`}
//                   className="border p-2 text-center"
//                 >
//                   3
//                 </TableHead>,
//                 <TableHead
//                   key={`day-${date}-4`}
//                   className="border p-2 text-center"
//                 >
//                   4
//                 </TableHead>,
//                 <TableHead
//                   key={`day-${date}-5`}
//                   className="border p-2 text-center"
//                 >
//                   5
//                 </TableHead>,
//               ])}
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {absensi.map((siswa: any, index) => (
//               <TableRow key={siswa.id}>
//                 <TableCell className="border p-2 text-center">
//                   {index + 1}
//                 </TableCell>
//                 <TableCell className="text-nowrap border p-2">
//                   {siswa.name}
//                 </TableCell>

//                 {days.flatMap(({ date }) => {
//                   const absensiForDay = siswa.absensi[date] || []

//                   const availableHours = [1, 2, 3, 4, 5]

//                   return availableHours.map((hour) => {
//                     const entry = absensiForDay.find(
//                       (entry: any) => entry.jamKe === hour
//                     )
//                     // console.log(date)
//                     // console.log(siswa.absensi)

//                     return (
//                       <TableCell
//                         key={`day-${date}-${hour}`}
//                         className="border p-2 text-center"
//                       >
//                         {entry ? statusIcons[entry.status] : '-'}
//                       </TableCell>
//                     )
//                   })
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//     ))}
//     </div>
//   )
// }

'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
import {
  Absensi,
  getAsrama,
  getClassByAsramaId,
  getDaftarAbsen,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const statusIcons: any = {
  HADIR: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle className="mx-auto h-4 w-4 text-green-500" />
        </TooltipTrigger>
        <TooltipContent>Hadir</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  SAKIT: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="mx-auto h-4 w-4 text-yellow-500" />
        </TooltipTrigger>
        <TooltipContent>Sakit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  IZIN: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="mx-auto h-4 w-4 text-blue-500" />
        </TooltipTrigger>
        <TooltipContent>Izin</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  ALFA: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <XCircle className="mx-auto h-4 w-4 text-red-500" />
        </TooltipTrigger>
        <TooltipContent>Alfa</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export default function AbsensiTable() {
  const [weeks, setWeeks] = useState<
    { week: number; days: { date: number; dayName: string }[] }[]
  >([])
  const [asrama, setAsrama] = useState<{ id: number; name: string }[]>([])
  const [kelas, setKelas] = useState<KelasData>([])
  const [absensi, setAbsensi] = useState<Absensi[]>([])
  const [selectedAsrama, setSelectedAsrama] = useState<number | null>(null)
  const [selectedKelas, setSelectedKelas] = useState<number | null>(null)
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    `${new Date().toLocaleString('id-ID', { month: 'long' })} ${new Date().getFullYear()}`
  )

  const [monthIndex, setMonthIndex] = useState<number>(
    new Date().getMonth() + 1
  )
  const [yearNumber, setYearNumber] = useState<number>(new Date().getFullYear())
  useEffect(() => {
    getAsrama().then(setAsrama)
  }, [])

  useEffect(() => {
    if (!selectedMonthYear || !selectedKelas) return
    const bulanIndonesia: Record<string, number> = {
      Januari: 1,
      Februari: 2,
      Maret: 3,
      April: 4,
      Mei: 5,
      Juni: 6,
      Juli: 7,
      Agustus: 8,
      September: 9,
      Oktober: 10,
      November: 11,
      Desember: 12,
    }

    const [selectedMonth, selectedYear] = selectedMonthYear.split(' ')
    // const newMonthIndex =
    //   new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1
    const newMonthIndex = bulanIndonesia[selectedMonth] || NaN
    const newYearNumber = parseInt(selectedYear)

    console.log(`Selected Month: ${selectedMonth}, Year: ${selectedYear}`)
    console.log(
      `New Month Index: ${newMonthIndex}, Year Number: ${newYearNumber}`
    )

    setMonthIndex(newMonthIndex)
    setYearNumber(newYearNumber)
    setAbsensi([]) // Reset absensi sebelum memuat data baru

    // Memastikan state telah diperbarui sebelum memanggil API
    setTimeout(() => {
      getDaftarAbsen(selectedKelas, newYearNumber, newMonthIndex).then(
        (data) => {
          if (Array.isArray(data)) {
            setAbsensi(data)
          }
        }
      )
    }, 100)
  }, [selectedMonthYear, selectedKelas])

  const monthYearOptions = useMemo(() => {
    const currentDate = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i
      )
      return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
    })
  }, [])

  const generateWeek = useCallback(
    (asramaName: string) => {
      const daysInMonth = new Date(yearNumber, monthIndex, 0).getDate()
      let currentWeek: { date: number; dayName: string }[] = []
      let weekCounter = 1
      const weeklyData: {
        week: number
        days: { date: number; dayName: string }[]
      }[] = []
      const isIlliyyin = asramaName.toLowerCase() === 'illiyyin'

      const formatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' })

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yearNumber, monthIndex - 1, day)
        const dayOfWeek = date.getDay()
        const dayName = formatter.format(date)

        if (dayOfWeek !== 5) currentWeek.push({ date: day, dayName })

        if (
          (isIlliyyin && dayOfWeek === 2) ||
          (!isIlliyyin && dayOfWeek === 5) ||
          day === daysInMonth
        ) {
          weeklyData.push({ week: weekCounter++, days: currentWeek })
          currentWeek = []
        }
      }
      setWeeks(weeklyData)
    },
    [monthIndex, yearNumber]
  )

  const handleChangeAsrama = useCallback(
    async (asramaId: string) => {
      const id = parseInt(asramaId)
      setSelectedAsrama(id)
      const selected = asrama.find((a) => a.id === id)
      if (selected) {
        generateWeek(selected.name)
        const kelasData = await getClassByAsramaId(id)
        setKelas(kelasData)
        setAbsensi([])
        setSelectedKelas(null)
      }
    },
    [asrama, generateWeek]
  )

  const handleChangeKelas = useCallback(
    async (kelasId: string) => {
      const id = parseInt(kelasId)
      setSelectedKelas(id)
      setAbsensi([]) // Reset sebelum memuat data baru

      if (selectedAsrama) {
        const data = await getDaftarAbsen(id, yearNumber, monthIndex)
        if (Array.isArray(data)) {
          setAbsensi(data)
        }
      }
    },
    [selectedAsrama, yearNumber, monthIndex]
  )

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label>Asrama</Label>
            <Select onValueChange={handleChangeAsrama}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Pilih Asrama" />
              </SelectTrigger>
              <SelectContent>
                {asrama.map(({ id, name }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Kelas</Label>
            <Select
              onValueChange={handleChangeKelas}
              disabled={!selectedAsrama}
              value={selectedKelas?.toString() ?? ''}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {kelas.map(({ id, name, teacher }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {name} - {teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bulan & Tahun</Label>
            <Select
              value={selectedMonthYear}
              onValueChange={setSelectedMonthYear}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan & Tahun" />
              </SelectTrigger>
              <SelectContent>
                {monthYearOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {absensi.length > 0 &&
        weeks.map(({ week, days }) => (
          <Card key={week} className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Minggu {week}</h2>
            <Table className="overflow-x-auto">
              <TableHeader>
                <TableRow className="">
                  <TableHead rowSpan={2} className="border p-2 text-center">
                    No
                  </TableHead>
                  <TableHead rowSpan={2} className="text-nowrap border p-2">
                    Nama
                  </TableHead>
                  {days.map(({ date, dayName }) => (
                    <TableHead
                      key={date}
                      colSpan={5}
                      className="border p-2 text-center"
                    >
                      {dayName} ({date})
                    </TableHead>
                  ))}
                </TableRow>

                <TableRow className="">
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
                    <TableHead
                      key={`day-${date}-4`}
                      className="border p-2 text-center"
                    >
                      4
                    </TableHead>,
                    <TableHead
                      key={`day-${date}-5`}
                      className="border p-2 text-center"
                    >
                      5
                    </TableHead>,
                  ])}
                </TableRow>
              </TableHeader>

              <TableBody>
                {absensi.map((siswa: any, index) => (
                  <TableRow key={siswa.id}>
                    <TableCell className="border p-2 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-nowrap border p-2">
                      {siswa.name}
                    </TableCell>

                    {days.flatMap(({ date }) => {
                      const absensiForDay = siswa.absensi[date] || []

                      const availableHours = [1, 2, 3, 4, 5]

                      return availableHours.map((hour) => {
                        const entry = absensiForDay.find(
                          (entry: any) => entry.jamKe === hour
                        )
                        // console.log(date)
                        // console.log(siswa.absensi)

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

      {absensi.length === 0 && (
        <div className="flex items-center justify-center pt-12">
          <span>Tidak ada data</span>
        </div>
      )}
    </div>
  )
}
