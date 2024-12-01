import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4A5568;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4EA292;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #4EA292; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 5px;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p style="color: #718096; font-size: 14px; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="color: #4EA292;">${resetUrl}</span>
            </p>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('✉️ Password reset email sent to:', email)
  } catch (error) {
    console.error(' Failed to send password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
} 