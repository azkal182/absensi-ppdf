'use client'
import React from 'react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'

const chartConfig = {
  HADIR: { label: 'HADIR', color: 'hsl(var(--chart-1))' },
  SAKIT: { label: 'SAKIT', color: 'hsl(var(--chart-2))' },
  IZIN: { label: 'IZIN', color: 'hsl(var(--chart-3))' },
  ALFA: { label: 'ALFA', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig

export interface AbsensiData {
  asrama: string
  totalAbsensi: number
  HADIR: number
  SAKIT: number
  IZIN: number
  ALFA: number
  percent: {
    HADIR: string
    SAKIT: string
    IZIN: string
    ALFA: string
  }
}

interface Props {
  chartData: AbsensiData[]
}
const ChartThisMonth = ({ chartData }: Props) => {
  const chartDataThisMonth = chartData?.map((asrama) => ({
    asrama: asrama.asrama,
    HADIR: parseFloat(asrama.percent.HADIR.replace('%', '')),
    SAKIT: parseFloat(asrama.percent.SAKIT.replace('%', '')),
    IZIN: parseFloat(asrama.percent.IZIN.replace('%', '')),
    ALFA: parseFloat(asrama.percent.ALFA.replace('%', '')),
  }))
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Persentase Kehadiran Global
        </CardTitle>
        <CardDescription className="text-center">
          {format(new Date(), 'MMMM-yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartDataThisMonth}
            layout="vertical"
            margin={{ left: 30, right: 20 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
            />
            <YAxis
              dataKey="asrama"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="HADIR"
              fill="var(--color-HADIR)"
              radius={[0, 5, 5, 0]}
            />
            {/* <Bar dataKey="SAKIT" fill="var(--chart-2)" radius={[0, 5, 5, 0]} />
            <Bar dataKey="IZIN" fill="var(--chart-3)" radius={[0, 5, 5, 0]} />
            <Bar dataKey="ALFA" fill="var(--chart-4)" radius={[0, 5, 5, 0]} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartThisMonth
