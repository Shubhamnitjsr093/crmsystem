
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Planning'
  },
  startDate: Date,
  endDate: Date,
  budget: Number,
  client: String,
  team: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
