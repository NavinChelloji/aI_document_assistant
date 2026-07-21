import React from "react";
import { User, Bot, FileText } from "lucide-react";
import type { Message } from "../../../types/chat";
import { cn } from "../../../utils/cn";

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full mt-4 space-x-3 max-w-4xl mx-auto", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      )}
      
      <div className={cn(
        "relative px-5 py-3.5 text-sm shadow-sm",
        isUser 
          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
          : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"
      )}>
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((cit, idx) => (
                <div key={idx} className="flex items-center text-xs bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  <span className="truncate max-w-[150px]">{cit.document_name}</span>
                  <span className="ml-1 text-gray-400 border-l border-gray-300 pl-1">p. {cit.page_number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
};
