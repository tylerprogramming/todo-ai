import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { supabase } from '../../lib/supabase';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      text: 'Hi there! 👋 I\'m your Todo assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('https://choice-entirely-coyote.ngrok-free.app/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          user: {
            id: session.user.id,
            email: session.user.email,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-5 w-80 bg-white rounded-lg shadow-lg flex flex-col z-50 border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-blue-500 text-white">
        <h3 className="font-medium">Todo Assistant</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-blue-600 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto max-h-80">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="p-2 rounded-r-md bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}