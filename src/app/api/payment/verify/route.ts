import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import connectDB from '@/lib/mongodb';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

const calendar = google.calendar('v3');

function generateGoogleCalendarLink(
  bookingDetails: { name: string; email: string; phone: string },
  slotData: { date: string; time: string },
  paymentId: string
): string {
  const [startTime, endTime] = slotData.time.split('-');
  const eventDate = new Date(slotData.date);
  const [startHour, startMin] = startTime.split(':');
  const [endHour, endMin] = endTime.split(':');

  const startDateTime = new Date(eventDate);
  startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0);

  const endDateTime = new Date(eventDate);
  endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0);

  // Format dates for Google Calendar URL (YYYYMMDDTHHMMSS)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}00`;
  };

  const startDate = formatDate(startDateTime);
  const endDate = formatDate(endDateTime);

  const eventTitle = `Booking Confirmed - ${bookingDetails.name}`;
  const eventDescription = `Payment ID: ${paymentId}\nPhone: ${bookingDetails.phone}`;

  // Google Calendar URL format
  const calendarUrl = new URL('https://calendar.google.com/calendar/u/0/r/eventedit');
  calendarUrl.searchParams.append('text', eventTitle);
  calendarUrl.searchParams.append('dates', `${startDate}/${endDate}`);
  calendarUrl.searchParams.append('details', eventDescription);
  calendarUrl.searchParams.append('location', 'Online');

  return calendarUrl.toString();
}

async function createCalendarEvent(
  bookingDetails: { name: string; email: string; phone: string },
  slotData: { date: string; time: string },
  paymentId: string
): Promise<{ eventId: string | null; calendarLink: string | null }> {
  try {
    const serviceKey = process.env.GOOGLE_SERVICE_KEY?.replace(/\\n/g, '\n');
    const serviceEmail = process.env.GOOGLE_SERVICE_EMAIL;

    if (!serviceKey || !serviceEmail) {
      throw new Error('Missing Google service account credentials');
    }

    const auth = new google.auth.JWT({
      email: serviceEmail,
      key: serviceKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const [startTime, endTime] = slotData.time.split('-');
    const eventDate = new Date(slotData.date);
    const [startHour, startMin] = startTime.split(':');
    const [endHour, endMin] = endTime.split(':');

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0);

    const event = {
      summary: `Booking Confirmed - ${bookingDetails.name}`,
      description: `Payment ID: ${paymentId}\nPhone: ${bookingDetails.phone}\nEmail: ${bookingDetails.email}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
    });

    const eventId = response.data.id;
    const calendarLink = generateGoogleCalendarLink(bookingDetails, slotData, paymentId);

    console.log('✅ Calendar event created:', eventId);
    console.log('📅 Calendar link:', calendarLink);

    return { eventId, calendarLink };
  } catch (error) {
    console.error('❌ Google Calendar error:', error);
    return { eventId: null, calendarLink: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingDetails,
      amount,
      slotId,
    } = await request.json();

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(slotId)) {
      return NextResponse.json(
        { error: 'Invalid slot ID' },
        { status: 400 }
      );
    }

    // Fetch slot details
    const slot = await (Slot as any).findById(slotId);
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    const booking = new Booking({
      slot: slotId,
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      status: 'completed',
      paymentMethod: 'razorpay',
    });

    await booking.save();

    // Update slot to mark as booked
    await (Slot as any).findByIdAndUpdate(slotId, {
      isBooked: true,
      bookedBy: booking._id,
    });

    let calendarEventId: string | null = null;
    let calendarLink: string | null = null;
    try {
      const calendarEvent = await createCalendarEvent(
        bookingDetails,
        {
          date: slot.date,
          time: slot.time,
        },
        razorpay_payment_id
      );
      calendarEventId = calendarEvent.eventId;
      calendarLink = calendarEvent.calendarLink;
    } catch (calendarError) {
      console.error('Failed to create calendar event:', calendarError);
    }

    try {
      await sendBookingConfirmationEmail({
        to: bookingDetails.email,
        name: bookingDetails.name,
        date: slot.date,
        time: slot.time,
        paymentId: razorpay_payment_id,
        calendarLink: calendarLink || undefined,
      });
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
    }

    try {
      await sendAdminNotificationEmail({
        customerName: bookingDetails.name,
        customerEmail: bookingDetails.email,
        customerPhone: bookingDetails.phone,
        date: slot.date,
        time: slot.time,
        paymentId: razorpay_payment_id,
        amount,
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        paymentId: booking.paymentId,
        status: booking.status,
        calendarEventId,
        calendarLink,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}