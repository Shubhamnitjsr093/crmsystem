
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { IContact } from '@/server/models/Contact';
import { getContacts, createContact, updateContact, deleteContact } from '@/api/contactService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ContactsPage = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contacts. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (formData: FormData) => {
    try {
      const newContact: Omit<IContact, '_id' | 'createdAt' | 'updatedAt'> = {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        position: formData.get('position') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
        type: formData.get('type') as IContact['type'],
        tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
      };

      const result = await createContact(newContact);
      if (result) {
        setContacts((prev) => [...prev, result]);
        toast({
          title: 'Success',
          description: 'Contact created successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to create contact. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateContact = async (id: string, formData: FormData) => {
    try {
      const updatedContact: Partial<IContact> = {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        position: formData.get('position') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
        type: formData.get('type') as IContact['type'],
        tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
      };

      const result = await updateContact(id, updatedContact);
      if (result) {
        setContacts((prev) => prev.map((contact) => (contact._id === id ? { ...contact, ...result } : contact)));
        toast({
          title: 'Success',
          description: 'Contact updated successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteContact = async (contact: IContact) => {
    if (!contact._id) return;
    
    try {
      const success = await deleteContact(contact._id);
      if (success) {
        setContacts((prev) => prev.filter((c) => c._id !== contact._id));
        toast({
          title: 'Success',
          description: 'Contact deleted successfully',
        });
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderContactForm = (contact: IContact | null, closeDialog: () => void, mode: 'view' | 'edit' | 'create') => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      let success = false;
      if (isCreateMode) {
        success = await handleCreateContact(formData);
      } else if (isEditMode && contact?._id) {
        success = await handleUpdateContact(contact._id, formData);
      }
      
      if (success) {
        closeDialog();
      }
    };
    
    return (
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? 'Create Contact' : isEditMode ? 'Edit Contact' : 'View Contact'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                defaultValue={contact?.name || ''}
                readOnly={isViewMode}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                className="col-span-3"
                defaultValue={contact?.company || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                className="col-span-3"
                defaultValue={contact?.position || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="col-span-3"
                defaultValue={contact?.email || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                className="col-span-3"
                defaultValue={contact?.phone || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                className="col-span-3"
                defaultValue={contact?.address || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                name="type" 
                defaultValue={contact?.type || 'Client'}
                disabled={isViewMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                className="col-span-3"
                defaultValue={contact?.tags?.join(', ') || ''}
                readOnly={isViewMode}
                placeholder="Separate tags with commas"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                className="col-span-3"
                defaultValue={contact?.notes || ''}
                readOnly={isViewMode}
              />
            </div>
          </div>
          <DialogFooter>
            {!isViewMode && (
              <Button type="submit" className="bg-crm-blue hover:bg-blue-600 transition-all duration-300">
                {isCreateMode ? 'Create' : 'Save'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={closeDialog}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  };

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'company', header: 'Company' },
    { accessorKey: 'position', header: 'Position' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { 
      accessorKey: 'type', 
      header: 'Type',
      cell: (contact: IContact) => {
        const getTypeColor = (type: string) => {
          switch (type) {
            case 'Client': return 'bg-blue-100 text-blue-800';
            case 'Partner': return 'bg-green-100 text-green-800';
            case 'Vendor': return 'bg-yellow-100 text-yellow-800';
            case 'Other': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getTypeColor(contact.type || 'Other')}>{contact.type || 'Other'}</Badge>
        );
      }
    },
  ];

  return (
    <div className="space-y-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
      </div>
      
      <DataTable 
        data={contacts}
        columns={columns}
        renderDialogContent={renderContactForm}
        onDelete={handleDeleteContact}
      />
    </div>
  );
};

export default ContactsPage;
