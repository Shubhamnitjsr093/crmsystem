
export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  status: 'New' | 'In Progress' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  assignedTo?: string;
  relatedTo?: {
    type: 'Lead' | 'Contact' | 'Project';
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = {
  title: String,
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
    type: { type: String, enum: ['Lead', 'Contact', 'Project'] },
    id: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export default taskSchema;
