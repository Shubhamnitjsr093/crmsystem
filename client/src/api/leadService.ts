
import { ILead } from '../server/models/Lead';

const API_URL = 'http://localhost:5000/api';

export const getLeads = async (): Promise<ILead[]> => {
  try {
    const response = await fetch(`${API_URL}/leads`);
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const createLead = async (lead: Omit<ILead, '_id' | 'createdAt' | 'updatedAt'>): Promise<ILead | null> => {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    return null;
  }
};

export const updateLead = async (id: string, lead: Partial<ILead>): Promise<ILead | null> => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating lead:', error);
    return null;
  }
};

export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting lead:', error);
    return false;
  }
};
