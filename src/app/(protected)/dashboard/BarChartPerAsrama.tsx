'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import { format } from 'date-fns'

export interface AbsensiData {
  asrama: string
  totalDays: number
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
  data: AbsensiData[]
}

const chartConfig = {
  HADIR: {
    label: 'Hadir',
    color: 'hsl(var(--chart-1))',
  },
  SAKIT: {
    label: 'Sakit',
    color: 'hsl(var(--chart-2))',
  },
  IZIN: {
    label: 'Izin',
    color: 'hsl(var(--chart-3))',
  },
  ALFA: {
    label: 'Alfa',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; payload: any }>
  label?: string
}

const CustomTooltipContent = ({ active, payload }: TooltipProps) => {
  console.log(payload)

  if (active && payload && payload.length) {
    return (
      <div className="rounded bg-background p-2 shadow-lg">
        <p className="font-medium">{payload[0].payload.status}</p>
        <p className="text-sm">{payload[0].value.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export function BarChartPerAsrama({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((asramaData) => {
        const chartData = [
          {
            status: 'HADIR',
            value: parseFloat(asramaData.percent.HADIR.replace('%', '')),
          },
          {
            status: 'SAKIT',
            value: parseFloat(asramaData.percent.SAKIT.replace('%', '')),
          },
          {
            status: 'IZIN',
            value: parseFloat(asramaData.percent.IZIN.replace('%', '')),
          },
          {
            status: 'ALFA',
            value: parseFloat(asramaData.percent.ALFA.replace('%', '')),
          },
        ]

        return (
          <Card key={asramaData.asrama}>
            <CardHeader>
              <CardTitle className="text-center">{asramaData.asrama}</CardTitle>
              <CardDescription className="text-center">
                <h3> {format(new Date(), 'MMMM-yyyy')}</h3>
                <h3>Total Hari Masuk: {asramaData.totalDays}</h3>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                  barCategoryGap={12}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<CustomTooltipContent />}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8884d8" // Fallback color
                    radius={8}
                    // Type-safe color mapping
                    fillOpacity={1}
                    shape={(props: any) => {
                      const fillColor =
                        chartConfig[
                          props.payload.status as keyof typeof chartConfig
                        ]?.color || '#ccc'
                      return <rect {...props} fill={fillColor} />
                    }}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="grid grid-cols-2 gap-4">
                <p>✅ Hadir: {asramaData.percent.HADIR}</p>
                <p>⚠️ Sakit: {asramaData.percent.SAKIT}</p>
                <p>📌 Izin: {asramaData.percent.IZIN}</p>
                <p>❌ Alfa: {asramaData.percent.ALFA}</p>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
