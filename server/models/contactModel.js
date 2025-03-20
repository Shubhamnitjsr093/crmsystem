
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: String,
  position: String,
  email: String,
  phone: String,
  address: String,
  notes: String,
  type: {
    type: String,
    enum: ['Client', 'Partner', 'Vendor', 'Other'],
    default: 'Client'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
