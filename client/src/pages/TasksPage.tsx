
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { ITask } from '@/server/models/Task';
import { getTasks, createTask, updateTask, deleteTask } from '@/api/taskService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const TasksPage = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: FormData) => {
    try {
      const newTask: Omit<ITask, '_id' | 'createdAt' | 'updatedAt'> = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as 'New' | 'In Progress' | 'Review' | 'Completed',
        priority: formData.get('priority') as 'Low' | 'Medium' | 'High',
        dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : undefined,
        assignedTo: formData.get('assignedTo') as string,
      };

      const result = await createTask(newTask);
      if (result) {
        setTasks((prev) => [...prev, result]);
        toast({
          title: 'Success',
          description: 'Task created successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateTask = async (id: string, formData: FormData) => {
    try {
      const updatedTask: Partial<ITask> = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as 'New' | 'In Progress' | 'Review' | 'Completed',
        priority: formData.get('priority') as 'Low' | 'Medium' | 'High',
        dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : undefined,
        assignedTo: formData.get('assignedTo') as string,
      };

      const result = await updateTask(id, updatedTask);
      if (result) {
        setTasks((prev) => prev.map((task) => (task._id === id ? { ...task, ...result } : task)));
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteTask = async (task: ITask) => {
    if (!task._id) return;
    
    try {
      const success = await deleteTask(task._id);
      if (success) {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        });
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderTaskForm = (task: ITask | null, closeDialog: () => void, mode: 'view' | 'edit' | 'create') => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      let success = false;
      if (isCreateMode) {
        success = await handleCreateTask(formData);
      } else if (isEditMode && task?._id) {
        success = await handleUpdateTask(task._id, formData);
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
              {isCreateMode ? 'Create Task' : isEditMode ? 'Edit Task' : 'View Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                defaultValue={task?.title || ''}
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
                defaultValue={task?.description || ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                defaultValue={task?.status || 'New'}
                disabled={isViewMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select 
                name="priority" 
                defaultValue={task?.priority || 'Medium'}
                disabled={isViewMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                className="col-span-3"
                defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                readOnly={isViewMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                className="col-span-3"
                defaultValue={task?.assignedTo || ''}
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
    { accessorKey: 'title', header: 'Title' },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (task: ITask) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Review': return 'bg-purple-100 text-purple-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
        );
      }
    },
    { 
      accessorKey: 'priority', 
      header: 'Priority',
      cell: (task: ITask) => {
        const getPriorityColor = (priority: string) => {
          switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-amber-100 text-amber-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
        );
      }
    },
    { 
      accessorKey: 'dueDate', 
      header: 'Due Date',
      cell: (task: ITask) => task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'
    },
    { accessorKey: 'assignedTo', header: 'Assigned To' },
  ];

  return (
    <div className="space-y-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>
      
      <DataTable 
        data={tasks}
        columns={columns}
        renderDialogContent={renderTaskForm}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TasksPage;
