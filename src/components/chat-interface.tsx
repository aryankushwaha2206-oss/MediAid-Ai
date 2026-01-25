'use client';

import {
  detectEmergencyAction,
  medicalAIChatAction,
} from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import EmergencyAlertDialog from './emergency-alert-dialog';

interface Message {
  role: 'user' | 'ai' | 'loading';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        'Hello! I am MediaID AI. How can I assist you with your health questions today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const emergencyResult = await detectEmergencyAction({ userInput });
      if (emergencyResult.isEmergency) {
        setIsEmergency(true);
        setMessages((prev) =>
          prev.filter((msg) => msg.content !== userInput)
        );
        setIsLoading(false);
        return;
      }

      const aiResult = await medicalAIChatAction({ question: userInput });

      if (aiResult.error) {
        throw new Error(aiResult.error);
      }

      const aiResponse = `${aiResult.answer}\n\n**${aiResult.disclaimer}**`;
      setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Failed to get a response from the AI. Please try again.',
      });
      setMessages((prev) => prev.slice(0, prev.length -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-grow flex flex-col border rounded-lg bg-card overflow-hidden">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role !== 'user' && (
                  <Avatar className="border">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="border">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-4 justify-start">
                  <Avatar className="border">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                   <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="animate-spin size-5"/>
                   </div>
               </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-card">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
      <EmergencyAlertDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
