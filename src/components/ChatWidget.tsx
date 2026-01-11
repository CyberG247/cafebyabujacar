import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let response = "I'm not sure about that. Please contact us directly at +234 800 123 4567 for more details.";

    // Check if this is the first interaction (messages is empty in current closure)
    if (messages.length === 0) {
      response = "Hello, Welcome to Cafè By ABUJACAR AI Assistant!\nHow may i help you today?";
    } else {
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('menu') || lowerMsg.includes('food') || lowerMsg.includes('drink')) {
        response = "Our menu features a variety of premium coffees, pastries, meals, and refreshing beverages. You can view the full menu by clicking the 'Menu' link at the top of the page!";
      } else if (lowerMsg.includes('hour') || lowerMsg.includes('open') || lowerMsg.includes('time')) {
        response = "We are open Monday to Saturday from 8:00 AM to 10:00 PM, and Sundays from 10:00 AM to 9:00 PM.";
      } else if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
        response = "We are located in the heart of Kado, Abuja. We'd love to see you there!";
      } else if (lowerMsg.includes('order') || lowerMsg.includes('delivery')) {
        response = "You can place an order directly through this website! Just browse the menu, add items to your cart, and proceed to checkout.";
      } else if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('email')) {
        response = "You can reach us at contact@cafebyabujacar.com or call +234 800 123 4567.";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        response = "Hi there! What can I get for you today? ☕";
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    await simulateResponse(userMessage);
  };

  const sendQuickReply = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    simulateResponse(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-primary text-primary-foreground"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl border bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary p-4 text-primary-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Café Support</h3>
              <p className="text-xs opacity-90">Always here to help!</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[400px] p-4 bg-muted/30" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-white border border-border/50 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex gap-2 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-background border-t flex gap-2 overflow-x-auto pb-3">
            {['Menu', 'Opening Hours', 'Location', 'Track Order'].map((text) => (
              <button
                key={text}
                onClick={() => sendQuickReply(text)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors border border-primary/10"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-background border-t">
            <div className="flex gap-2 relative">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 pr-10 rounded-full border-primary/20 focus-visible:ring-primary/30"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()} 
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
