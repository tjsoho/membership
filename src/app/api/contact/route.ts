import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    await sgMail.send({
      to: process.env.SUPPORT_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: `Savvy Business Internal Submission: ${subject}`,
      html: `
        <h1>Current Client: Savvy Business Hub Internal Form Submission </h1>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 