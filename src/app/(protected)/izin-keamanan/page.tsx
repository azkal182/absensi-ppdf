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
import { getIzinKeamanan } from '@/actions/izin'
import FormIzinKeamanan from './form-izin-keamanan'
import UpdateIzinButton from '@/components/update-izin-button'
// import { SantriCombobox } from './form-izin-asrama'

const izinKeamananPage = async () => {
  const izin = await getIzinKeamanan()

  return (
    <div>
      <div>
        <h1 className="text-center text-xl font-bold">Izin KBM Keamanan</h1>
        <h1 className="text-center text-xl font-bold">
          {format(new Date(), 'PPP', { locale: id })}
        </h1>
      </div>
      <Card className="mt-4 p-4">
        <div>
          <FormIzinKeamanan />
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Asrama</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Dari</TableHead>
              <TableHead>Aksi</TableHead>
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
                <TableCell>
                  {format(item.startDate, 'PPP', { locale: id })}
                </TableCell>
                <TableCell>
                  <UpdateIzinButton item={item} title="kembali" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default izinKeamananPage
