import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Cpu, FolderCog, CreditCard, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '../../../ui/button/Button';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('Preferences');
  
  const tabs = [
    { name: 'Profile', icon: User, desc: 'Update your profile' },
    { name: 'Preferences', icon: SettingsIcon, desc: 'App preferences' },
    { name: 'AI Models', icon: Cpu, desc: 'Configure AI models' },
    { name: 'Workspace Settings', icon: FolderCog, desc: 'Manage workspace' },
    { name: 'Billing', icon: CreditCard, desc: 'Manage subscription' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
         {/* Left Sidebar - Tabs */}
         <div className="w-full md:w-72 space-y-2 shrink-0">
            {tabs.map((tab) => (
               <div 
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                     activeTab === tab.name 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                  }`}
               >
                  <div className={`p-2 rounded-lg mr-4 ${
                     activeTab === tab.name ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                     <tab.icon className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className={`font-semibold text-sm ${activeTab === tab.name ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{tab.name}</h3>
                     <p className="text-xs text-gray-500">{tab.desc}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            {activeTab === 'Preferences' && (
               <div className="space-y-8 max-w-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">Preferences</h2>
                  
                  {/* Appearance */}
                  <div>
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                     <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                           <input type="radio" name="theme" value="light" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600" defaultChecked />
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Sun className="w-4 h-4 mr-1 text-gray-500"/> Light</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                           <input type="radio" name="theme" value="dark" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600" />
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Moon className="w-4 h-4 mr-1 text-gray-500"/> Dark</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                           <input type="radio" name="theme" value="system" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600" />
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Monitor className="w-4 h-4 mr-1 text-gray-500"/> System</span>
                        </label>
                     </div>
                  </div>

                  {/* Language */}
                  <div>
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Language</h3>
                     <select className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                     </select>
                  </div>

                  {/* Default Workspace */}
                  <div>
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Default Workspace</h3>
                     <select className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option>HR Policies</option>
                        <option>Legal</option>
                        <option>Finance</option>
                     </select>
                  </div>

                  {/* Chat Settings */}
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chat Settings</h3>
                     
                     <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Sources by Default</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                           <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked style={{ right: 0, borderColor: '#3b82f6' }}/>
                           <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-blue-500 cursor-pointer"></label>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Length</h4>
                        <select className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                           <option>Balanced</option>
                           <option>Concise</option>
                           <option>Detailed</option>
                        </select>
                     </div>
                  </div>
               </div>
            )}

            {activeTab !== 'Preferences' && (
               <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activeTab}</h3>
                  <p className="text-gray-500 mt-2 text-center max-w-sm">This section is currently under development. Settings will be available here soon.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
