import { getAsrama } from '@/actions/absenAction'
import React from 'react'
import TableData from './tableData'

export const dynamic = 'force-dynamic'

const ValidasiAbsenPage = async () => {
  const data = await getAsrama()
  return (
    <div>
      <TableData asrama={data} />
    </div>
  )
}
export default ValidasiAbsenPage
