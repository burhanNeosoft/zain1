// src/models/Slot.ts
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  time: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(v);
      },
      message: 'Time must be in HH:MM-HH:MM format'
    }
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  bookedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    default: null 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique date-time combinations
slotSchema.index({ date: 1, time: 1 }, { unique: true });

// Static method to clean up past unbooked slots
slotSchema.statics.cleanupPastSlots = async function() {
  const today = new Date().toISOString().split('T')[0];
  const result = await this.deleteMany({
    date: { $lt: today },
    isBooked: false
  });
  return result.deletedCount;
};

const Slot = mongoose.models.Slot || mongoose.model('Slot', slotSchema);

export default Slot;