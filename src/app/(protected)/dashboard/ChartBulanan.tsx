'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
    category1: 186,
    category2: 80,
    category3: 120,
    category4: 95,
    category5: 150,
    category6: 130,
    category7: 200,
  },
  {
    month: 'February',
    category1: 305,
    category2: 200,
    category3: 180,
    category4: 110,
    category5: 175,
    category6: 140,
    category7: 220,
  },
  {
    month: 'March',
    category1: 237,
    category2: 120,
    category3: 140,
    category4: 105,
    category5: 165,
    category6: 135,
    category7: 210,
  },
  {
    month: 'April',
    category1: 73,
    category2: 190,
    category3: 160,
    category4: 130,
    category5: 185,
    category6: 145,
    category7: 230,
  },
]

const chartConfig: any = {
  category1: { label: 'Category 1', color: 'hsl(var(--chart-1))' },
  category2: { label: 'Category 2', color: 'hsl(var(--chart-2))' },
  category3: { label: 'Category 3', color: 'hsl(var(--chart-3))' },
  category4: { label: 'Category 4', color: 'hsl(var(--chart-4))' },
  category5: { label: 'Category 5', color: 'hsl(var(--chart-5))' },
  category6: { label: 'Category 6', color: 'hsl(var(--chart-6))' },
  category7: { label: 'Category 7', color: 'hsl(var(--chart-7))' },
} satisfies ChartConfig

export default function ChartBulanan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Bulanan</CardTitle>
        <CardDescription>January - April 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key].color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total data for the last 4 months
        </div>
      </CardFooter>
    </Card>
  )
}
