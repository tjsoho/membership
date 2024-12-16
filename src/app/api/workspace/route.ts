import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('API GET - No session or email')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the user's ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      console.log('API GET - User not found:', session.user.email)
      return new NextResponse('User not found', { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    
    if (!courseId) {
      console.log('API GET - No courseId provided')
      return new NextResponse('Course ID is required', { status: 400 })
    }

    console.log('API GET - Fetching workspace items:', {
      courseId,
      userId: user.id
    })

    const items = await prisma.workspaceItem.findMany({
      where: {
        courseId: courseId,
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    console.log('API GET - Found items:', items)
    return NextResponse.json(items)

  } catch (error) {
    console.error('API GET Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('API POST - Session:', session)

    if (!session?.user?.email) {
      console.log('API POST - No session or email')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // First, get the user's ID using their email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      console.log('API POST - User not found:', session.user.email)
      return new NextResponse('User not found', { status: 404 })
    }

    const body = await req.json()
    console.log('API POST - Request body:', body)

    if (!body.title || !body.type || !body.courseId) {
      console.log('API POST - Missing fields:', { 
        hasTitle: !!body.title, 
        hasType: !!body.type, 
        hasCourseId: !!body.courseId 
      })
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Validate the content structure based on type
    if (body.type === 'MINDMAP') {
      if (!body.content || typeof body.content !== 'object') {
        console.log('API POST - Invalid mindmap content:', body.content)
        return new NextResponse('Invalid mindmap content', { status: 400 })
      }
    } else if (body.type === 'NOTES') {
      if (typeof body.content !== 'string') {
        console.log('API POST - Invalid notes content:', body.content)
        return new NextResponse('Invalid notes content', { status: 400 })
      }
    }

    // Ensure content is properly structured for database
    const contentToSave = body.type === 'MINDMAP' 
      ? {
          elements: body.content.elements || [],
          appState: {
            viewBackgroundColor: body.content.appState?.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: body.content.appState?.currentItemFontFamily || 1,
            zoom: body.content.appState?.zoom || { value: 1 },
            scrollX: body.content.appState?.scrollX || 0,
            scrollY: body.content.appState?.scrollY || 0,
          }
        }
      : body.content

    console.log('API POST - Creating workspace item with content:', contentToSave)

    const newItem = await prisma.workspaceItem.create({
      data: {
        title: body.title,
        type: body.type,
        content: contentToSave,
        courseId: body.courseId,
        userId: user.id, // Use the actual user ID instead of email
      },
    })

    console.log('API POST - Created new item:', newItem)
    return NextResponse.json(newItem)

  } catch (error) {
    console.error('API POST Error:', error)
    return new NextResponse(
      `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    console.log('API - Updating workspace item:', body)

    if (!body.id || !body.content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Get the current item to check its type
    const currentItem = await prisma.workspaceItem.findUnique({
      where: {
        id: body.id,
        userId: session.user.id
      }
    })

    if (!currentItem) {
      return new NextResponse('Item not found', { status: 404 })
    }

    // Prepare content based on type
    let contentToSave = body.content
    if (currentItem.type === 'MINDMAP') {
      contentToSave = {
        elements: body.content.elements || [],
        appState: {
          viewBackgroundColor: body.content.appState?.viewBackgroundColor || '#ffffff',
          currentItemFontFamily: body.content.appState?.currentItemFontFamily || 1,
          zoom: body.content.appState?.zoom || { value: 1 },
          scrollX: body.content.appState?.scrollX || 0,
          scrollY: body.content.appState?.scrollY || 0,
        }
      }
    }

    const updated = await prisma.workspaceItem.update({
      where: { 
        id: body.id,
        userId: session.user.id
      },
      data: {
        title: body.title || currentItem.title, // Keep existing title if not provided
        content: contentToSave,
        updatedAt: new Date(),
      },
    })

    console.log('API - Updated item:', updated)
    return NextResponse.json(updated)

  } catch (error) {
    console.error('API Error in PUT:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('id')
    
    if (!itemId) {
      return new NextResponse('Item ID is required', { status: 400 })
    }

    const deletedItem = await prisma.workspaceItem.delete({
      where: {
        id: itemId,
        userId: session.user.id // Ensures user can only delete their own items
      },
    })

    return NextResponse.json(deletedItem)

  } catch (error) {
    console.error('API DELETE Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 