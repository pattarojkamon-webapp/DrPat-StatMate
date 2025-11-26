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
        
        // If text/csv, we can also populate the text area for transparency
        if (file.type === 'text/csv' || file.type === 'text/plain') {
           const textReader = new FileReader();
           textReader.onload = (ev) => {
               const textContent = ev.target?.result as string;
               // Preview first 500 chars if it's text
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
          alert("Result copied!");
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
      } else {
          alert("PDF library not ready. Try Ctrl+P (Print as PDF).");
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Upload size={18} className="text-primary-600" /> Data Source
            </h3>
            
            <div className="space-y-3">
                {/* File List */}
                {attachments.length > 0 && (
                    <div className="space-y-2">
                        {attachments.map((att, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded text-sm border border-slate-100">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {att.mimeType.includes('image') ? <ImageIcon size={14} className="text-purple-500"/> : <FileIcon size={14} className="text-blue-500"/>}
                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                </div>
                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
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
                        className="flex-1 py-2 px-3 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary-500 hover:text-primary-600 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <Upload size={16} /> Upload CSV/Img/PDF
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".csv,.txt,.pdf,.jpg,.png,.jpeg" />
                </div>

                <div className="relative">
                    <textarea 
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full h-48 p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder={defaultPrompt || "Paste your dataset here or describe your variables (e.g., IV: Treatment, DV: Score)..."}
                    />
                </div>
                
                <button 
                    onClick={handleRunAnalysis}
                    disabled={loading}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={18} />}
                    Analyze with AI
                </button>
                
                {error && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {error}
                    </div>
                )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
              <strong>Tip:</strong> You can upload a screenshot of your data or a PDF of a previous study. The AI will extract and analyze it.
          </div>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-2">
            {result ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                            <CheckCircle2 className="text-green-500" size={20} /> Analysis Report
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleCopy} className="p-2 hover:bg-slate-200 rounded text-slate-500 hover:text-primary-600" title="Copy Text">
                                <Copy size={18} />
                            </button>
                            <button onClick={handleExportPDF} className="p-2 hover:bg-slate-200 rounded text-slate-500 hover:text-red-600" title="Export PDF">
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>
                    <div id="analysis-result" className="p-8 prose prose-slate max-w-none markdown-table">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 border-b pb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 mt-6 text-primary-700 border-l-4 border-primary-500 pl-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2 mt-4 text-primary-600" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 my-4 border border-slate-200" {...props} /></div>,
                                th: ({node, ...props}) => <th className="bg-slate-50 px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200" {...props} />,
                                td: ({node, ...props}) => <td className="px-4 py-3 whitespace-normal text-sm text-slate-700 border-b border-slate-100" {...props} />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <FileText size={32} className="text-primary-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600">Ready to Analyze</h3>
                    <p className="max-w-md mt-2">
                        Upload your dataset or paste your numbers. The AI Engine will calculate {title} and generate an APA formatted report.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UniversalStatTool;