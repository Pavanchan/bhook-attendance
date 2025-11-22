const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },

  // face recognition descriptor
  faceDescriptor: {
    type: [Number],
    required: true,
  },

  // expected daily check-in time (per employee), "HH:MM" (24h)
  expectedCheckIn: {
    type: String,
    default: '09:00',
  },

  // stored employee photo (base64 string for now)
  photo: {
    type: String,
    default: null,
  },

  // salary information (simple version)
  baseSalary: { type: Number, default: 0 },       // optional: monthly salary
  weeklyAdvance: { type: Number, default: 0 },    // total advance taken this week

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
