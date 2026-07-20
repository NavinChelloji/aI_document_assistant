import React from 'react';
import { Plus, MessageSquare, Bot, User, ThumbsUp, ThumbsDown, Copy, Send, Paperclip, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { Input } from '../../../ui/input/Input';

const Chat = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <Button fullWidth className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">Chat History</h3>
          
          <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            <div className="truncate">Leave policy details</div>
            <div className="text-xs font-normal text-blue-500 mt-0.5">2 mins ago</div>
          </button>
          
          <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
            <div className="truncate">Overtime policy</div>
            <div className="text-xs font-normal text-gray-400 mt-0.5">1 hour ago</div>
          </button>
          
          <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
            <div className="truncate">Travel policy rules</div>
            <div className="text-xs font-normal text-gray-400 mt-0.5">Yesterday</div>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10">
          <h2 className="font-semibold text-gray-900">Leave policy details</h2>
          <Button variant="outline" size="sm" className="rounded-lg text-gray-600">
            GPT-4 (Ollama) <ChevronDown className="ml-2 h-3 w-3" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg">
              <p>How many casual leaves are allowed in a year?</p>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex gap-4 max-w-3xl">
            <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="text-gray-800 leading-relaxed">
                <p>According to the Leave Policy document, employees are entitled to <strong>12 casual leaves in a year</strong>.</p>
              </div>
              
              {/* Citation Block */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Source:</p>
                <div className="flex items-start gap-2">
                  <div className="text-red-500 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path></svg>
                  </div>
                  <div>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Leave_Policy_2024.pdf (Page 5)</a>
                  </div>
                </div>
              </div>

              {/* Feedback Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <button className="absolute left-3 p-2 text-gray-400 hover:text-gray-600">
              <Paperclip className="h-5 w-5" />
            </button>
            <input 
              type="text" 
              placeholder="Ask anything about your documents..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <button className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Sources */}
      <div className="w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Sources</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <h4 className="text-sm font-medium text-blue-900 break-words">Leave_Policy_2024.pdf</h4>
            <p className="text-xs text-blue-600 mt-1">Page 5</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors">
            <h4 className="text-sm font-medium text-gray-900 break-words">Employee_Handbook.pdf</h4>
            <p className="text-xs text-gray-500 mt-1">Page 12</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors">
            <h4 className="text-sm font-medium text-gray-900 break-words">HR_Guidelines.pdf</h4>
            <p className="text-xs text-gray-500 mt-1">Page 8</p>
          </div>

        </div>
        <div className="p-4 border-t border-gray-100">
          <Button variant="outline" fullWidth className="rounded-lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            View in Document
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Chat;
