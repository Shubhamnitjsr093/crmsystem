
import { IContact } from '../server/models/Contact';

const API_URL = 'http://localhost:5000/api';

export const getContacts = async (): Promise<IContact[]> => {
  try {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

export const createContact = async (contact: Omit<IContact, '_id' | 'createdAt' | 'updatedAt'>): Promise<IContact | null> => {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating contact:', error);
    return null;
  }
};

export const updateContact = async (id: string, contact: Partial<IContact>): Promise<IContact | null> => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating contact:', error);
    return null;
  }
};

export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting contact:', error);
    return false;
  }
};
