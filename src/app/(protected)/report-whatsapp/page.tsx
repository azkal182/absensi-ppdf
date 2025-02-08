import { getReportWhatsapp } from '@/actions/report_whatsapp'
import React from 'react'
import TableReport from './table'

const ReportWhatsappPage = async () => {
  const data = await getReportWhatsapp()
  console.log(data)

  return (
    <div>
      <TableReport data={data} />
    </div>
  )
}

export default ReportWhatsappPage
