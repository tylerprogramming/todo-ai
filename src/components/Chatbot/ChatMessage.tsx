import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { text, isUser } = message;

  return (
    <div className={`mb-3 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {text}
      </div>
    </div>
  );
}