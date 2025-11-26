import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Calculator, MessageSquare, Home, Menu, X, Activity, ChevronDown, PieChart, TrendingUp, Grid, Users, Palette, Search } from 'lucide-react';
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
  const isStatsActive = ['/descriptive', '/ttest', '/anova', '/correlation', '/regression', '/chi-square', '/sample-size'].includes(location.pathname);

  const themeColors: { id: ThemeColor; color: string; label: string }[] = [
    { id: 'indigo', color: 'bg-indigo-600', label: 'Indigo' },
    { id: 'rose', color: 'bg-rose-600', label: 'Rose' },
    { id: 'teal', color: 'bg-teal-600', label: 'Teal' },
    { id: 'blue', color: 'bg-blue-600', label: 'Blue' },
    { id: 'amber', color: 'bg-amber-600', label: 'Amber' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-md group-hover:bg-primary-700 transition-colors">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">StatMate</span>
               <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Enterprise Edition</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home size={16} /> {t('nav_home')}
            </Link>

            {/* Analysis Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isStatsActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BarChart2 size={16} /> {t('nav_stats')} <ChevronDown size={14} className="opacity-50" />
              </button>
              
              {/* Dropdown Menu - Business Style */}
              <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-left overflow-hidden z-50">
                <div className="p-1 space-y-0.5">
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 mb-1">
                      {t('nav_basic')}
                   </div>
                   <Link to="/descriptive" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <BarChart2 size={16} className="text-slate-400" /> Descriptive Stats
                   </Link>
                   <Link to="/sample-size" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <Users size={16} className="text-slate-400" /> Sample Size
                   </Link>
                   <Link to="/ttest" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <Calculator size={16} className="text-slate-400" /> T-Tests (Welch)
                   </Link>
                   
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-t border-slate-100 my-1">
                      {t('nav_advanced')}
                   </div>
                   <Link to="/anova" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <Grid size={16} className="text-slate-400" /> ANOVA
                   </Link>
                   <Link to="/correlation" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <TrendingUp size={16} className="text-slate-400" /> Correlation
                   </Link>
                   <Link to="/regression" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <TrendingUp size={16} className="text-slate-400" /> Regression
                   </Link>
                    <Link to="/chi-square" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-700 rounded-md">
                      <PieChart size={16} className="text-slate-400" /> Chi-Square
                   </Link>
                </div>
              </div>
            </div>

            <Link
              to="/consultant"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive('/consultant') 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={16} /> {t('nav_consultant')}
            </Link>

            {/* Right Side Tools */}
            <div className="ml-6 border-l border-slate-200 pl-4 flex items-center gap-3">
               
               {/* Theme Picker */}
               <div className="relative">
                  <button 
                    onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Theme"
                  >
                    <div className={`w-3 h-3 rounded-full ${themeColors.find(tc => tc.id === theme)?.color || 'bg-indigo-600'}`}></div>
                  </button>
                  {themeDropdownOpen && (
                     <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50">
                        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">Select Theme</div>
                        {themeColors.map((t) => (
                           <button
                              key={t.id}
                              onClick={() => { setTheme(t.id); setThemeDropdownOpen(false); }}
                              className={`flex items-center gap-3 w-full px-2 py-1.5 rounded-md text-xs transition-colors ${theme === t.id ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                           >
                              <div className={`w-3 h-3 rounded-full ${t.color}`}></div>
                              {t.label}
                           </button>
                        ))}
                     </div>
                  )}
                  {themeDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)}></div>}
               </div>

               {/* Language Toggles */}
               <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  {['th', 'en', 'zh'].map((lang) => (
                    <button 
                        key={lang}
                        onClick={() => setLanguage(lang as any)} 
                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                            language === lang 
                                ? 'bg-white text-primary-700 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {lang}
                    </button>
                  ))}
               </div>
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
        <div className="md:hidden bg-white border-t border-slate-200 shadow-xl absolute w-full z-50">
            <div className="p-2 space-y-1">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Home size={18} /> {t('nav_home')}
                </Link>
                
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase">Analysis Tools</div>
                
                <Link to="/descriptive" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 pl-8">Descriptive Stats</Link>
                <Link to="/ttest" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 pl-8">T-Tests</Link>
                <Link to="/anova" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 pl-8">ANOVA</Link>
                <Link to="/regression" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 pl-8">Regression</Link>
                
                <Link to="/consultant" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 mt-2">
                    <MessageSquare size={18} /> {t('nav_consultant')}
                </Link>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;