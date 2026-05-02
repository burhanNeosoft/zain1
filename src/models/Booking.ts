// src/models/Booking.ts
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10,}$/,
    },
    paymentId: {
      type: String,
      sparse: true,
      unique: true,
    },
    orderId: {
      type: String,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'failed'],
      default: 'pending',
      /* index: true, */
    },
    paymentMethod: {
      type: String,
      default: 'razorpay',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ email: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ slot: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;