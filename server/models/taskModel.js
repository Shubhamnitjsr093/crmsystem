
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Review', 'Completed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }, 
  dueDate: Date,
  assignedTo: String,
  relatedTo: {
    type: String,
    enum: ['Lead', 'Project', 'Contact'],
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedTo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);


