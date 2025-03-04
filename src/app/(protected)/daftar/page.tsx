import React from 'react'
import AbsensiTable from './table'
import PageContainer from '@/components/layout/page-container'

const page = async () => {
  //   const data = await getDaftarAbsen(2025, 1);

  return (
    <PageContainer>
      <div className="flex max-w-[calc(100vw-2rem)] flex-1 flex-col gap-4 md:max-w-full">
        <div className="mb-4">
          <h1 className="text-center text-lg font-bold">Rekap absen santri</h1>
        </div>
        <AbsensiTable />
      </div>
    </PageContainer>
  )
}

export default page
