/******************************************************************************
                                IMPORTS
******************************************************************************/
import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

/******************************************************************************
                              CONSTANTS
******************************************************************************/
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL as string

/******************************************************************************
                              API HANDLER
******************************************************************************/
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as Blob
    const title = formData.get('title') as string
    const email = formData.get('email') as string
    const fileType = formData.get('fileType') as string

    if (!file || !title || !email || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert blob to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64File = buffer.toString('base64')

    // Determine file extension and mime type
    const fileExtension = fileType === 'mindmap' ? 'png' : 'pdf'
    const mimeType = fileType === 'mindmap' ? 'image/png' : 'application/pdf'

    const msg = {
      to: email,
      from: SENDGRID_FROM_EMAIL,
      subject: `Your Workspace Item: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4EA292;">Your Workspace Item</h1>
          <p>Here's your workspace item from Savvy Business Hub.</p>
          <p>The ${fileType === 'mindmap' ? 'mind map' : 'document'} is attached to this email.</p>
        </div>
      `,
      attachments: [
        {
          content: base64File,
          filename: `${title}.${fileExtension}`,
          type: mimeType,
          disposition: 'attachment'
        }
      ]
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 