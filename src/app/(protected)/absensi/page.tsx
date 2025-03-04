import { getAsrama } from '@/actions/absenAction'
import TableData from './tableData'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'
import PageContainer from '@/components/layout/page-container'

export const dynamic = 'force-dynamic'
// const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await getAsrama()

  const timeZone = 'Asia/Jakarta'
  const today = toZonedTime(new Date(), timeZone)

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col gap-4">
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold">Absensi Santri PPDF</h1>
          <h1 className="font-semibold">
            {format(today, 'EEEE, dd MMMM yyyy', { locale: id })}
          </h1>
        </div>
        <Card>
          <TableData asrama={data ?? []} />
        </Card>
      </div>
    </PageContainer>
  )
}
