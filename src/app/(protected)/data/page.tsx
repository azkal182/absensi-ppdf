'use client'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAsramaWithFullData } from '@/actions/absenAction'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TableSantri from '@/components/santri/TableSantri'
import KelasComponent from './kelas'
// import { usePathname, useSearchParams } from 'next/navigation'
// import Link from 'next/link'

const DataPage = () => {
  const [asrama, setAsrama] = useState<any>([])
  //   const searchParams = useSearchParams()
  //   const pathname = usePathname()
  //   const page = searchParams.get('page')
  //   console.log(page)

  //   const createQueryString = useCallback(
  //     (name: string, value: string) => {
  //       const params = new URLSearchParams(searchParams.toString())
  //       console.log({ params })

  //       params.set(name, value)
  //       return params.toString()
  //     },
  //     [searchParams]
  //   )

  useEffect(() => {
    const fetchAsrama = async () => {
      const data = await getAsramaWithFullData()
      setAsrama(data)
    }
    fetchAsrama()
  }, [])
  return (
    <div>
      {/* <Link href={pathname + '?' + createQueryString('test', '4')}>test</Link> */}
      <Tabs defaultValue="asrama" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="asrama">Asrama</TabsTrigger>
          <TabsTrigger value="kelas">Kelas</TabsTrigger>
          <TabsTrigger value="santri">Santri</TabsTrigger>
        </TabsList>
        <TabsContent value="asrama">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1>Asrama</h1>
                <Button>Tambah</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No</TableHead>
                    <TableHead>Nama Asrama</TableHead>
                    <TableHead className="text-right">Jumlah Kelas</TableHead>
                    <TableHead className="text-right">Jumlah Santri</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asrama?.map((data: any, index: number) => (
                    <TableRow key={data.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell className="text-right">
                        {data._count.classes}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.classes.reduce(
                          (sum: any, kelas: any) => sum + kelas._count.Siswas,
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="font-bold">
                    <TableCell colSpan={2} className="text-center">
                      Total
                    </TableCell>
                    <TableCell className="text-right">
                      {asrama.reduce(
                        (sum: any, data: any) => sum + data.classes.length,
                        0
                      )}{' '}
                      Kelas
                    </TableCell>
                    <TableCell className="text-right">
                      {asrama.reduce(
                        (totalSantri: any, data: any) =>
                          totalSantri +
                          data.classes.reduce(
                            (sum: any, kelas: any) => sum + kelas._count.Siswas,
                            0
                          ),
                        0
                      )}{' '}
                      Santri
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kelas">
          <KelasComponent />
        </TabsContent>
        <TabsContent value="santri">
          <TableSantri />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DataPage
