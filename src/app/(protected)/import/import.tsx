'use client'
import { importData } from '@/actions/import'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export default function ImportPage() {
  // const [data, setData] = useState<ExcelData[]>([])

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log("triggered");
    // console.log(event.target.files);

    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result

      if (typeof binaryStr !== 'string') return

      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      importData(workbook).then((res) => {
        console.log(res)
        toast.success('res.message')
      })
    }

    reader.readAsBinaryString(file)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Excel File</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </div>
  )
}
