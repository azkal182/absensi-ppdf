import { getChartThisMonth } from '@/actions/absenAction'
import ChartThisMonth from './ChartThisMonth'
import { BarChartPerAsrama } from './BarChartPerAsrama'

export const dynamic = 'force-dynamic'
export default async function Page() {
  const thisMonth = await getChartThisMonth()

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* <div className="grid grid-cols-4">

      </div>
      <ChartBulanan /> */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <ChartThisMonth chartData={thisMonth} />
        {/* <Card>
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
        </Card> */}
        {/* <ChartGlobal /> */}
        <div className="rounded-xl bg-muted/50" />
        <div className="rounded-xl bg-muted/50" />
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      {/* <ChartBulanan /> */}
      <BarChartPerAsrama data={thisMonth} />
    </div>
  )
}
