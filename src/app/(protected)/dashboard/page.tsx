import { getChartThisMonth } from '@/actions/absenAction'
import ChartThisMonth from './ChartThisMonth'
import { BarChartPerAsrama } from './BarChartPerAsrama'
import PageContainer from '@/components/layout/page-container'

export const dynamic = 'force-dynamic'

// Helper: format nama bulan
function getMonthYearName(date: Date) {
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export default async function Page() {
  const now = new Date()

  // Ambil 3 bulan terakhir
  const chartDataWithTitle = await Promise.all(
    [0, 1, 2].map(async (i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const data = await getChartThisMonth(
        date.getMonth() + 1,
        date.getFullYear()
      )
      return {
        title: getMonthYearName(date),
        data,
      }
    })
  )

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {chartDataWithTitle.map((item, index) => (
            <ChartThisMonth
              key={index}
              chartData={item.data}
              title={item.title}
            />
          ))}
        </div>

        {/* Misalnya kamu hanya ingin gunakan bulan terbaru untuk chart besar */}
        <BarChartPerAsrama data={chartDataWithTitle[0].data} />
      </div>
    </PageContainer>
  )
}
