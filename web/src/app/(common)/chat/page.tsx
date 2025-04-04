'use client';

import { useChat, type Message } from '@ai-sdk/react';
import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, useCallback, useMemo } from 'react';
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

// 三点动画加载指示器
const ThreeDotsLoadingIndicator = () => {
  return (
    <div className="flex items-center">
      <div className="flex space-x-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 添加字符级打字效果组件
const TypeWriter: React.FC<{ content: string; isLoading: boolean; scrollToBottom: () => void }> = ({ content, isLoading, scrollToBottom }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(content);
  const indexRef = useRef(0);
  const [showCursor, setShowCursor] = useState(true);

  // 当内容更新时更新引用
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // 当新消息开始时，重置打字效果
  useEffect(() => {
    if (isLoading && indexRef.current === 0) {
      setDisplayedContent('');
    }
  }, [isLoading]);

  // 打字效果逻辑
  useEffect(() => {
    // 如果正在加载中，且显示内容长度小于实际内容，则继续添加字符
    if ((isLoading || displayedContent.length < content.length) &&
      displayedContent.length < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prevContent => {
          // 计算要添加的字符数量，根据加载状态和内容长度动态调整
          let charsToAdd = 1;
          if (content.length - prevContent.length > 20) {
            // 如果剩余内容较多，一次添加更多字符
            charsToAdd = Math.min(5, content.length - prevContent.length);
          }

          // 确保不会超出内容长度
          const endIndex = Math.min(prevContent.length + charsToAdd, content.length);
          return content.substring(0, endIndex);
        });

        // 每次内容更新后滚动到底部
        scrollToBottom();
      }, 15); // 稍微延迟，使效果看起来更自然

      return () => clearTimeout(timer);
    } else if (displayedContent.length >= content.length && isLoading) {
      // 如果已经显示完所有内容但仍在加载，闪烁光标
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(cursorTimer);
    }
  }, [content, displayedContent, isLoading, scrollToBottom]);

  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {displayedContent}
      {isLoading && displayedContent.length >= content.length && showCursor && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse"></span>
      )}
    </div>
  );
};

const examplePrompts = [
  'How does AI work?',
  'Are black holes real?',
  'How many Rs are in the word "strawberry"?',
  'List of good questions to ask an AI chat bot',
];

export default function Chat() {
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const [tempMessages, setTempMessages] = useState<Message[]>([]);

  // 滚动到底部的函数
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    });
  }, []);

  // Get token on component mount (client-side only)
  useEffect(() => {
    setToken(localStorage.getItem('token'));

    // 页面首次加载时自动聚焦输入框
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 300); // 使用稍长的延迟确保组件完全渲染
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
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    experimental_throttle: 0, // 设为0使更新频率最大化，让流式输出更平滑
    onResponse: (response) => {
      // 用于调试流式响应
      if (!response.ok) {
        console.error('流式响应错误:', response.status, response.statusText);
      }
    },
    onFinish: () => {
      // 对话完成时清除临时消息
      setTempMessages([]);
      setIsFirstResponse(true);
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // 合并实际消息和临时消息
  const allMessages = useMemo(() => {
    if (tempMessages.length === 0 || messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      return messages;
    }
    return [...messages, ...tempMessages];
  }, [messages, tempMessages]);

  // 提交表单的增强版处理函数
  const handleEnhancedSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 立即添加临时"思考中"消息
    if (input.trim()) {
      const tempAssistantMessage: Message = {
        id: `temp-${Date.now()}`,
        content: '$$loading$$', // 使用特殊标记，代表这是一个加载状态
        role: 'assistant',
      };

      setTempMessages([tempAssistantMessage]);
      setIsFirstResponse(true);

      // 调用原始提交函数
      handleSubmit(e);

      // 重置输入框高度
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }, 0);
    }
  }, [input, handleSubmit]);

  // 检测实际AI响应开始，移除临时消息
  useEffect(() => {
    if (isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && isFirstResponse) {
      setTempMessages([]);
      setIsFirstResponse(false);
    }
  }, [isLoading, messages, isFirstResponse]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 在流式输出过程中持续滚动到底部
  useEffect(() => {
    if (!isLoading) return;

    // 当有流式输出时，每200毫秒检查并滚动一次
    const intervalId = setInterval(() => {
      scrollToBottom('auto'); // 使用'auto'减少平滑滚动带来的视觉延迟
    }, 200);

    return () => clearInterval(intervalId);
  }, [isLoading, scrollToBottom]);

  // 对话完成后自动聚焦输入框
  useEffect(() => {
    // 当状态从加载变为非加载状态时，自动聚焦
    if (!isLoading && (status === 'ready' || status === 'error') && messages.length > 0) {
      // 短暂延迟确保UI已更新
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [status, isLoading, messages.length]);

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

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
      <ScrollArea
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        scrollHideDelay={100}
        type="always"
      >
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
            {allMessages.map(message => (
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
                    : message.content === '$$loading$$' ? "" : "bg-gray-100"
                )}>
                  {message.role === 'assistant' ? (
                    message.content === '$$loading$$' ? (
                      <ThreeDotsLoadingIndicator />
                    ) : (
                      <TypeWriter
                        content={message.content}
                        isLoading={isLoading && messages[messages.length - 1].id === message.id}
                        scrollToBottom={scrollToBottom}
                      />
                    )
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  )}
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
      <div className="p-4 border-t bg-white flex-shrink-0">
        <form
          id="chat-form"
          onSubmit={handleEnhancedSubmit}
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
                  handleEnhancedSubmit(new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>);
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