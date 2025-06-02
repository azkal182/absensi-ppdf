import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      {
        message: 'ID parameter is required',
        status: 'error',
        data: null,
      },
      { status: 400 }
    )
  }

  const data = await prisma.siswa.findMany({
    where: {
      asramaId: parseInt(id, 10),
    },
    include: {
      asrama: true,
      kelas: true,
    },
  })

  const workbook = new ExcelJS.Workbook()
  const groupedByClass: Record<string, Record<string, typeof data>> = {}

  for (const item of data) {
    if (!item.kelas || !item.asrama) continue
    const className = item.kelas.name
    const teacherName = item.kelas.teacher

    groupedByClass[className] ??= {}
    groupedByClass[className][teacherName] ??= []
    groupedByClass[className][teacherName].push(item)
  }

  for (const [className, teachers] of Object.entries(groupedByClass)) {
    const sheet = workbook.addWorksheet(className)
    let currentRow = 1

    for (const [teacherName, students] of Object.entries(teachers)) {
      // Guru
      const row = sheet.addRow([`Nama Guru: ${teacherName}`])
      row.font = { bold: true }
      sheet.mergeCells(`A${currentRow}:O${currentRow}`)
      currentRow++

      // Header SKS
      const header1 = [
        'No',
        'Nama Siswa',
        'Masuk',
        ...Array(12).fill(''),
        'Kurang',
      ]
      const headerRow = sheet.addRow(header1)
      // Merge SKS columns (D to N)
      sheet.mergeCells(`D${currentRow}:N${currentRow}`)
      sheet.getCell(`D${currentRow}`).value = 'SKS'
      sheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center' }
      headerRow.font = { bold: true }
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCE5FF' }, // Light blue
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })

      // Bagian Subheader SKS
      const header2 = [
        '', // No
        '', // Nama Siswa
        '', // Masuk
        ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
        '', // Kurang
      ]
      const subHeaderRow = sheet.addRow(header2)
      subHeaderRow.alignment = { horizontal: 'center' }
      subHeaderRow.font = { italic: true }
      subHeaderRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })

      // Merge cells for 'No', 'Nama Siswa', 'Masuk', and 'Kurang' across header and subheader rows
      sheet.mergeCells(`A${currentRow}:A${currentRow + 1}`)
      sheet.mergeCells(`B${currentRow}:B${currentRow + 1}`)
      sheet.mergeCells(`C${currentRow}:C${currentRow + 1}`)
      sheet.mergeCells(`P${currentRow}:P${currentRow + 1}`)

      // Ensure the text in merged cells is centered
      sheet.getCell(`A${currentRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }
      sheet.getCell(`B${currentRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }
      sheet.getCell(`C${currentRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }
      sheet.getCell(`P${currentRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }

      currentRow += 2 // Skip both header and subheader rows

      // Data siswa
      students.forEach((student, index) => {
        const sksChecklist = Array.from(
          { length: 12 },
          () =>
            //   Math.random() < 0.7 ? '☑' : ''
            ''
        )
        const kurang = 0
        // Bagian data siswa
        const dataRow = sheet.addRow([
          index + 1,
          student.name,
          '', // Masuk kosong
          ...sksChecklist,
          kurang,
        ])

        dataRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        })
        currentRow++
      })

      // Baris kosong antar guru
      sheet.addRow([])
      currentRow++
    }

    // Set lebar kolom agar proporsional
    const columnWidths = [5, 25, 10, ...Array(12).fill(6), 8]
    columnWidths.forEach((width, i) => {
      sheet.getColumn(i + 1).width = width
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=report.xlsx',
    },
  })
}
