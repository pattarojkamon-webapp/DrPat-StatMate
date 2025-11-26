import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DescriptiveStats from './components/DescriptiveStats';
import TTest from './components/TTest';
import AIConsultant from './components/AIConsultant';
import UniversalStatTool from './components/UniversalStatTool';
import SampleSizeCalculator from './components/SampleSizeCalculator';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col text-slate-800">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Basic Tools (JS Based) */}
                <Route path="/descriptive" element={<DescriptiveStats />} />
                <Route path="/ttest" element={<TTest />} />
                <Route path="/sample-size" element={<SampleSizeCalculator />} />
                
                {/* Advanced Tools (AI Based) */}
                <Route path="/anova" element={
                  <UniversalStatTool 
                    title="Analysis of Variance (ANOVA)" 
                    description="One-way, Factorial, or Repeated Measures ANOVA. Checks assumptions and provides F-statistics."
                    defaultPrompt="Paste your data here. Example: Group A: 10, 12... Group B: 15, 14..."
                  />
                } />
                <Route path="/correlation" element={
                  <UniversalStatTool 
                    title="Correlation Analysis" 
                    description="Pearson (r) or Spearman (rho) correlation matrices with significance levels."
                    defaultPrompt="Provide two or more variables to check for relationships."
                  />
                } />
                <Route path="/regression" element={
                  <UniversalStatTool 
                    title="Linear Regression" 
                    description="Simple or Multiple Linear Regression models. Returns R-squared, coefficients, and p-values."
                    defaultPrompt="IV: Hours Studied, DV: Exam Score. Data: ..."
                  />
                } />
                 <Route path="/chi-square" element={
                  <UniversalStatTool 
                    title="Chi-Square Test" 
                    description="Test of Independence or Goodness-of-Fit for categorical data."
                    defaultPrompt="Provide contingency table data or raw categorical counts."
                  />
                } />
                
                <Route path="/consultant" element={<AIConsultant />} />
              </Routes>
            </main>
            <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
              <div className="flex flex-col items-center justify-center gap-3">
                 <img 
                    src="https://i.postimg.cc/RVVYZdHd/Dr-Pattaroj-Orange.png" 
                    alt="Dr. Pattaroj Kamolrojsiri" 
                    className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-300"
                 />
                 <div>
                    <p className="font-semibold text-slate-700 text-base">พัฒนาโดย ดร.พัทธโรจน์ กมลโรจน์สิริ</p>
                    <p className="text-xs mt-1">© {new Date().getFullYear()} StatMate. Designed for Research & Jamovi Consulting.</p>
                 </div>
              </div>
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;