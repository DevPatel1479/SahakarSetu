import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, HelpCircle, Briefcase, FileText, Database, Zap } from 'lucide-react';

export default function CareerAssistantPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Namaste! I am the SahakarSetu AI Assistant, powered by RAG (Retrieval-Augmented Generation) on NCCT policies and cooperative laws. I can help you find relevant training modules, discover career paths in cooperatives, or answer policy questions. How can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG Architecture Response
    setTimeout(() => {
      let botResponse = "";
      let source = "";

      const lowerInput = newUserMsg.text.toLowerCase();

      if (lowerInput.includes('pacs') || lowerInput.includes('manager')) {
        botResponse = "To become a PACS (Primary Agricultural Credit Society) Manager, you need to complete the 'Cooperative Governance & Law' module and the 'Financial Management' module. Based on your current profile, you have an 78% skill match for open PACS roles.";
        source = "NCCT Recruitment Guidelines 2024 & Local PostgreSQL Skill Matrix";
      } else if (lowerInput.includes('course') || lowerInput.includes('record keeping')) {
        botResponse = "The 'Digital Record Keeping' module is a 40-minute course available in the LMS. It covers tallying, ledger management, and digitizing cooperative registers. Taking this course will increase your match rate for 'Accounts Assistant' roles by 15%.";
        source = "VAMNICOM Course Catalog";
      } else {
        botResponse = `Based on the NCCT database, here is the information regarding your query about "${newUserMsg.text}". For personalized career paths, I recommend checking the "Employment" tab where our Explainable AI matching engine has queued jobs for you.`;
        source = "SahakarSetu Internal Knowledge Base (RAG)";
      }

      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: botResponse,
          source: source
        }
      ]);
      setIsTyping(false);
    }, 1800);
  };

  const suggestions = [
    { icon: Briefcase, text: 'What are the duties of a PACS Manager?' },
    { icon: FileText, text: 'Find courses for Digital Record Keeping' },
    { icon: HelpCircle, text: 'How do I apply for a leadership position?' }
  ];

  return (
    <div className="max-w-5xl mx-auto mt-6 h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a9e] p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/30">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight">AI Career & Policy Assistant</h1>
            <div className="flex items-center gap-2 text-blue-200 text-xs mt-1 font-medium">
              <Database size={12} /> Powered by RAG Architecture
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#152a45]/40 px-4 py-2 rounded-full border border-white/10">
          <span className="flex items-center gap-2 text-xs font-bold text-green-400">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span> Online
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white ${msg.sender === 'user' ? 'bg-[#c17f24] text-white' : 'bg-[#1e3a5f] text-white'}`}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm flex flex-col ${msg.sender === 'user' ? 'bg-[#c17f24] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.source && (
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Database size={12} /> Source: {msg.source}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start relative z-10">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2.5 h-2.5 bg-[#1e3a5f] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-gray-200 z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {messages.length === 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx}
                onClick={() => { setInput(sug.text); }}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 bg-blue-50/80 hover:bg-blue-100 text-[#1e3a5f] text-sm font-semibold rounded-xl border border-blue-100 transition-colors shadow-sm"
              >
                <sug.icon size={16} className="text-blue-600" /> {sug.text}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about cooperative laws, course recommendations, or career paths..."
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#1e3a5f] outline-none text-gray-800 placeholder-gray-400 transition-colors font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md gap-2"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}


