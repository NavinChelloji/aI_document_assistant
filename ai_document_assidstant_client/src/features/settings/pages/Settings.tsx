import React from 'react';
import { User, Settings as SettingsIcon, Cpu, Briefcase, CreditCard } from 'lucide-react';
import { Button } from '../../../ui/button/Button';

const Settings = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 space-y-1">
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-3">Settings</h2>
        
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <User className="h-5 w-5 text-gray-500" />
          <div className="text-left">
            <div className="text-gray-900">Profile</div>
            <div className="text-xs text-gray-500 font-normal">Update your profile</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg transition-colors">
          <SettingsIcon className="h-5 w-5 text-blue-600" />
          <div className="text-left">
            <div>Preferences</div>
            <div className="text-xs text-blue-500/80 font-normal">App preferences</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <Cpu className="h-5 w-5 text-gray-500" />
          <div className="text-left">
            <div className="text-gray-900">AI Models</div>
            <div className="text-xs text-gray-500 font-normal">Configure AI models</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <Briefcase className="h-5 w-5 text-gray-500" />
          <div className="text-left">
            <div className="text-gray-900">Workspace Settings</div>
            <div className="text-xs text-gray-500 font-normal">Manage workspace</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <div className="text-left">
            <div className="text-gray-900">Billing</div>
            <div className="text-xs text-gray-500 font-normal">Manage subscription</div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
          <Button className="rounded-lg">Save Changes</Button>
        </div>

        <div className="space-y-8 max-w-2xl">
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Appearance</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Light</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-sm text-gray-700">Dark</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-sm text-gray-700">System</span>
              </label>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Language</h3>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white text-gray-900">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          {/* Default Workspace */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Default Workspace</h3>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white text-gray-900">
              <option>HR Policies</option>
              <option>Legal</option>
              <option>Finance</option>
            </select>
          </div>

          <hr className="border-gray-100" />

          {/* Chat Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Chat Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Show Sources by Default</h4>
                  <p className="text-sm text-gray-500 mt-1">Automatically display document citations in AI responses.</p>
                </div>
                <button type="button" className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                  <span aria-hidden="true" className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Response Length</h4>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white text-gray-900">
                  <option>Balanced</option>
                  <option>Concise</option>
                  <option>Detailed</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
