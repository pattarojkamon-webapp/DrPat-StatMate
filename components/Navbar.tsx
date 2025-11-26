import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Calculator, MessageSquare, Home, Menu, X, Activity, ChevronDown, PieChart, TrendingUp, Grid, Users, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, ThemeColor } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const themeColors: { id: ThemeColor; color: string; label: string }[] = [
    { id: 'indigo', color: 'bg-indigo-600', label: 'Indigo' },
    { id: 'rose', color: 'bg-rose-600', label: 'Rose' },
    { id: 'teal', color: 'bg-teal-600', label: 'Teal' },
    { id: 'blue', color: 'bg-blue-600', label: 'Blue' },
    { id: 'amber', color: 'bg-amber-600', label: 'Amber' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Activity size={28} />
            <span className="text-xl font-bold tracking-tight text-slate-900">StatMate</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home size={18} /> {t('nav_home')}
            </Link>

            {/* Analysis Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  ['/descriptive', '/ttest', '/anova', '/correlation', '/regression', '/chi-square', '/sample-size'].includes(location.pathname)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BarChart2 size={18} /> {t('nav_stats')} <ChevronDown size={14} />
              </button>
              
              {/* Hover Dropdown */}
              <div className="absolute left-0 mt-0 w-60 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left overflow-hidden z-50">
                <div className="p-2 space-y-1">
                   <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('nav_basic')}</div>
                   <Link to="/descriptive" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <BarChart2 size={16} className="text-blue-500" /> Descriptive Stats
                   </Link>
                   <Link to="/sample-size" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <Users size={16} className="text-emerald-500" /> Sample Size
                   </Link>
                   <Link to="/ttest" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <Calculator size={16} className="text-teal-500" /> T-Tests (Welch)
                   </Link>
                   
                   <div className="border-t border-slate-100 my-1"></div>
                   
                   <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">{t('nav_advanced')}</div>
                   <Link to="/anova" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <Grid size={16} className="text-purple-500" /> ANOVA
                   </Link>
                   <Link to="/correlation" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <TrendingUp size={16} className="text-orange-500" /> Correlation
                   </Link>
                   <Link to="/regression" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <TrendingUp size={16} className="text-red-500" /> Regression
                   </Link>
                    <Link to="/chi-square" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg">
                      <PieChart size={16} className="text-green-500" /> Chi-Square
                   </Link>
                </div>
              </div>
            </div>

            <Link
              to="/consultant"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive('/consultant') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={18} /> {t('nav_consultant')}
            </Link>

            <div className="ml-4 border-l border-slate-200 pl-4 flex items-center gap-2">
               {/* Theme Switcher */}
               <div className="relative">
                  <button 
                    onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                    className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    title="Change Theme Color"
                  >
                    <Palette size={18} />
                  </button>
                  {themeDropdownOpen && (
                     <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl p-2 space-y-1 z-50">
                        {themeColors.map((t) => (
                           <button
                              key={t.id}
                              onClick={() => { setTheme(t.id); setThemeDropdownOpen(false); }}
                              className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm transition-colors ${theme === t.id ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'}`}
                           >
                              <div className={`w-4 h-4 rounded-full ${t.color}`}></div>
                              {t.label}
                           </button>
                        ))}
                     </div>
                  )}
                  {/* Overlay to close dropdown */}
                  {themeDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)}></div>
                  )}
               </div>

               {/* Language Switcher */}
                <button 
                    onClick={() => setLanguage('th')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${language === 'th' ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-primary-600'}`}
                >TH</button>
                <button 
                    onClick={() => setLanguage('en')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-primary-600'}`}
                >EN</button>
                 <button 
                    onClick={() => setLanguage('zh')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${language === 'zh' ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-primary-600'}`}
                >ZH</button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-2 space-y-1 shadow-lg h-[calc(100vh-64px)] overflow-y-auto">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">
               <Home size={20} /> {t('nav_home')}
            </Link>
            
            <div className="py-2">
                <div className="px-3 text-xs font-bold text-slate-400 uppercase mb-2">{t('nav_stats')}</div>
                <Link to="/descriptive" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   Descriptive Stats
                </Link>
                <Link to="/sample-size" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   Sample Size
                </Link>
                <Link to="/ttest" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   T-Tests
                </Link>
                <Link to="/anova" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   ANOVA (AI)
                </Link>
                 <Link to="/correlation" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   Correlation (AI)
                </Link>
                 <Link to="/regression" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 rounded-md pl-6">
                   Regression (AI)
                </Link>
            </div>

            <Link to="/consultant" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">
               <MessageSquare size={20} /> {t('nav_consultant')}
            </Link>

            <div className="border-t border-slate-100 mt-2 pt-3 px-3">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Appearance</div>
                <div className="flex gap-2 mb-4">
                    {themeColors.map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => setTheme(t.id)}
                            className={`w-8 h-8 rounded-full ${t.color} ${theme === t.id ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-3 p-3 border-t border-slate-100 mt-2">
                <button onClick={() => setLanguage('th')} className={`flex-1 py-2 text-sm rounded ${language === 'th' ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-slate-50'}`}>Thai</button>
                <button onClick={() => setLanguage('en')} className={`flex-1 py-2 text-sm rounded ${language === 'en' ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-slate-50'}`}>Eng</button>
                 <button onClick={() => setLanguage('zh')} className={`flex-1 py-2 text-sm rounded ${language === 'zh' ? 'bg-primary-100 text-primary-700 font-bold' : 'bg-slate-50'}`}>Chinese</button>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;