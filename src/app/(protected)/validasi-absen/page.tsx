import { getAsrama } from '@/actions/absenAction'
import React from 'react'
import TableData from './tableData'
import PageContainer from '@/components/layout/page-container'

export const dynamic = 'force-dynamic'

const ValidasiAbsenPage = async () => {
  const data = await getAsrama()
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col gap-4">
        <TableData asrama={data} />
      </div>
    </PageContainer>
  )
}
export default ValidasiAbsenPage
