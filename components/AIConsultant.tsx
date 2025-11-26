import React, { useState, useRef, useEffect } from 'react';
import { getConsultationResponse } from '../services/geminiService';
import { ChatMessage, FileAttachment } from '../types';
import { Send, User, Bot, Loader2, AlertTriangle, Paperclip, FileText, X, Copy, Download, File as FileIcon, Image as ImageIcon, Sparkles, CheckCircle2, Calculator, HelpCircle, Trash2, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../contexts/LanguageContext';

declare const html2pdf: any;

const AIConsultant: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Suggestions based on Language
  const getSuggestions = () => [
    { text: t('ai_suggest_1'), icon: <FileText size={16} className="text-blue-500" /> },
    { text: t('ai_suggest_2'), icon: <CheckCircle2 size={16} className="text-green-500" /> },
    { text: t('ai_suggest_3'), icon: <Calculator size={16} className="text-purple-500" /> },
    { text: t('ai_suggest_4'), icon: <HelpCircle size={16} className="text-orange-500" /> },
  ];

  // Load history from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('statmate_chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
        });
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    } else {
       setMessages([{
        role: 'model',
        text: t('ai_welcome'),
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('statmate_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    if (window.confirm('Clear conversation history?')) {
      const initialMsg: ChatMessage = {
         role: 'model',
         text: t('ai_welcome'),
         timestamp: new Date()
      };
      setMessages([initialMsg]);
      localStorage.removeItem('statmate_chat_history');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const base64String = (event.target?.result as string).split(',')[1];
            const newAttachment: FileAttachment = {
                name: file.name,
                mimeType: file.type,
                data: base64String
            };
            setAttachments([...attachments, newAttachment]);
        };
        
        reader.readAsDataURL(file);
    }
  };

  const removeAttachment = (index: number) => {
      setAttachments(attachments.filter((_, i) => i !== index));
  };

  const sendMessage = async (text: string, currentAttachments: FileAttachment[]) => {
    if (!text.trim() && currentAttachments.length === 0) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: new Date(),
      attachments: [...currentAttachments]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setLoading(true);
    setError(null);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getConsultationResponse(userMsg.text, userMsg.attachments, history, language);
      
      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText || 'Error generating response.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError(t('ai_error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = () => sendMessage(input, attachments);
  const handleSuggestionClick = (text: string) => sendMessage(text, []);

  const handleCopyMarkdown = (text: string) => {
      navigator.clipboard.writeText(text);
      // Optional: Toast notification
  };

  const handleExportPDF = (elementId: string) => {
      const element = document.getElementById(elementId);
      if(element && typeof html2pdf !== 'undefined') {
          const opt = {
            margin: 0.5,
            filename: 'statmate_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          html2pdf().set(opt).from(element).save();
      }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header - Enterprise Style */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 p-2 rounded-md border border-primary-100">
            <Bot size={20} className="text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm leading-tight">Jamovi Consultant</h2>
            <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online • Gemini 2.5
            </p>
          </div>
        </div>
        <button 
            onClick={clearHistory} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-slate-50 rounded-md"
            title="Clear History"
        >
            <Trash2 size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-slate-50/50 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar for Bot */}
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                   <Bot size={16} className="text-primary-600" />
                </div>
            )}
            
            <div className={`max-w-[85%] lg:max-w-[75%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* User Name / Time */}
                <div className="flex items-center gap-2 px-1">
                     <span className="text-[11px] font-semibold text-slate-500">
                        {msg.role === 'user' ? 'You' : 'StatMate AI'}
                     </span>
                     <span className="text-[10px] text-slate-400">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                </div>

                {/* Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex gap-2 mb-1 flex-wrap justify-end">
                        {msg.attachments.map((att, i) => (
                            <div key={i} className="bg-white border border-slate-200 text-slate-600 text-xs px-3 py-2 rounded-md shadow-sm flex items-center gap-2">
                                {att.mimeType.includes('image') ? <ImageIcon size={14} className="text-purple-500"/> : <FileIcon size={14} className="text-blue-500"/>}
                                <span className="max-w-[150px] truncate font-medium">{att.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Bubble */}
                <div 
                  id={`msg-${index}`}
                  className={`rounded-lg p-4 shadow-sm border text-sm leading-relaxed w-full ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 markdown-table`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({node, ...props}) => <div className="overflow-x-auto"><table className="w-full my-2" {...props} /></div>,
                            th: ({node, ...props}) => <th className="bg-slate-50/50 px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wider border-b border-slate-200" {...props} />,
                            td: ({node, ...props}) => <td className="px-2 py-1.5 text-sm border-b border-slate-100" {...props} />,
                            a: ({node, ...props}) => <a className="underline decoration-dotted underline-offset-2 hover:text-blue-200" {...props} />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Bot Actions */}
                {msg.role === 'model' && (
                    <div className="flex gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleCopyMarkdown(msg.text)} className="text-[10px] text-slate-400 hover:text-primary-600 flex items-center gap-1">
                            <Copy size={12} /> Copy
                        </button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => handleExportPDF(`msg-${index}`)} className="text-[10px] text-slate-400 hover:text-primary-600 flex items-center gap-1">
                            <Download size={12} /> PDF
                        </button>
                    </div>
                )}
            </div>
          </div>
        ))}
        
        {/* Suggested Questions (Empty State) */}
        {messages.length === 1 && !loading && (
          <div className="px-4 mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {getSuggestions().map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="flex items-center gap-3 p-4 text-sm text-left text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="bg-slate-50 group-hover:bg-primary-50 p-2 rounded-md transition-colors">
                        {s.icon}
                    </div>
                    <span className="font-medium">{s.text}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
               <Bot size={16} className="text-primary-600" />
             </div>
             <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center gap-3 shadow-sm">
                <Loader2 className="animate-spin text-primary-500" size={16} />
                <span className="text-slate-500 text-xs font-medium">{t('ai_reading')}</span>
             </div>
          </div>
        )}

        {error && (
            <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-3 text-sm">
                <AlertTriangle size={16} />
                {error}
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-200">
         {/* Attachments Preview */}
         {attachments.length > 0 && (
             <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                 {attachments.map((att, i) => (
                     <div key={i} className="relative bg-slate-50 border border-slate-200 rounded-md p-2 flex items-center gap-2 min-w-[140px]">
                         <div className="bg-white p-1 rounded border border-slate-100 text-primary-600">
                             {att.mimeType.includes('image') ? <ImageIcon size={14}/> : <FileIcon size={14}/>}
                         </div>
                         <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">{att.name}</span>
                            <span className="text-[10px] text-slate-400">Attached</span>
                         </div>
                         <button 
                            onClick={() => removeAttachment(i)}
                            className="absolute -top-1.5 -right-1.5 bg-slate-200 text-slate-500 rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors"
                         >
                             <X size={10} />
                         </button>
                     </div>
                 ))}
             </div>
         )}

        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors mb-0.5"
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden" 
            accept=".pdf,.csv,.txt,.jpg,.jpeg,.png"
          />

          <div className="flex-grow relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendClick();
                    }
                }}
                placeholder={t('ai_placeholder')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition-all resize-none text-sm text-slate-700 placeholder:text-slate-400 min-h-[46px] max-h-32"
            />
          </div>
          
          <button
            onClick={handleSendClick}
            disabled={loading || (!input.trim() && attachments.length === 0)}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-lg transition-colors mb-0.5 shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          StatMate AI can make mistakes. Please verify critical statistical outputs.
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;