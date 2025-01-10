import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  console.log('📝 Registration request received')
  
  try {
    const { email, password, name } = await req.json()
    console.log('📧 Email received:', email)
    console.log('👤 Name received:', name)
    // Don't log the password for security
    
    // Validate input
    if (!email || !password || !name) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Hash password
    console.log('🔒 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashed successfully')

    // Check if user already exists
    console.log('🔍 Checking if user exists...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      if(existingUser.name === "Pending Registration"){
        const user_update = await prisma.user.update({
          where:{
            email:email,
          },
          data:{
            name:name,
            password:hashedPassword,
          }
        })
        return NextResponse.json({
          user: {
            id: user_update.id,
            email: user_update.email,
            name: user_update.name
          }
        })
      }
      else{
        console.log('⚠️ Email already registered:', email)
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        )
      }
      
    }

    // Create user
    console.log('👤 Creating new user...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    })
    console.log('✨ User created successfully:', user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}