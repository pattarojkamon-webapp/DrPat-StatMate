export interface StatResult {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  n: number;
}

export interface DataPoint {
  id: number;
  value: number;
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  label: string;
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

export enum AnalysisType {
  DESCRIPTIVE = 'Descriptive Statistics',
  T_TEST = 'Independent Samples T-Test',
  CORRELATION = 'Correlation Matrix'
}