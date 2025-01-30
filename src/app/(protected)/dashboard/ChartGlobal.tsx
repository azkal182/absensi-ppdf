'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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

const chartData = [
  {
    month: 'January',
    desktop: 186,
    mobile: 80,
    tablet: 60,
    tv: 40,
    console: 30,
    wearable: 25,
    other: 15,
  },
  {
    month: 'February',
    desktop: 305,
    mobile: 200,
    tablet: 120,
    tv: 60,
    console: 50,
    wearable: 40,
    other: 25,
  },
  {
    month: 'March',
    desktop: 237,
    mobile: 120,
    tablet: 90,
    tv: 50,
    console: 40,
    wearable: 35,
    other: 20,
  },
  {
    month: 'April',
    desktop: 73,
    mobile: 190,
    tablet: 110,
    tv: 70,
    console: 55,
    wearable: 45,
    other: 30,
  },
]

const chartConfig: any = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  tablet: { label: 'Tablet', color: 'hsl(var(--chart-3))' },
  tv: { label: 'TV', color: 'hsl(var(--chart-4))' },
  console: { label: 'Console', color: 'hsl(var(--chart-5))' },
  wearable: { label: 'Wearable', color: 'hsl(var(--chart-6))' },
  other: { label: 'Other', color: 'hsl(var(--chart-7))' },
} satisfies ChartConfig

export default function ChartGlobal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 4 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            {Object.keys(chartConfig).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={chartConfig[key].color}
                fillOpacity={0.4}
                stroke={chartConfig[key].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - April 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
