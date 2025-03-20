
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { IProject } from '@/server/models/Project';
import { getProjects, createProject, updateProject, deleteProject } from '@/api/projectService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData: FormData) => {
    try {
      const newProject: Omit<IProject, '_id' | 'createdAt' | 'updatedAt'> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as IProject['status'],
        startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined,
        endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
        budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : undefined,
        client: formData.get('client') as string,
        progress: formData.get('progress') ? parseFloat(formData.get('progress') as string) : 0,
        notes: formData.get('notes') as string,
      };

      const result = await createProject(newProject);
      if (result) {
        setProjects((prev) => [...prev, result]);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateProject = async (id: string, formData: FormData) => {
    try {
      const updatedProject: Partial<IProject> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as IProject['status'],
        startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined,
        endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
        budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : undefined,
        client: formData.get('client') as string,
        progress: formData.get('progress') ? parseFloat(formData.get('progress') as string) : 0,
        notes: formData.get('notes') as string,
      };

      const result = await updateProject(id, updatedProject);
      if (result) {
        setProjects((prev) => prev.map((project) => (project._id === id ? { ...project, ...result } : project)));
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteProject = async (project: IProject) => {
    if (!project._id) return;
    
    try {
      const success = await deleteProject(project._id);
      if (success) {
        setProjects((prev) => prev.filter((p) => p._id !== project._id));
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderProjectForm = (project: IProject | null, closeDialog: () => void, mode: 'view' | 'edit' | 'create') => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      let success = false;
      if (isCreateMode) {
        success = await handleCreateProject(formData);
      } else if (isEditMode && project?._id) {
        success = await handleUpdateProject(project._id, formData);
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
              {isCreateMode ? 'Create Project' : isEditMode ? 'Edit Project' : 'View Project'}
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
                defaultValue={project?.name || ''}
                readOnly={isViewMode}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                defaultValue={project?.description || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                defaultValue={project?.status || 'Planned'}
                disabled={isViewMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                className="col-span-3"
                defaultValue={project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                className="col-span-3"
                defaultValue={project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget ($)
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                className="col-span-3"
                defaultValue={project?.budget?.toString() || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Input
                id="client"
                name="client"
                className="col-span-3"
                defaultValue={project?.client || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                Progress (%)
              </Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                className="col-span-3"
                defaultValue={project?.progress?.toString() || '0'}
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
                defaultValue={project?.notes || ''}
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
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (project: IProject) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Planned': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'On Hold': return 'bg-orange-100 text-orange-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        );
      }
    },
    { accessorKey: 'client', header: 'Client' },
    { 
      accessorKey: 'startDate', 
      header: 'Start Date',
      cell: (project: IProject) => project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'
    },
    { 
      accessorKey: 'endDate', 
      header: 'End Date',
      cell: (project: IProject) => project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'
    },
    { 
      accessorKey: 'progress', 
      header: 'Progress',
      cell: (project: IProject) => (
        <div className="w-full">
          <Progress value={project.progress} className="h-2" />
          <div className="text-xs text-right mt-1">{project.progress}%</div>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      </div>
      
      <DataTable 
        data={projects}
        columns={columns}
        renderDialogContent={renderProjectForm}
        onDelete={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectsPage;
