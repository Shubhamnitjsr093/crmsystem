
import React from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;            
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={cn("pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", className)}>
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
