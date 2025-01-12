import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    console.log('Attempting to send email with:', {
      to: process.env.SUPPORT_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      name,
      email,
      message
    });

    await sgMail.send({
      to: process.env.SUPPORT_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Login Support Request",
      html: `
        <h1>New Support Request</h1>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log('Email sent successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send support email:", error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 