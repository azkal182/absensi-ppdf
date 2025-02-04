'use client'

import { TrendingUp } from 'lucide-react'
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
  ChartTooltipContent,
} from '@/components/ui/chart'
import ChartBulanan from './ChartBulanan'
import ChartGlobal from './ChartGlobal'
const chartData = [
  { month: "Na'im", desktop: 90 },
  { month: "Ma'wa", desktop: 89 },
  { month: 'Tasawwuf', desktop: 87 },
  { month: 'Darussalam', desktop: 92 },
  { month: 'Illiyyin', desktop: 90 },
  { month: 'Takhosus', desktop: 93 },
]
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* <div className="grid grid-cols-4">

      </div>
      <ChartBulanan /> */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Grafik kehadiran </CardTitle>
            <CardDescription>January 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <XAxis dataKey="desktop" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="desktop"
                  layout="vertical"
                  fill="var(--color-desktop)"
                  radius={4}
                >
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="desktop"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>
        <ChartGlobal />
        <div className="rounded-xl bg-muted/50" />
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      <ChartBulanan />
    </div>
  )
}
