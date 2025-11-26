import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = 'indigo' | 'rose' | 'teal' | 'blue' | 'amber';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  mainColor: string; // Returns the 600 shade hex for Charts
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Record<ThemeColor, Record<string, string>> = {
  indigo: {
    50: '238 242 255',
    100: '224 231 255',
    200: '199 210 254',
    300: '165 180 252',
    400: '129 140 248',
    500: '99 102 241',
    600: '79 70 229',
    700: '67 56 202',
    800: '55 48 163',
    900: '49 46 129',
  },
  rose: {
    50: '255 241 242',
    100: '255 228 230',
    200: '254 205 211',
    300: '253 164 175',
    400: '251 113 133',
    500: '244 63 94',
    600: '225 29 72',
    700: '190 18 60',
    800: '159 18 57',
    900: '136 19 55',
  },
  teal: {
    50: '240 253 250',
    100: '204 251 241',
    200: '153 246 228',
    300: '94 234 212',
    400: '45 212 191',
    500: '20 184 166',
    600: '13 148 136',
    700: '15 118 110',
    800: '17 94 89',
    900: '19 78 74',
  },
  blue: {
    50: '239 246 255',
    100: '219 234 254',
    200: '191 219 254',
    300: '147 197 253',
    400: '96 165 250',
    500: '59 130 246',
    600: '37 99 235',
    700: '29 78 216',
    800: '30 64 175',
    900: '30 58 138',
  },
  amber: {
    50: '255 251 235',
    100: '254 243 199',
    200: '253 230 138',
    300: '252 211 77',
    400: '251 191 36',
    500: '245 158 11',
    600: '217 119 6',
    700: '180 83 9',
    800: '146 64 14',
    900: '120 53 15',
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeColor>('indigo');

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    Object.entries(colors).forEach(([shade, value]) => {
      // Cast value to string to satisfy TS constraint if inferred as unknown
      root.style.setProperty(`--primary-${shade}`, value as string);
    });
  }, [theme]);

  // Helper to get hex from RGB string (simple approach for this specific dataset)
  // Since we only store "R G B" string, we need to format it for Chart libraries if they need Hex.
  // However, CSS variables work for most CSS needs. For JS libraries (Recharts), we might need actual values.
  const getMainColorHex = () => {
     // Access with string key to match Record<string, string>
     const rgbStr = themes[theme]['600'];
     const [r, g, b] = rgbStr.split(' ').map(Number);
     return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mainColor: getMainColorHex() }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};