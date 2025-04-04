'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot, Copy, CheckCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    experimental_throttle: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);

  // 检查是否正在加载
  const isLoading = status === 'streaming' || status === 'submitted';

  // 监听用户滚动事件
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      if (!messagesContainer) return;

      // 计算距离底部的距离
      const isAtBottom =
        messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;

      // 如果用户向上滚动，标记为已滚动
      if (!isAtBottom) {
        setUserScrolled(true);
      }

      // 如果用户滚动到底部，重置滚动标记
      if (isAtBottom) {
        setUserScrolled(false);
      }
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // 自动滚动到底部（只有当用户未手动滚动或正在底部时）
  useEffect(() => {
    if (userScrolled) return;

    // 使用requestAnimationFrame确保在DOM更新后滚动
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [messages, userScrolled, status]);

  // 复制内容到剪贴板
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 获取消息文本内容
  const getMessageText = (message: any) => {
    return message.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('');
  };

  // 手动滚动到底部
  const scrollToBottom = () => {
    setUserScrolled(false);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col border-none shadow-none bg-background h-full max-h-full">
        <ScrollArea
          ref={messagesContainerRef}
          className="flex-1 p-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold mb-4">AI助手</h1>
                <p className="text-muted-foreground">发送消息开始对话</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pt-6 pb-20">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role !== 'user' && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn(
                    "px-4 py-3 rounded-lg max-w-[85%]",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-medium text-sm">
                        {message.role === 'user' ? '用户' : 'AI助手'}
                      </div>
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(getMessageText(message), message.id)}
                        >
                          {copied === message.id ?
                            <CheckCheck className="h-3.5 w-3.5" /> :
                            <Copy className="h-3.5 w-3.5" />
                          }
                        </Button>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return <div key={`${message.id}-${i}`}>{part.text}</div>;
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* 滚动到底部按钮 */}
        {userScrolled && messages.length > 0 && (
          <Button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 rounded-full h-10 w-10 p-0"
            size="icon"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}

        {/* 输入区域 */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <Input
              className="pr-12 py-6"
              value={input}
              placeholder="发送消息..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}