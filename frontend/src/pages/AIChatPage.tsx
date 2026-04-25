import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIChatPage = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Spendez AI assistant. Ask me anything about your expenses, group debts, or how to save money!", isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now(), text: query, isUser: true }];
    setMessages(newMessages);
    setQuery('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages([...newMessages, { 
        id: Date.now() + 1, 
        text: "I can analyze your spending patterns once we connect the analytics endpoint! For now, your biggest expense category seems to be FOOD.", 
        isUser: false 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-20">
      <header className="space-y-1 mb-6 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Intelligence</p>
        <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Spendez AI</h1>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 hide-scrollbar">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-[24px] p-4 ${msg.isUser ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-[#1A1A1A] border border-white/5 text-white rounded-tl-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[24px] rounded-tl-sm p-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative mt-auto flex-shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your expenses..."
          className="w-full bg-[#1A1A1A] text-white rounded-[24px] py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-white/5 shadow-xl"
        />
        <button 
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </form>
    </div>
  );
};

export default AIChatPage;