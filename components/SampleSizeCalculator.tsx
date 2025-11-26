import React, { useState, useEffect } from 'react';
import { calculateYamane, calculateKrejcieMorgan } from '../services/statService';
import { Users, Calculator, Info, BookOpen } from 'lucide-react';

const SampleSizeCalculator: React.FC = () => {
  const [population, setPopulation] = useState<string>('1000');
  const [errorMargin, setErrorMargin] = useState<string>('0.05');
  const [yamaneResult, setYamaneResult] = useState<number>(0);
  const [kmResult, setKmResult] = useState<number>(0);

  useEffect(() => {
    const N = parseInt(population.replace(/,/g, ''), 10);
    const e = parseFloat(errorMargin);

    if (!isNaN(N) && N > 0 && !isNaN(e) && e > 0 && e < 1) {
      setYamaneResult(calculateYamane(N, e));
      // Krejcie & Morgan typically uses fixed 0.05, but formula allows var. 
      // We will use the same error margin for comparison if it's 0.05, 
      // but usually K&M is strictly 0.05 in standard tables.
      setKmResult(calculateKrejcieMorgan(N, e));
    } else {
      setYamaneResult(0);
      setKmResult(0);
    }
  }, [population, errorMargin]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Users className="text-primary-600" size={32} />
          Sample Size Calculator
        </h1>
        <p className="text-slate-500 mt-2">
          Determine the ideal sample size using standard research methodologies: <br/>
          <strong>Taro Yamane</strong> and <strong>Krejcie & Morgan</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-primary-500" /> Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Population Size (N)
                </label>
                <input
                  type="number"
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g., 1000"
                />
                <p className="text-xs text-slate-400 mt-1">Total number of people in your target group.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Error Margin (e) / Precision
                </label>
                <select 
                  value={errorMargin}
                  onChange={(e) => setErrorMargin(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="0.01">0.01 (1% Error - Very High Precision)</option>
                  <option value="0.05">0.05 (5% Error - Standard)</option>
                  <option value="0.10">0.10 (10% Error - Low Precision)</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">Standard academic research typically uses 0.05 (95% Confidence).</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 text-primary-800 text-sm flex gap-3">
            <Info className="shrink-0 mt-0.5" size={18} />
            <p>
              These calculators assume a 95% confidence level and P=0.5 (maximum variability) to ensure the sample size is sufficient for any population distribution.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="md:col-span-7 space-y-6">
          {/* Yamane Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Taro Yamane (1967)</h3>
              <span className="text-xs font-mono text-slate-500">Simple Formula</span>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-sm text-slate-500">Required Sample Size</p>
                 <p className="text-xs text-slate-400 max-w-[200px]">Suitable for known finite populations when variance is unknown.</p>
              </div>
              <div className="text-5xl font-bold text-primary-600">
                {yamaneResult.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Krejcie & Morgan Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Krejcie & Morgan (1970)</h3>
              <span className="text-xs font-mono text-slate-500">Table-based Logic</span>
            </div>
            <div className="p-6 flex items-center justify-between">
               <div className="space-y-1">
                 <p className="text-sm text-slate-500">Required Sample Size</p>
                 <p className="text-xs text-slate-400 max-w-[200px]">Widely accepted standard for academic research articles.</p>
              </div>
              <div className="text-5xl font-bold text-teal-600">
                {kmResult.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Comparison Note */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
             <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={16} /> Which one to choose?
             </h4>
             <ul className="list-disc list-inside space-y-1 ml-1">
                <li><strong>Yamane:</strong> Often used when only the population size is known and a simple calculation is needed.</li>
                <li><strong>Krejcie & Morgan:</strong> More robust as it incorporates Chi-square values. It is preferred in higher-level academic journals (Master's/Ph.D.).</li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SampleSizeCalculator;