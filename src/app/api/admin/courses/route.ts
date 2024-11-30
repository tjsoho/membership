import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getAuthSession()
  
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ courses })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getAuthSession()
  
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const course = await prisma.course.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price,
        stripeProductId: data.stripeProductId,
      }
    })

    return NextResponse.json({ success: true, course })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 