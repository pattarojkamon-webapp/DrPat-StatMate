import React, { useState, useRef } from 'react';
import { performStatisticalAnalysis } from '../services/geminiService';
import { FileAttachment } from '../types';
import { Upload, ArrowRight, FileText, Loader2, CheckCircle2, Copy, AlertTriangle, X, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

declare const html2pdf: any;

interface UniversalStatToolProps {
  title: string;
  description: string;
  defaultPrompt?: string;
}

const UniversalStatTool: React.FC<UniversalStatToolProps> = ({ title, description, defaultPrompt }) => {
  const [inputData, setInputData] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        
        if (file.type === 'text/csv' || file.type === 'text/plain') {
           const textReader = new FileReader();
           textReader.onload = (ev) => {
               const textContent = ev.target?.result as string;
               if (!inputData) setInputData(textContent.substring(0, 1000) + (textContent.length > 1000 ? '...' : ''));
           };
           textReader.readAsText(file);
        }

        setAttachments(prev => [...prev, {
          name: file.name,
          mimeType: file.type,
          data: base64String
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (!inputData && attachments.length === 0) {
      setError("Please enter data or upload a file to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await performStatisticalAnalysis(title, inputData || "Data provided in attachment", attachments);
      setResult(analysisResult || "No result generated.");
    } catch (err) {
      setError("Analysis failed. Please check your connection or data format.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
      if (result) {
          navigator.clipboard.writeText(result);
          // Toast
      }
  };

  const handleExportPDF = () => {
      const element = document.getElementById('analysis-result');
      if(element && typeof html2pdf !== 'undefined') {
          const opt = {
            margin: 0.5,
            filename: `${title.replace(/\s+/g, '_')}_Report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          html2pdf().set(opt).from(element).save();
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-1 text-sm">{description}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <span>Data Source</span>
            </h3>
            
            <div className="space-y-4">
                {/* File List */}
                {attachments.length > 0 && (
                    <div className="space-y-2">
                        {attachments.map((att, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-md text-xs border border-slate-200">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {att.mimeType.includes('image') ? <ImageIcon size={14} className="text-purple-500"/> : <FileIcon size={14} className="text-blue-500"/>}
                                    <span className="truncate max-w-[150px] font-medium text-slate-700">{att.name}</span>
                                </div>
                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-600">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-600 hover:border-primary-500 hover:text-primary-700 transition-colors text-xs font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Upload size={14} /> Upload File
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".csv,.txt,.pdf,.jpg,.png,.jpeg" />
                </div>

                <div className="relative">
                    <textarea 
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full h-48 p-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none text-slate-700 placeholder:text-slate-400"
                        placeholder={defaultPrompt || "Paste raw data, contingency tables, or variable descriptions here..."}
                    />
                </div>
                
                <button 
                    onClick={handleRunAnalysis}
                    disabled={loading}
                    className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-md font-medium shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                    Run AI Analysis
                </button>
                
                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-100 text-xs p-3 rounded-md flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {error}
                    </div>
                )}
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-blue-900 text-xs">
              <strong className="block mb-1 font-semibold">Pro Tip:</strong> 
              Upload a screenshot of your data directly. The AI Model can read tables from images.
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-8">
            {result ? (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden h-full min-h-[500px] animate-fade-in">
                    <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                            <CheckCircle2 className="text-green-600" size={18} /> Analysis Report
                        </div>
                        <div className="flex gap-1">
                            <button onClick={handleCopy} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 hover:text-primary-600 transition-all border border-transparent hover:border-slate-200" title="Copy Text">
                                <Copy size={16} />
                            </button>
                            <button onClick={handleExportPDF} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 hover:text-red-600 transition-all border border-transparent hover:border-slate-200" title="Export PDF">
                                <FileText size={16} />
                            </button>
                        </div>
                    </div>
                    <div id="analysis-result" className="p-8 prose prose-slate prose-sm max-w-none markdown-table">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 border-b pb-2 text-slate-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-3 mt-6 text-slate-800" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto"><table className="w-full my-4 border-collapse border border-slate-200" {...props} /></div>,
                                th: ({node, ...props}) => <th className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border border-slate-200" {...props} />,
                                td: ({node, ...props}) => <td className="px-3 py-2 text-sm text-slate-700 border border-slate-100" {...props} />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="h-full min-h-[400px] bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <div className="w-12 h-12 bg-white rounded-md border border-slate-100 shadow-sm flex items-center justify-center mb-4">
                        <FileText size={24} className="text-slate-300" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-600">Waiting for Input</h3>
                    <p className="max-w-xs mt-1 text-xs text-slate-400">
                        Upload your dataset or describe variables to generate a full statistical report.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UniversalStatTool;