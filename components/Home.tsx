import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, MessageSquare, Calculator, FileText, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          Jamovi Stats & Dev Expert
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          {t('hero_title')} <span className="text-primary-600">{t('hero_highlight')}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          {t('hero_desc')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/descriptive" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
            {t('btn_start')}
          </Link>
          <Link to="/consultant" className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition">
             {t('btn_ask')}
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <BarChart2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('feature_desc_stats')}</h3>
          <p className="text-slate-500 leading-relaxed">
            Quickly calculate Mean, SD, Median, and visualize distributions with interactive histograms. Copy APA-formatted snippets instantly.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
            <Calculator size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('feature_desc_ttest')}</h3>
          <p className="text-slate-500 leading-relaxed">
            Compare two independent groups. We utilize Welch's method to handle unequal variances, a robust default for modern research.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">AI POWERED</div>
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('feature_desc_consultant')}</h3>
          <p className="text-slate-500 leading-relaxed">
            Chat with our expert AI. Get advice on assumption checking, module selection (jpower, medmod), and writing academic interpretations.
          </p>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="bg-slate-900 text-slate-300 rounded-3xl p-8 md:p-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-primary-500 rounded-full opacity-10 blur-3xl"></div>
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="text-primary-400" />
                Statistical Consulting Philosophy
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <FileText size={16} /> Assumption Checking
                    </h4>
                    <p className="text-sm text-slate-400">
                        We prioritize validating assumptions (Normality, Homogeneity) before running tests. Our AI is trained to remind you of these crucial steps.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <FileText size={16} /> Effect Sizes
                    </h4>
                    <p className="text-sm text-slate-400">
                        Beyond p-values, we emphasize reporting Effect Sizes (Cohen's d, Eta Squared) to determine practical significance.
                    </p>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;