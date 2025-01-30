import { getDaftarAbsen } from '@/actions/absenAction'
import React from 'react'
import AbsensiTable from './table'

const page = async () => {
  //   const data = await getDaftarAbsen(2025, 1);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-center text-lg font-bold">Rekap absen santri</h1>
      </div>
      <AbsensiTable />
    </div>
  )
}

export default page
