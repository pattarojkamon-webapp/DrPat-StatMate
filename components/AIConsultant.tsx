import React, { useState, useRef, useEffect } from 'react';
import { getConsultationResponse } from '../services/geminiService';
import { ChatMessage, FileAttachment } from '../types';
import { Send, User, Bot, Loader2, AlertTriangle, Paperclip, FileText, X, Copy, Download, File as FileIcon, Image as ImageIcon, Sparkles, CheckCircle2, Calculator, HelpCircle, Trash2 } from 'lucide-react';
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
        // Need to revive dates from JSON
        const parsed = JSON.parse(savedHistory, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
        });
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    } else {
      // Set initial welcome message if no history
       setMessages([{
        role: 'model',
        text: t('ai_welcome'),
        timestamp: new Date()
      }]);
    }
  }, []);

  // Save history to LocalStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('statmate_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
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

      // Pass current language setting to API
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
      alert("Markdown copied!");
  };

  const handleExportPDF = (elementId: string) => {
      const element = document.getElementById(elementId);
      if(element && typeof html2pdf !== 'undefined') {
          const opt = {
            margin: 0.5,
            filename: 'statmate_analysis.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          html2pdf().set(opt).from(element).save();
      } else {
          alert("PDF library loading... please wait.");
      }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-primary-900 text-white p-4 rounded-t-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold">Jamovi Research Consultant</h2>
            <p className="text-primary-200 text-xs">Powered by Gemini 2.5 • {language.toUpperCase()}</p>
          </div>
        </div>
        <button 
            onClick={clearHistory} 
            className="flex items-center gap-1 text-xs bg-primary-800 hover:bg-red-600 text-white px-3 py-1.5 rounded transition-colors"
        >
            <Trash2 size={14} /> {t('ai_clear_history')}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary-100 text-primary-600'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Attachments Display */}
                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex gap-2 mb-1 flex-wrap justify-end">
                        {msg.attachments.map((att, i) => (
                            <div key={i} className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                                {att.mimeType.includes('image') ? <ImageIcon size={14}/> : <FileIcon size={14}/>}
                                <span className="max-w-[150px] truncate">{att.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div 
                  id={`msg-${index}`}
                  className={`rounded-2xl p-5 shadow-sm w-full ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 rounded-tl-none'
                }`}>
                  <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} max-w-none text-sm leading-relaxed markdown-table`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 border-b pb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 mt-6 text-primary-700" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2 mt-4 text-primary-600" {...props} />,
                            table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 my-4" {...props} /></div>,
                            th: ({node, ...props}) => <th className="bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border border-slate-200" {...props} />,
                            td: ({node, ...props}) => <td className="px-3 py-2 whitespace-normal text-sm text-slate-600 border border-slate-200" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-primary-900 bg-primary-50 px-1 rounded" {...props} />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Bot Actions Toolbar */}
                {msg.role === 'model' && (
                    <div className="flex gap-2 mt-1">
                        <button 
                            onClick={() => handleCopyMarkdown(msg.text)}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 transition-colors"
                        >
                            <Copy size={12} /> {t('ai_copy')}
                        </button>
                         <button 
                            onClick={() => handleExportPDF(`msg-${index}`)}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 transition-colors"
                        >
                            <Download size={12} /> {t('ai_export')}
                        </button>
                    </div>
                )}
                
                <span className={`text-[10px] ${msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
          </div>
        ))}
        
        {/* Suggested Questions */}
        {messages.length === 1 && !loading && (
          <div className="px-4 mt-4 animate-fade-in">
             <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                <Sparkles size={12} /> Suggested Questions
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getSuggestions().map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="flex items-center gap-3 p-3 text-sm text-left text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-200 hover:shadow-sm transition-all group"
                  >
                    <div className="bg-slate-50 group-hover:bg-white p-2 rounded-lg transition-colors border border-slate-100 group-hover:border-primary-100">
                        {s.icon}
                    </div>
                    <span>{s.text}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
               <Bot size={20} />
             </div>
             <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100 flex items-center gap-2">
                <Loader2 className="animate-spin text-primary-600" size={18} />
                <span className="text-slate-500 text-sm">{t('ai_reading')}</span>
             </div>
          </div>
        )}

        {error && (
            <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm">
                <AlertTriangle size={20} />
                {error}
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border border-slate-200 rounded-b-xl shadow-sm">
         {/* Attachments Preview */}
         {attachments.length > 0 && (
             <div className="flex gap-3 mb-3 overflow-x-auto py-2">
                 {attachments.map((att, i) => (
                     <div key={i} className="relative bg-primary-50 border border-primary-100 rounded-lg p-2 flex items-center gap-2 min-w-[120px]">
                         <div className="bg-white p-1 rounded text-primary-600">
                             {att.mimeType.includes('image') ? <ImageIcon size={16}/> : <FileIcon size={16}/>}
                         </div>
                         <span className="text-xs text-primary-900 truncate max-w-[100px]">{att.name}</span>
                         <button 
                            onClick={() => removeAttachment(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                         >
                             <X size={12} />
                         </button>
                     </div>
                 ))}
             </div>
         )}

        <div className="flex gap-2 items-end">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors border border-transparent hover:border-primary-100"
            title="Upload PDF, CSV, or Image"
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
            className="flex-grow px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none h-[52px] max-h-32"
            disabled={loading}
          />
          <button
            onClick={handleSendClick}
            disabled={loading || (!input.trim() && attachments.length === 0)}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors h-[52px] w-[52px] flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          AI can analyze Charts, CSV data, and Research PDFs.
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;