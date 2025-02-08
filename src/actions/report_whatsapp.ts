'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Get all reports
export const getReportWhatsapp = async () => {
  try {
    const result = await prisma.reportWhatsapp.findMany()

    return result
  } catch (error) {
    console.error('Error fetching reportWhatsapp data:', error)
    throw new Error('Gagal mengambil data report WhatsApp')
  }
}

// Get report by ID
export const getReportWhatsappById = async (id: string) => {
  try {
    const result = await prisma.reportWhatsapp.findUnique({
      where: { id: parseInt(id) },
    })
    return result
  } catch (error) {
    console.error('Error fetching reportWhatsapp by ID:', error)
    throw new Error('Gagal mengambil data report WhatsApp berdasarkan ID')
  }
}

// Create new report
export const createReportWhatsapp = async (data: {
  name: string
  jid: string
  type: 'GROUP' | 'PERSONAL'
  active: boolean
}) => {
  try {
    const newReport = await prisma.reportWhatsapp.create({
      data,
    })
    revalidatePath('/report-whatsapp')

    return newReport
  } catch (error) {
    console.error('Error creating reportWhatsapp:', error)
    throw new Error('Gagal menambahkan data report WhatsApp')
  }
}

// Update report
export const updateReportWhatsapp = async (
  id: string,
  data: {
    name?: string
    jid?: string
    type?: 'GROUP' | 'PERSONAL'
    active?: boolean
  }
) => {
  try {
    const updatedReport = await prisma.reportWhatsapp.update({
      where: { id: parseInt(id) },
      data,
    })
    revalidatePath('/report-whatsapp')

    return updatedReport
  } catch (error) {
    console.error('Error updating reportWhatsapp:', error)
    throw new Error('Gagal memperbarui data report WhatsApp')
  }
}

// Delete report
export const deleteReportWhatsapp = async (id: string) => {
  try {
    await prisma.reportWhatsapp.delete({
      where: { id: parseInt(id) },
    })
    revalidatePath('/report-whatsapp')

    return { message: 'Data berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting reportWhatsapp:', error)
    throw new Error('Gagal menghapus data report WhatsApp')
  }
}
