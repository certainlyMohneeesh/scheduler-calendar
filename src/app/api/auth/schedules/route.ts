import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schedules = await prisma.schedule.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      startTime: 'asc'
    }
  })

  return NextResponse.json(schedules)
}
