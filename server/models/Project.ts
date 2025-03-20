
export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  status: 'Planned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  client?: string; // Reference to a Contact
  team?: string[];
  progress?: number; // Percentage
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = {
  name: String,
  description: String,
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Planned'
  },
  startDate: Date,
  endDate: Date,
  budget: Number,
  client: String,
  team: [String],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export default projectSchema;
