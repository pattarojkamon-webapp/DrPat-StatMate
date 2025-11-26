import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3, MessageSquare } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
      {/* Professional Workspace Hero */}
      <section className="text-center max-w-2xl mx-auto px-6">
        
        <div className="mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-white border border-slate-200 shadow-sm rounded-xl mb-6">
                <img 
                    src="https://i.postimg.cc/RVVYZdHd/Dr-Pattaroj-Orange.png" 
                    alt="Logo" 
                    className="h-12 w-auto object-contain opacity-90 grayscale hover:grayscale-0 transition-all duration-500"
                 />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              {t('hero_title')} <span className="text-primary-600">{t('hero_highlight')}</span>
            </h1>
            <p className="text-slate-500 text-lg">
              StatMate Enterprise
            </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
          <Link 
            to="/descriptive" 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
          >
            <BarChart3 size={18} />
            {t('btn_start')}
          </Link>
          <Link 
            to="/consultant" 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
          >
             <MessageSquare size={18} />
             {t('btn_ask')}
          </Link>
        </div>

      </section>
    </div>
  );
};

export default Home;