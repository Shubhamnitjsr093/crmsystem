
export interface IContact {
  _id?: string;
  name: string;
  company?: string;
  position?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  type?: 'Client' | 'Partner' | 'Vendor' | 'Other';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = {
  name: String,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export default contactSchema;
