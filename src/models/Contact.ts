import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    /* required: [true, 'Email is required'],
    trim: true,
    lowercase: true, */
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  languages: [{
    type: String,
    required: [true, 'Languages are required'],
  }],
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent mongoose from creating the model multiple times
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact; 