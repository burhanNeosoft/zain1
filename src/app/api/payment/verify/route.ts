import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import connectDB from '@/lib/mongodb';
import { sendBookingConfirmationEmail } from '@/lib/email';

const calendar = google.calendar('v3');

async function getGoogleAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return auth;
}

async function createCalendarEvent(
  bookingDetails: any,
  slotData: any,
  paymentId: string
): Promise<string | null> {
  try {
    const auth = await getGoogleAuthClient();
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
      attendees: [
        {
          email: process.env.GOOGLE_APP_EMAIL,
          displayName: 'Admin',
          responseStatus: 'needsAction',
        },
      ],
      sendUpdates: 'all',
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      sendNotifications: true,
    });

    console.log('Calendar event created:', response.data.id);
    return response.data.id || null;
  } catch (error) {
    console.error('Google Calendar error:', error);
    throw error;
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

    // Verify signature
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
    try {
      calendarEventId = await createCalendarEvent(
        bookingDetails,
        slot,
        razorpay_payment_id
      );
    } catch (calendarError) {
      console.error('Failed to create calendar event:', calendarError);
    }

    // Send booking confirmation email
    try {
      await sendBookingConfirmationEmail({
        to: bookingDetails.email,
        name: bookingDetails.name,
        date: slot.date,
        time: slot.time,
        paymentId: razorpay_payment_id,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        paymentId: booking.paymentId,
        status: booking.status,
        calendarEventId,
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