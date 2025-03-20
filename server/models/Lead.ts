
export interface ILead {
  _id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  source?: string;
  value?: number;
  notes?: string;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = {
  name: String,
  company: String,
  email: String,
  phone: String,
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  source: String,
  value: Number,
  notes: String,
  lastContacted: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export default leadSchema;
