import { getIzinAsrama } from '@/actions/izinAsrama'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import React from 'react'
import { id } from 'date-fns/locale'
import { SantriCombobox } from './form-izin-asrama'
import PageContainer from '@/components/layout/page-container'

const IzinAsramaPage = async () => {
  const izin = await getIzinAsrama()

  return (
    <PageContainer>
      <div className="flex max-w-[calc(100vw-2rem)] flex-1 flex-col gap-4 md:max-w-full">
        <div>
          <div>
            <h1 className="text-center text-xl font-bold">Izin KBM Asrama</h1>
            <h1 className="text-center text-xl font-bold">
              {format(new Date(), 'PPP', { locale: id })}
            </h1>
          </div>
          <Card className="mt-4 p-4">
            <div>
              <SantriCombobox />
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Asrama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {izin.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.siswa?.name}</TableCell>
                    <TableCell>{item.siswa?.asrama?.name}</TableCell>
                    <TableCell>
                      {item.siswa?.kelas?.name} - {item.siswa?.kelas?.teacher}
                    </TableCell>
                    <TableCell>{item.izinStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default IzinAsramaPage
