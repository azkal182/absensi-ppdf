import { getReportWhatsapp } from '@/actions/report_whatsapp'
import React from 'react'
import TableReport from './table'
import PageContainer from '@/components/layout/page-container'

const ReportWhatsappPage = async () => {
  const data = await getReportWhatsapp()
  console.log(data)

  return (
    <PageContainer>
      <div className="flex max-w-[calc(100vw-2rem)] flex-1 flex-col gap-4 md:max-w-full">
        <TableReport data={data} />
      </div>
    </PageContainer>
  )
}

export default ReportWhatsappPage
