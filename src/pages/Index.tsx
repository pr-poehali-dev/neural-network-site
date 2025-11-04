import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('linkin park') || input.includes('линкин парк')) {
      if (input.includes('кто') || input.includes('что за') || input.includes('расскажи')) {
        return 'Linkin Park — американская рок-группа из Калифорнии, основанная в 1996 году. Стала одной из самых успешных групп 2000-х, продав более 100 миллионов альбомов по всему миру.';
      }
      if (input.includes('состав') || input.includes('участники') || input.includes('кто входит')) {
        return 'Основной состав: Майк Шинода (вокал, рэп), Честер Беннингтон (вокал, 1976-2017), Брэд Делсон (гитара), Дэйв Фаррелл (бас), Джо Хан (диджей), Роб Бурдон (ударные). После трагической смерти Честера в 2017 году группа взяла паузу.';
      }
      if (input.includes('альбом') || input.includes('песн') || input.includes('хит')) {
        return 'Главные альбомы: Hybrid Theory (2000), Meteora (2003), Minutes to Midnight (2007), A Thousand Suns (2010). Хиты: "In The End", "Numb", "Crawling", "What I\'ve Done", "Breaking The Habit".';
      }
      if (input.includes('жанр') || input.includes('стиль')) {
        return 'Linkin Park сочетали ню-метал, альтернативный рок, электронную музыку и хип-хоп. Их звучание эволюционировало от агрессивного ню-метала к более мелодичному альтернативному року.';
      }
      return 'Linkin Park — легендарная рок-группа, оставившая огромный след в музыке 2000-х. Что именно вас интересует: история, участники, альбомы или стиль?';
    }
    
    if (input.includes('честер') || input.includes('chester') || input.includes('беннингтон')) {
      return 'Честер Беннингтон (1976-2017) — вокалист Linkin Park с невероятно эмоциональным голосом. Его мощный скриминг и чувственные баллады стали визитной карточкой группы. Трагически ушёл из жизни в 2017 году.';
    }
    
    if (input.includes('майк') || input.includes('шинода') || input.includes('shinoda')) {
      return 'Майк Шинода — сооснователь Linkin Park, MC, продюсер и художник. Отвечал за рэп-партии, продюсирование и визуальное оформление группы. После смерти Честера продолжил сольную карьеру и возглавил проекты группы.';
    }

    return 'Привет! Я сергиндоус SGPT 1. Спроси меня о Linkin Park — я знаю их историю, участников, альбомы и стиль! 🎸';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuestion = input.trim();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(userQuestion),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Sparkles" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">сергиндоус SGPT 1</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon name="MessageSquare" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Начните диалог</h2>
              <p className="text-muted-foreground">
                Задайте любой вопрос — сергиндоус SGPT 1 ответит
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`fade-in flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Bot" size={18} className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-5 py-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="User" size={18} className="text-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="fade-in flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Icon name="Bot" size={18} className="text-white" />
              </div>
              <div className="rounded-2xl px-5 py-3 bg-card border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение..."
              className="min-h-[52px] max-h-[200px] resize-none bg-card border-border focus-visible:ring-primary"
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-[52px] px-6 bg-primary hover:bg-primary/90"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Нажмите Enter для отправки, Shift+Enter для новой строки
          </p>
        </form>
      </footer>
    </div>
  );
};

export default Index;