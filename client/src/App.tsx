
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import LeadsPage from "./pages/LeadsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactsPage from "./pages/ContactsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Layout>
                <TasksPage />
              </Layout>
            } 
          />
          <Route 
            path="/leads" 
            element={
              <Layout>
                <LeadsPage />
              </Layout>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <Layout>
                <ProjectsPage />
              </Layout>
            } 
          />
          <Route 
            path="/contacts" 
            element={
              <Layout>
                <ContactsPage />
              </Layout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
