import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthSession } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getAuthSession()
    
    console.log('Delete request:', {
      adminEmail: process.env.ADMIN_EMAIL,
      userEmail: session?.user?.email,
      courseId: params.courseId
    })

    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized access' }, 
        { status: 401 }
      )
    }

    try {
      // First delete related records
      await prisma.courseAccess.deleteMany({
        where: { courseId: params.courseId }
      })

      await prisma.purchase.deleteMany({
        where: { courseId: params.courseId }
      })

      // Then delete the course
      await prisma.course.delete({
        where: { id: params.courseId }
      })

      return NextResponse.json(
        { message: 'Course deleted successfully' },
        { status: 200 }
      )
    } catch (prismaError: any) {
      console.error('Prisma error details:', prismaError)
      
      return NextResponse.json(
        { 
          error: 'Database error',
          details: prismaError.message
        }, 
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('General error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete course',
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getAuthSession()
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized access' }, 
        { status: 401 }
      )
    }

    const data = await request.json()

    const updatedCourse = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price,
        stripeProductId: data.stripeProductId,
      }
    })

    return NextResponse.json(updatedCourse)

  } catch (error: any) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update course' }, 
      { status: 500 }
    )
  }
}