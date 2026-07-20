import React from 'react';
import { Search, ChevronDown, List, Grid, MoreVertical, FileText, File as FileIcon } from 'lucide-react';
import { Input } from '../../../ui/input/Input';
import { Button } from '../../../ui/button/Button';
import { Badge } from '../../../ui/badge/Badge';

const documents = [
  { id: 1, name: 'Employee_Handbook.pdf', workspace: 'HR Policies', type: 'PDF', size: '4.2 MB', status: 'Processed', time: '2 hours ago', iconColor: 'text-red-500' },
  { id: 2, name: 'Leave_Policy_2024.pdf', workspace: 'HR Policies', type: 'PDF', size: '2.1 MB', status: 'Processed', time: '1 day ago', iconColor: 'text-red-500' },
  { id: 3, name: 'Service_Agreement.docx', workspace: 'Legal', type: 'DOCX', size: '1.3 MB', status: 'Processed', time: '2 days ago', iconColor: 'text-blue-500' },
  { id: 4, name: 'Financial_Report_Q1.xlsx', workspace: 'Finance', type: 'XLSX', size: '2.8 MB', status: 'Processed', time: '3 days ago', iconColor: 'text-green-500' },
  { id: 5, name: 'Research_Paper.pdf', workspace: 'Research', type: 'PDF', size: '3.6 MB', status: 'Processed', time: '5 days ago', iconColor: 'text-red-500' },
];

const DocumentLibrary = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input 
              icon={<Search className="h-4 w-4" />} 
              placeholder="Search documents..." 
              className="bg-white border-gray-200"
            />
          </div>
          
          <Button variant="outline" className="text-gray-700">
            All Types <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
          
          <Button variant="outline" className="text-gray-700">
            All Status <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
          
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button className="p-1.5 bg-white shadow-sm rounded-md text-gray-900">
              <List className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-900">
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Uploaded</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileIcon className={`h-5 w-5 ${doc.iconColor}`} />
                      <span className="font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{doc.workspace}</td>
                  <td className="px-6 py-4">{doc.type}</td>
                  <td className="px-6 py-4">{doc.size}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">{doc.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{doc.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;
