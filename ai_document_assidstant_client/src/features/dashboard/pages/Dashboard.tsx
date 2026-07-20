import React from 'react';
import { Plus, Folders, FileText, MessageSquare, HardDrive, File as FileIcon, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { Card, CardContent } from '../../../ui/card/Card';
import { Badge } from '../../../ui/badge/Badge';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, John! <span className="text-xl">👋</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your documents.</p>
        </div>
        <Button className="rounded-lg">
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Folders className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Workspaces</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Documents</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chats</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-xl">
              <HardDrive className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Storage</p>
              <p className="text-xl font-bold text-gray-900">2.4 <span className="text-sm text-gray-500 font-medium">GB / 10 GB</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workspaces */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workspaces</h2>
          <Button variant="ghost" className="text-sm text-blue-600">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { initials: 'H', bg: 'bg-pink-100', text: 'text-pink-600', title: 'HR Policies', count: 24 },
            { initials: 'L', bg: 'bg-green-100', text: 'text-green-600', title: 'Legal', count: 18 },
            { initials: 'F', bg: 'bg-teal-100', text: 'text-teal-600', title: 'Finance', count: 32 },
            { initials: 'R', bg: 'bg-blue-100', text: 'text-blue-600', title: 'Research', count: 14 }
          ].map((ws) => (
            <Card key={ws.title} className="hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${ws.bg} ${ws.text} h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg`}>
                  {ws.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ws.title}</h3>
                  <p className="text-sm text-gray-500">{ws.count} Documents</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          <Button variant="ghost" className="text-sm text-blue-600">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
        <Card>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Employee_Handbook.pdf', ws: 'HR Policies', time: 'Uploaded 2 hours ago' },
              { name: 'Leave_Policy_2024.pdf', ws: 'HR Policies', time: 'Uploaded 1 day ago' },
              { name: 'Service_Agreement.docx', ws: 'Legal', time: 'Uploaded 2 days ago' },
            ].map((doc) => (
              <div key={doc.name} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <FileIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.ws} • {doc.time}</p>
                  </div>
                </div>
                <Badge variant="success">Processed</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
