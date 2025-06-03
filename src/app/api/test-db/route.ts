import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT now()`
    return NextResponse.json({ time: result })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  }
}
