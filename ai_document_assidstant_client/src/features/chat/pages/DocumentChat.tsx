import React, { useState } from 'react';
import { Plus, MessageSquare, Bot, ThumbsUp, ThumbsDown, Paperclip, Send, ChevronDown, FileText } from 'lucide-react';

export const DocumentChat = () => {
  const [inputText, setInputText] = useState('');

  const chatHistory = [
    { id: 1, title: "Leave policy details", time: "2 mins ago", active: true },
    { id: 2, title: "Overtime policy", time: "1 hour ago", active: false },
    { id: 3, title: "Travel policy rules", time: "Yesterday", active: false },
    { id: 4, title: "Performance review", time: "2 days ago", active: false },
    { id: 5, title: "Dress code policy", time: "3 days ago", active: false },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-[1400px] mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      
      {/* Left Sidebar - Chat History */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
         <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center font-medium transition-colors">
               <Plus className="w-4 h-4 mr-2" />
               New Chat
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Chat History</h4>
            {chatHistory.map((chat) => (
               <div key={chat.id} className={`p-3 rounded-lg cursor-pointer ${
                  chat.active 
                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                     : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
               }`}>
                  <h5 className="font-medium text-sm truncate">{chat.title}</h5>
                  <p className="text-xs text-gray-400 mt-1">{chat.time}</p>
               </div>
            ))}
         </div>
         <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <button className="text-sm text-blue-600 font-medium">View all</button>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
         {/* Chat Header */}
         <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center px-6 bg-white dark:bg-gray-900">
            <h2 className="font-semibold text-gray-900 dark:text-white">Leave policy details</h2>
            <div className="flex items-center space-x-2">
               <button className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span>GPT-4 (Ollama)</span>
                  <ChevronDown className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* User Message */}
            <div className="flex justify-end">
               <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] text-sm">
                  How many casual leaves are allowed in a year?
               </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start space-x-4">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
               </div>
               <div className="max-w-[80%] space-y-4">
                  <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                     According to the Leave Policy document, employees are entitled to <strong>12 casual leaves in a year</strong>.
                  </div>
                  
                  {/* Inline Source */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 inline-block">
                     <p className="text-xs text-gray-500 mb-2">Source:</p>
                     <div className="flex items-center space-x-2 text-sm">
                        <FileText className="text-red-500 w-4 h-4" />
                        <span className="text-blue-600 font-medium">Leave_Policy_2024.pdf (Page 5)</span>
                     </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 text-gray-400">
                     <button className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                     <button className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
         </div>

         {/* Input Area */}
         <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden px-2 py-1">
               <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Paperclip className="w-5 h-5" />
               </button>
               <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything about your documents..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white px-2 py-2"
               />
               <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors ml-2">
                  <Send className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Right Sidebar - Sources */}
      <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sources</h3>
         <div className="space-y-3">
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3">
               <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Leave_Policy_2024.pdf</h4>
               <p className="text-xs text-gray-500 mb-2">Page 5</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors rounded-lg p-3 cursor-pointer">
               <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Employee_Handbook.pdf</h4>
               <p className="text-xs text-gray-500 mb-2">Page 12</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors rounded-lg p-3 cursor-pointer">
               <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">HR_Guidelines.pdf</h4>
               <p className="text-xs text-gray-500 mb-2">Page 8</p>
            </div>
         </div>
         <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            View in Document
         </button>
      </div>

    </div>
  );
};
