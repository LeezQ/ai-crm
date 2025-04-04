'use client';

import { useChat, type Message } from '@ai-sdk/react';
import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Bot,
  Copy,
  CheckCheck,
  Sparkles,
  Search,
  Code,
  BookOpen,
  Paperclip,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const examplePrompts = [
  'How does AI work?',
  'Are black holes real?',
  'How many Rs are in the word "strawberry"?',
  'List of good questions to ask an AI chat bot',
];

export default function Chat() {
  const [token, setToken] = useState<string | null>(null);

  // Get token on component mount (client-side only)
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    reload,
    stop,
    status,
  } = useChat({
    api: '/api/ai/chat',
    experimental_throttle: 1,
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto scroll to bottom
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [messages]);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Copy content to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Handle example prompt click
  const handleExamplePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 0);
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
      <ScrollArea ref={messagesContainerRef} className="flex-1">
        {messages.length === 0 ? (
          // Initial State View
          <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
            <h1 className="text-3xl font-bold mb-8">How can I help you?</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <Button variant="outline" className="flex flex-col items-center h-20 gap-2 p-4">
                <Sparkles className="h-5 w-5" />
                <span>Create</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center h-20 gap-2 p-4">
                <Search className="h-5 w-5" />
                <span>Explore</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center h-20 gap-2 p-4">
                <Code className="h-5 w-5" />
                <span>Code</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center h-20 gap-2 p-4">
                <BookOpen className="h-5 w-5" />
                <span>Learn</span>
              </Button>
            </div>
            <div className="space-y-3">
              {examplePrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start text-left text-muted-foreground hover:text-foreground hover:bg-gray-100 p-3 rounded-md"
                  onClick={() => handleExamplePromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="max-w-3xl mx-auto space-y-6 pt-6 pb-10 px-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "px-4 py-3 rounded-lg max-w-[85%] relative group",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100"
                )}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  {message.role === 'assistant' && !isLoading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 hover:bg-gray-200"
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copied === message.id ?
                        <CheckCheck className="h-3.5 w-3.5 text-gray-600" /> :
                        <Copy className="h-3.5 w-3.5 text-gray-600" />
                      }
                    </Button>
                  )}
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form
          id="chat-form"
          onSubmit={handleFormSubmit}
          className="max-w-3xl mx-auto relative flex items-end gap-2"
        >
          <Button variant="ghost" size="icon" className="flex-shrink-0 mb-1" type="button">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            className="flex-1 pr-12 py-2 min-h-[40px] max-h-[200px] bg-gray-100 border-none focus-visible:ring-1 focus-visible:ring-offset-0 resize-none overflow-y-auto"
            value={input}
            placeholder="Type your message here..."
            onChange={handleInputChange}
            disabled={isLoading}
            rows={1}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.closest('form');
                if (form && input.trim()) {
                  handleFormSubmit(new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>);
                }
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-8 w-8 flex-shrink-0 mb-1"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}