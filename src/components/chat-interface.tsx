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
import { Bot, Send, User, Loader2, Paperclip, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import EmergencyAlertDialog from './emergency-alert-dialog';
import { useLocale } from '@/hooks/use-locale';
import Image from 'next/image';

interface Message {
  role: 'user' | 'ai' | 'loading';
  content: string;
  image?: string | null;
}

export default function ChatInterface() {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: t('chat.initialMessage'),
    },
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    const userMessage: Message = {
      role: 'user',
      content: userInput,
      image: imagePreview,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setIsLoading(true);

    try {
      const emergencyResult = await detectEmergencyAction({
        userInput,
        language: locale,
      });
      if (emergencyResult.isEmergency) {
        setIsEmergency(true);
        setMessages(prev =>
          prev.filter(
            msg => msg.content !== userInput || msg.image !== imagePreview
          )
        );
        setIsLoading(false);
        return;
      }

      const aiResult = await medicalAIChatAction({
        question: userInput,
        photoDataUri: imagePreview || undefined,
        language: locale,
      });

    if ("error" in aiResult) {
  throw new Error(aiResult.error);
}
      

      const aiResponse = `${aiResult.answer}\n\n**${aiResult.disclaimer}**`;
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('chat.errorTitle'),
        description: t('chat.errorMessage'),
      });
      setMessages(prev => prev.slice(0, prev.length - 1));
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
                    'max-w-md rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.image && (
                    <div className="relative mb-2">
                      <Image
                        src={message.image}
                        alt="user uploaded image"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
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
                  <Loader2 className="animate-spin size-5" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-card space-y-2">
          {imagePreview && (
            <div className="relative w-20 h-20">
              <Image
                src={imagePreview}
                alt="Image preview"
                fill
                className="object-cover rounded-md"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => setImagePreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t('chat.attachFile')}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chat.inputPlaceholder')}
              className="flex-grow"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('chat.send')}</span>
            </Button>
          </form>
        </div>
      </div>
      <EmergencyAlertDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
