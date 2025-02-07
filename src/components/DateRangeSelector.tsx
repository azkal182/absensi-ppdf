import { useState, useEffect } from 'react'
import {
  format,
  startOfToday,
  subDays,
  subWeeks,
  getYear,
  endOfMonth,
  startOfMonth,
} from 'date-fns'
import { id as indonesian } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateRange {
  startDate: Date
  endDate: Date
}

interface DateRangeSelectorProps {
  onDateRangeChange: (range: DateRange) => void
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
}) => {
  const FIXED_START_DATE = new Date(2023, 0, 1)
  const currentDate = startOfToday()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today')

  const getStartDate = (): Date => {
    let startDate: Date
    switch (selectedDateRange) {
      case 'today':
        startDate = currentDate
        break
      case '3days':
        startDate = subDays(currentDate, 3)
        break
      case '1week':
        startDate = subWeeks(currentDate, 1)
        break
      case 'all':
        startDate = FIXED_START_DATE
        break
      default:
        startDate = startOfMonth(new Date(selectedDateRange))
    }
    startDate.setHours(0, 0, 0, 0)
    return startDate
  }

  const getEndDate = (): Date => {
    let endDate: Date
    switch (selectedDateRange) {
      case 'today':
      case '3days':
      case '1week':
      case 'all':
        endDate = currentDate
        break
      default:
        endDate = endOfMonth(new Date(selectedDateRange))
    }
    endDate.setHours(23, 59, 59, 999)
    return endDate
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    onDateRangeChange({ startDate: getStartDate(), endDate: getEndDate() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateRange])

  const monthsAndYears = []
  for (let year = 2023; year <= getYear(currentDate); year++) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1)
      if (date > currentDate) break
      monthsAndYears.push({
        value: date.toISOString(),
        label: format(date, 'MMMM yyyy', { locale: indonesian }),
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Pilih rentang waktu" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rentang Waktu</SelectLabel>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="3days">3 Hari Terakhir</SelectItem>
            <SelectItem value="1week">1 Minggu Terakhir</SelectItem>
            <SelectItem value="all">Semua Data</SelectItem>
            {monthsAndYears
              .reverse()
              .slice(0, 12)
              .map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan data dari:{' '}
          <span className="font-medium">
            {format(getStartDate(), 'PPpp', { locale: indonesian })}
          </span>{' '}
          -{' '}
          <span className="font-medium">
            {format(getEndDate(), 'PPpp', { locale: indonesian })}
          </span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan data dari:{' '}
          <span className="font-medium">{getStartDate().toISOString()}</span> -{' '}
          <span className="font-medium">{getEndDate().toISOString()}</span>
        </p>
      </div>
    </div>
  )
}

export default DateRangeSelector
