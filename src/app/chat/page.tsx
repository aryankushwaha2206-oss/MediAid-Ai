import ChatInterface from '@/components/chat-interface';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Medical AI Chat</h1>
        <p className="text-muted-foreground">
          Ask your health-related questions in a safe and supportive space.
        </p>
      </header>
      <ChatInterface />
    </div>
  );
}
