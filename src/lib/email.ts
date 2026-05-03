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
  calendarLink?: string;
}

interface SendAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  paymentId: string;
  amount: number;
}

export async function sendBookingConfirmationEmail({
  to,
  name,
  date,
  time,
  paymentId,
  calendarLink,
}: SendBookingEmailProps): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.GOOGLE_APP_EMAIL,
      to,
      subject: 'Booking Confirmation - Your Session is Scheduled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmed! 🎉</h2>
          
          <p>Hi <strong>${name}</strong>,</p>
          
          <p>Thank you for your booking! Your session has been confirmed.</p>
          
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
          
          ${calendarLink ? `
            <div style="background-color: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px 0;"><strong>📅 Add to Your Calendar</strong></p>
              <a href="${calendarLink}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: background-color 0.3s;">
                + Add to Google Calendar
              </a>
            </div>
          ` : ''}
          
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
    });
    console.log('✅ Booking confirmation email sent to:', to);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
}

export async function sendAdminNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  date,
  time,
  paymentId,
  amount,
}: SendAdminNotificationProps): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.GOOGLE_APP_EMAIL,
      to: process.env.GOOGLE_APP_EMAIL!,
      subject: `📅 New Booking - ${customerName} (${new Date(date).toLocaleDateString()})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ New Booking Received!</h2>
          
          <p>A new booking has been confirmed. Here are the details:</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="margin-top: 0;">👤 Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0;">📅 Booking Details</h3>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Payment ID:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${paymentId}</code></p>
            <p><strong>Amount Received:</strong> ₹${amount}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>📌 Note:</strong> The event has been automatically added to your Google Calendar.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated notification from your booking system.
          </p>
        </div>
      `,
    });
    console.log('✅ Admin notification email sent to:', process.env.GOOGLE_APP_EMAIL);
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    throw error;
  }
}