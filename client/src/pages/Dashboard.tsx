import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '@/api/taskService';
import { getLeads } from '@/api/leadService';
import { getProjects } from '@/api/projectService';
import { getContacts } from '@/api/contactService';
import { ITask } from '@/server/models/Task';
import { ILead } from '@/server/models/Lead';
import { IProject } from '@/server/models/Project';
import { IContact } from '@/server/models/Contact';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, leadsData, projectsData, contactsData] = await Promise.all([
          getTasks(),
          getLeads(),
          getProjects(),
          getContacts()
        ]);
        
        setTasks(tasksData);
        setLeads(leadsData);
        setProjects(projectsData);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const taskStatusData = [
    { name: 'New', value: tasks.filter(task => task.status === 'New').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'In Progress').length },
    { name: 'Review', value: tasks.filter(task => task.status === 'Review').length },
    { name: 'Completed', value: tasks.filter(task => task.status === 'Completed').length },
  ];

  const leadStatusData = [
    { name: 'New', value: leads.filter(lead => lead.status === 'New').length },
    { name: 'Contacted', value: leads.filter(lead => lead.status === 'Contacted').length },
    { name: 'Qualified', value: leads.filter(lead => lead.status === 'Qualified').length },
    { name: 'Proposal', value: leads.filter(lead => lead.status === 'Proposal').length },
    { name: 'Negotiation', value: leads.filter(lead => lead.status === 'Negotiation').length },
    { name: 'Won', value: leads.filter(lead => lead.status === 'Won').length },
    { name: 'Lost', value: leads.filter(lead => lead.status === 'Lost').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end" 
          fill="#666" 
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="table-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(task => task.status === 'Completed').length} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="table-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              {leads.filter(lead => lead.status === 'Won').length} won
            </p>
          </CardContent>
        </Card>
        
        <Card className="table-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(project => project.status === 'In Progress').length} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card className="table-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.filter(contact => contact.type === 'Client').length} clients
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="table-container">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>
              Distribution of tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="table-container">
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
            <CardDescription>
              Distribution of leads by status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leadStatusData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  height={60} 
                  tick={<CustomXAxisTick />}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
