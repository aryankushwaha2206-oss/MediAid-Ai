'use client';
import ChatInterface from '@/components/chat-interface';
import { useLocale } from '@/hooks/use-locale';

export default function ChatPage() {
  const { t } = useLocale();
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">{t('chat.title')}</h1>
        <p className="text-muted-foreground">{t('chat.description')}</p>
      </header>
      <ChatInterface />
    </div>
  );
}
