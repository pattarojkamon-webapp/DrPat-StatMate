import React, { useState } from 'react';
import { calculateTTest } from '../services/statService';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const TTest: React.FC = () => {
  const [groupA, setGroupA] = useState<string>('5, 7, 8, 6, 9, 10, 6, 7');
  const [groupB, setGroupB] = useState<string>('2, 4, 3, 5, 3, 6, 2, 3');
  const [result, setResult] = useState<any>(null);

  const parseData = (str: string) => {
      return str.split(/[\n,]+/)
          .map(s => s.trim())
          .filter(s => s !== '')
          .map(Number)
          .filter(n => !isNaN(n));
  };

  const handleCalculate = () => {
    const dataA = parseData(groupA);
    const dataB = parseData(groupB);
    
    if(dataA.length < 2 || dataB.length < 2) {
        alert("Please enter at least 2 valid numbers for each group.");
        return;
    }

    const res = calculateTTest(dataA, dataB);
    setResult(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Independent Samples T-Test</h1>
        <p className="text-slate-500 mt-2">Compare means between two independent groups (Welch's t-test).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Group A Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block font-semibold text-primary-700 mb-2">Group 1 Data</label>
          <textarea 
            value={groupA}
            onChange={(e) => setGroupA(e.target.value)}
            className="w-full h-40 p-3 bg-primary-50/50 border border-primary-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 1, 2, 3..."
          />
          <div className="mt-2 text-right text-xs text-slate-400">
            Count: {parseData(groupA).length}
          </div>
        </div>

        {/* Group B Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block font-semibold text-teal-700 mb-2">Group 2 Data</label>
          <textarea 
            value={groupB}
            onChange={(e) => setGroupB(e.target.value)}
            className="w-full h-40 p-3 bg-teal-50/50 border border-teal-100 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="e.g., 4, 5, 6..."
          />
           <div className="mt-2 text-right text-xs text-slate-400">
            Count: {parseData(groupB).length}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleCalculate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-primary-200 transition-all flex items-center gap-2"
        >
          Run Analysis <ArrowRight size={18} />
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-fade-in-up">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={20} />
            <h3 className="font-bold text-slate-800">Analysis Results</h3>
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Descriptives</h4>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="pb-2">Group</th>
                    <th className="pb-2">N</th>
                    <th className="pb-2">Mean</th>
                    <th className="pb-2">SD</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-50">
                    <td className="py-2 font-medium text-primary-600">Group 1</td>
                    <td>{result.statA.n}</td>
                    <td>{result.statA.mean.toFixed(2)}</td>
                    <td>{result.statA.stdDev.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-teal-600">Group 2</td>
                    <td>{result.statB.n}</td>
                    <td>{result.statB.mean.toFixed(2)}</td>
                    <td>{result.statB.stdDev.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Inferential Stats (Welch's)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-600">t-statistic</span>
                  <span className="font-mono font-bold text-slate-800">{result.tValue.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-600">df</span>
                  <span className="font-mono text-slate-800">{result.df.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-600">Mean Difference</span>
                  <span className="font-mono text-slate-800">{result.meanDiff.toFixed(3)}</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                  <strong>Note:</strong> This is a simplified calculation. For robust research, ensure assumptions (normality) are met. Use the "AI Consultant" to check your methodology.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TTest;