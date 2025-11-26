import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateDescriptives, generateHistogramData } from '../services/statService';
import { StatResult, HistogramBin } from '../types';
import { Info, AlertCircle, Copy, Upload, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DescriptiveStats: React.FC = () => {
  const [inputText, setInputText] = useState<string>('12, 15, 14, 18, 22, 19, 25, 14, 16, 20, 22, 24, 10, 15');
  const [data, setData] = useState<number[]>([]);
  const [stats, setStats] = useState<StatResult | null>(null);
  const [histogramData, setHistogramData] = useState<HistogramBin[]>([]);
  const [error, setError] = useState<string>('');
  const { mainColor } = useTheme();

  // Parse data on input change
  useEffect(() => {
    try {
      const parsed = inputText
        .split(/[\n,]+/)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(Number);

      if (parsed.some(isNaN)) {
        setError('Please enter valid numbers separated by commas or newlines.');
        setStats(null);
        setHistogramData([]);
        return;
      }

      setError('');
      setData(parsed);
    } catch (e) {
      setError('Error parsing data.');
    }
  }, [inputText]);

  // Calculate stats when data changes
  useEffect(() => {
    if (data.length > 0) {
      setStats(calculateDescriptives(data));
      setHistogramData(generateHistogramData(data, Math.min(10, Math.max(5, Math.floor(Math.sqrt(data.length))))));
    } else {
      setStats(null);
      setHistogramData([]);
    }
  }, [data]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const cleanText = text.replace(/[^0-9,.\n\-\s]/g, ' '); 
      setInputText(cleanText);
    };
    reader.readAsText(file);
  };

  const handleCopyAPA = () => {
    if (!stats) return;
    const text = `The analysis involved ${stats.n} participants. The scores ranged from ${stats.min} to ${stats.max} (M = ${stats.mean.toFixed(2)}, SD = ${stats.stdDev.toFixed(2)}).`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Descriptive Statistics</h1>
            <p className="text-sm text-slate-500 mt-1">Basic exploratory data analysis and visualization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
               <label className="text-sm font-semibold text-slate-800">Dataset Input</label>
               <label className="cursor-pointer text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center gap-1 transition-colors bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                 <Upload size={12} /> Import CSV
                 <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
               </label>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 p-3 text-slate-700 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
              placeholder="Enter numbers separated by commas..."
            />
            
            {error ? (
              <div className="mt-3 flex items-start gap-2 text-red-600 text-xs bg-red-50 p-3 rounded border border-red-100">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : (
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                    <Info size={12}/> Delimiters: Comma, Space, Newline
                </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards - Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Sample Size (N)', value: stats?.n ?? '-' },
              { label: 'Mean', value: stats?.mean.toFixed(2) ?? '-' },
              { label: 'Median', value: stats?.median.toFixed(2) ?? '-' },
              { label: 'Std. Deviation', value: stats?.stdDev.toFixed(2) ?? '-' },
              { label: 'Minimum', value: stats?.min ?? '-' },
              { label: 'Maximum', value: stats?.max ?? '-' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Frequency Distribution</h3>
            <div className="h-72 w-full">
                {histogramData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" tick={{fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 11}} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px'}}
                    />
                    <Bar dataKey="count" fill={mainColor} radius={[4, 4, 0, 0]}>
                        {histogramData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={mainColor} fillOpacity={0.7} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Awaiting data...
                </div>
                )}
            </div>
          </div>

          {/* APA Snippet */}
          {stats && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">APA Format Output</h4>
                <p className="text-slate-800 text-sm font-medium">
                  "Participants had an average score of {stats.mean.toFixed(2)} (SD = {stats.stdDev.toFixed(2)}), ranging from {stats.min} to {stats.max}."
                </p>
              </div>
              <button 
                onClick={handleCopyAPA}
                className="ml-4 p-2 bg-white border border-slate-200 rounded-md hover:border-primary-300 text-slate-500 hover:text-primary-600 transition-colors shadow-sm"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptiveStats;