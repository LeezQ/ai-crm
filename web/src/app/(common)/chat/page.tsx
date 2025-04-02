'use client';

import { useChat } from '@ai-sdk/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonal } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'data' | 'system';
  content: string;
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/ai/chat',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });


  console.log(12, messages);

  const isDisabled = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role !== 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-4 py-2 ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'}`}
              >
                {message.content}
                {status === 'streaming' && message.role === 'assistant' && (
                  <span className="animate-pulse">▋</span>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={input}
            placeholder="输入您的问题..."
            onChange={handleInputChange}
            disabled={isDisabled}
            className="flex-1"
          />
          <Button type="submit" disabled={isDisabled || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </div>
    </div>
  );
}