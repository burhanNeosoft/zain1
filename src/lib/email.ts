import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASS,
  },
});

interface SendBookingEmailProps {
  to: string;
  name: string;
  date: string;
  time: string;
  paymentId: string;
}

export async function sendBookingConfirmationEmail({
  to,
  name,
  date,
  time,
  paymentId,
}: SendBookingEmailProps) {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_APP_EMAIL,
      to,
      subject: 'Booking Confirmation - Your Session is Scheduled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmed! 🎉</h2>
          
          <p>Hi <strong>${name}</strong>,</p>
          
          <p>Thank you for your booking! Your session has been confirmed and added to your calendar.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0;">Session Details</h3>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
          </div>
          
          <p>A calendar invitation has also been sent to your email. If you don't see it, check your spam folder.</p>
          
          <p style="color: #666; font-size: 14px;">
            If you need to reschedule or cancel, please contact us as soon as possible.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            Best regards,<br>
            Your Booking Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}