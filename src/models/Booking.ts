// src/models/Booking.ts
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentId: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;