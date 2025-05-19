import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 right-5 p-4 rounded-full shadow-lg ${
        isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      } text-white transition-colors z-50`}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <MessageCircle size={24} />
    </button>
  );
}