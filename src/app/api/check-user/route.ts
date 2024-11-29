import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      // Don't select password
    }
  })

  if (!user) {
    return NextResponse.json({ exists: false })
  }

  return NextResponse.json({ exists: true, user })
} 