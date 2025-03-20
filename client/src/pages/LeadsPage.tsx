
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { ILead } from '@/server/models/Lead';
import { getLeads, createLead, updateLead, deleteLead } from '@/api/leadService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const LeadsPage = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (formData: FormData) => {
    try {
      const newLead: Omit<ILead, '_id' | 'createdAt' | 'updatedAt'> = {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        status: formData.get('status') as ILead['status'],
        source: formData.get('source') as string,
        value: formData.get('value') ? parseFloat(formData.get('value') as string) : undefined,
        notes: formData.get('notes') as string,
        lastContacted: formData.get('lastContacted') ? new Date(formData.get('lastContacted') as string) : undefined,
      };

      const result = await createLead(newLead);
      if (result) {
        setLeads((prev) => [...prev, result]);
        toast({
          title: 'Success',
          description: 'Lead created successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to create lead. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateLead = async (id: string, formData: FormData) => {
    try {
      const updatedLead: Partial<ILead> = {
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        status: formData.get('status') as ILead['status'],
        source: formData.get('source') as string,
        value: formData.get('value') ? parseFloat(formData.get('value') as string) : undefined,
        notes: formData.get('notes') as string,
        lastContacted: formData.get('lastContacted') ? new Date(formData.get('lastContacted') as string) : undefined,
      };

      const result = await updateLead(id, updatedLead);
      if (result) {
        setLeads((prev) => prev.map((lead) => (lead._id === id ? { ...lead, ...result } : lead)));
        toast({
          title: 'Success',
          description: 'Lead updated successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteLead = async (lead: ILead) => {
    if (!lead._id) return;
    
    try {
      const success = await deleteLead(lead._id);
      if (success) {
        setLeads((prev) => prev.filter((l) => l._id !== lead._id));
        toast({
          title: 'Success',
          description: 'Lead deleted successfully',
        });
      } else {
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderLeadForm = (lead: ILead | null, closeDialog: () => void, mode: 'view' | 'edit' | 'create') => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      let success = false;
      if (isCreateMode) {
        success = await handleCreateLead(formData);
      } else if (isEditMode && lead?._id) {
        success = await handleUpdateLead(lead._id, formData);
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
              {isCreateMode ? 'Create Lead' : isEditMode ? 'Edit Lead' : 'View Lead'}
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
                defaultValue={lead?.name || ''}
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
                defaultValue={lead?.company || ''}
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
                defaultValue={lead?.email || ''}
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
                defaultValue={lead?.phone || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                defaultValue={lead?.status || 'New'}
                disabled={isViewMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                name="source"
                className="col-span-3"
                defaultValue={lead?.source || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value ($)
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                className="col-span-3"
                defaultValue={lead?.value?.toString() || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastContacted" className="text-right">
                Last Contacted
              </Label>
              <Input
                id="lastContacted"
                name="lastContacted"
                type="date"
                className="col-span-3"
                defaultValue={lead?.lastContacted ? new Date(lead.lastContacted).toISOString().split('T')[0] : ''}
                readOnly={isViewMode}
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
                defaultValue={lead?.notes || ''}
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
    { accessorKey: 'email', header: 'Email' },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (lead: ILead) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800';
            case 'Qualified': return 'bg-indigo-100 text-indigo-800';
            case 'Proposal': return 'bg-purple-100 text-purple-800';
            case 'Negotiation': return 'bg-orange-100 text-orange-800';
            case 'Won': return 'bg-green-100 text-green-800';
            case 'Lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
        );
      }
    },
    { accessorKey: 'source', header: 'Source' },
    { 
      accessorKey: 'value', 
      header: 'Value',
      cell: (lead: ILead) => lead.value ? `$${lead.value.toLocaleString()}` : '-'
    },
  ];

  return (
    <div className="space-y-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
      </div>
      
      <DataTable 
        data={leads}
        columns={columns}
        renderDialogContent={renderLeadForm}
        onDelete={handleDeleteLead}
      />
    </div>
  );
};

export default LeadsPage;
