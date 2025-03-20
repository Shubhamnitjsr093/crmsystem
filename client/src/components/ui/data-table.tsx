
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    accessorKey: keyof T | string;
    header: string;
    cell?: (row: T) => React.ReactNode;
  }[];
  onRowClick?: (row: T) => void;
  renderDialogContent?: (
    row: T | null,
    closeDialog: () => void,
    mode: 'view' | 'edit' | 'create'
  ) => React.ReactNode;
  onDelete?: (row: T) => void;
  hideActions?: boolean;
  className?: string;
  tableClassName?: string;
  createButtonLabel?: string;
}

export function DataTable<T extends { _id?: string }>({
  data,
  columns,
  onRowClick,
  renderDialogContent,
  onDelete,
  hideActions = false,
  className,
  tableClassName,
  createButtonLabel = "Create New"
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredData = searchQuery
    ? data.filter((row) => {
        return Object.entries(row).some(([key, value]) => {
          if (
            typeof value === 'string' &&
            columns.some((col) => col.accessorKey === key)
          ) {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
      })
    : data;

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (renderDialogContent) {
      setSelectedRow(row);
      setDialogMode('view');
      setDialogOpen(true);
    }
  };

  const handleEditClick = (e: React.MouseEvent, row: T) => {
    e.stopPropagation();
    setSelectedRow(row);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, row: T) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(row);
    }
  };

  const handleCreateClick = () => {
    setSelectedRow(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {renderDialogContent && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreateClick}
                className="bg-crm-blue hover:bg-blue-600 transition-all duration-300 btn-animate"
              >
                {createButtonLabel}
              </Button>
            </DialogTrigger>
            {renderDialogContent(selectedRow, closeDialog, dialogMode)}
          </Dialog>
        )}
      </div>
      <div className={cn("rounded-md border table-container", tableClassName)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey.toString()}>
                  {column.header}
                </TableHead>
              ))}
              {!hideActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hideActions ? 0 : 1)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, i) => (
                <TableRow
                  key={row._id || i}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey.toString()}>
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessorKey === 'string' && column.accessorKey.includes('.')
                        ? column.accessorKey
                            .split('.')
                            .reduce((obj, key) => obj?.[key], row as any)
                        : (row[column.accessorKey as keyof T] as any)}
                    </TableCell>
                  ))}
                  {!hideActions && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditClick(e, row)}
                          className="text-blue-500 hover:text-blue-700 border-blue-200 hover:border-blue-500"
                        >
                          Edit
                        </Button>
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, row)}
                            className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-500"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
