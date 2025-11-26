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
      // Basic CSV parsing: assuming numbers are in the first column or comma separated
      // We replace all non-numeric/comma/newline chars to clean it up roughly
      const cleanText = text.replace(/[^0-9,.\n\-\s]/g, ' '); 
      setInputText(cleanText);
    };
    reader.readAsText(file);
  };

  const handleCopyAPA = () => {
    if (!stats) return;
    const text = `The analysis involved ${stats.n} participants. The scores ranged from ${stats.min} to ${stats.max} (M = ${stats.mean.toFixed(2)}, SD = ${stats.stdDev.toFixed(2)}).`;
    navigator.clipboard.writeText(text);
    alert("APA formatted text copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">Descriptive Statistics</h1>
        <p className="text-slate-500 mt-2">Explore your data distribution and central tendency measures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">Data Input <Info size={14} className="text-slate-400" /></span>
              <label className="cursor-pointer text-primary-600 hover:text-primary-700 text-xs flex items-center gap-1 transition-colors">
                 <Upload size={12} /> Import CSV
                 <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 p-4 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
              placeholder="Enter numbers separated by commas..."
            />
            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-400 text-center">
              Supported delimiters: Comma, Newline, Space. Supports CSV upload.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'N', value: stats?.n ?? '-' },
              { label: 'Mean', value: stats?.mean.toFixed(2) ?? '-' },
              { label: 'Median', value: stats?.median.toFixed(2) ?? '-' },
              { label: 'Std. Deviation', value: stats?.stdDev.toFixed(2) ?? '-' },
              { label: 'Minimum', value: stats?.min ?? '-' },
              { label: 'Maximum', value: stats?.max ?? '-' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Histogram</h3>
            {histogramData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fontSize: 12}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill={mainColor} radius={[4, 4, 0, 0]}>
                     {histogramData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={mainColor} fillOpacity={0.6 + (index * 0.1)} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data to display
              </div>
            )}
          </div>

          {/* APA Report Snippet */}
          {stats && (
            <div className="bg-primary-50 border border-primary-100 p-4 rounded-lg flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-primary-900 mb-1">APA Style Report Snippet</h4>
                <p className="text-primary-800 text-sm italic">
                  "Participants had an average score of {stats.mean.toFixed(2)} (SD = {stats.stdDev.toFixed(2)}), ranging from {stats.min} to {stats.max}."
                </p>
              </div>
              <button 
                onClick={handleCopyAPA}
                className="p-2 hover:bg-primary-100 rounded-full text-primary-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptiveStats;