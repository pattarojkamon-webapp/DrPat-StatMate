import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'th' | 'zh';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    nav_home: "Home",
    nav_stats: "Statistics",
    nav_consultant: "AI Consultant",
    nav_basic: "Basic Tools",
    nav_advanced: "Advanced (AI)",
    hero_title: "Simplify Your",
    hero_highlight: "Research Analysis",
    hero_desc: "An integrated platform for quick statistical calculations, data visualization, and AI-powered research consultation.",
    btn_start: "Start Analyzing",
    btn_ask: "Ask AI Consultant",
    feature_desc_stats: "Descriptive Stats",
    feature_desc_ttest: "T-Test Calculator",
    feature_desc_consultant: "Jamovi Consultant",
    ai_placeholder: "Type your question or upload data...",
    ai_welcome: "Hello! I am your Research & Jamovi Consultant. Send me data, charts, or PDFs to get started.",
    ai_clear_history: "Clear History",
    ai_suggest_1: "Interpret this result (APA)",
    ai_suggest_2: "Check ANOVA Assumptions",
    ai_suggest_3: "How to do Regression in Jamovi",
    ai_suggest_4: "Explain p-value & CI",
    ai_reading: "Reading data & Analyzing...",
    ai_error: "Unable to connect. Please check API Key.",
    ai_copy: "Copy Markdown",
    ai_export: "Export PDF",
    stat_input_label: "Data Input",
    stat_result: "Analysis Results"
  },
  th: {
    nav_home: "หน้าหลัก",
    nav_stats: "เครื่องมือสถิติ",
    nav_consultant: "ที่ปรึกษา AI",
    nav_basic: "เครื่องมือพื้นฐาน",
    nav_advanced: "ขั้นสูง (AI)",
    hero_title: "ทำให้งานวิจัย",
    hero_highlight: "เป็นเรื่องง่าย",
    hero_desc: "แพลตฟอร์มครบวงจรสำหรับการคำนวณทางสถิติ การสร้างกราฟ และที่ปรึกษาวิจัยส่วนตัวด้วย AI",
    btn_start: "เริ่มวิเคราะห์",
    btn_ask: "ปรึกษา AI",
    feature_desc_stats: "สถิติเชิงพรรณนา",
    feature_desc_ttest: "การทดสอบที (T-Test)",
    feature_desc_consultant: "ผู้เชี่ยวชาญ Jamovi",
    ai_placeholder: "พิมพ์คำถาม หรืออัปโหลดไฟล์ข้อมูล...",
    ai_welcome: "สวัสดีครับ! ผมคือผู้ช่วยปรึกษางานวิจัยและผู้เชี่ยวชาญ Jamovi ส่งข้อมูล ไฟล์ CSV, ภาพกราฟ หรือ PDF มาได้เลยครับ",
    ai_clear_history: "ล้างประวัติแชท",
    ai_suggest_1: "ช่วยแปลผลตารางนี้ (APA)",
    ai_suggest_2: "ตรวจสอบ Assumption ของ ANOVA",
    ai_suggest_3: "สอนทำ Regression ใน Jamovi",
    ai_suggest_4: "อธิบาย p-value และ CI",
    ai_reading: "กำลังอ่านข้อมูลและวิเคราะห์...",
    ai_error: "ไม่สามารถเชื่อมต่อได้ โปรดตรวจสอบ API Key",
    ai_copy: "คัดลอกข้อความ",
    ai_export: "ส่งออก PDF",
    stat_input_label: "นำเข้าข้อมูล",
    stat_result: "ผลลัพธ์การวิเคราะห์"
  },
  zh: {
    nav_home: "首页",
    nav_stats: "统计工具",
    nav_consultant: "AI 顾问",
    nav_basic: "基础工具",
    nav_advanced: "高级工具 (AI)",
    hero_title: "简化您的",
    hero_highlight: "研究分析",
    hero_desc: "一个集成的平台，用于快速统计计算、数据可视化和 AI 驱动的研究咨询。",
    btn_start: "开始分析",
    btn_ask: "咨询 AI",
    feature_desc_stats: "描述性统计",
    feature_desc_ttest: "T 检验计算器",
    feature_desc_consultant: "Jamovi 顾问",
    ai_placeholder: "输入问题或上传数据...",
    ai_welcome: "你好！我是您的研究和 Jamovi 顾问。请发送数据、图表或 PDF 开始。",
    ai_clear_history: "清除历史记录",
    ai_suggest_1: "解释此结果 (APA 格式)",
    ai_suggest_2: "检查 ANOVA 假设",
    ai_suggest_3: "如何在 Jamovi 中做回归",
    ai_suggest_4: "解释 p 值和置信区间",
    ai_reading: "正在读取数据并分析...",
    ai_error: "无法连接。请检查 API 密钥。",
    ai_copy: "复制 Markdown",
    ai_export: "导出 PDF",
    stat_input_label: "数据输入",
    stat_result: "分析结果"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th'); // Default to Thai

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};