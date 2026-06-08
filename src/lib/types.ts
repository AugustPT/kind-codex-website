export interface AnswerOption {
  text: string;
  weights: {
    visibility?: number;
    clarity?: number;
    trust?: number;
    conversion?: number;
    followUp?: number;
    salesPath?: number;
  };
}

export interface Question {
  id: string;
  number: number;
  category: string;
  question: string;
  answers: AnswerOption[];
  insight: string;
}

export type ResultCategory =
  | 'visibility'
  | 'clarity'
  | 'trust'
  | 'conversion'
  | 'followUp'
  | 'salesPath'
  | 'fullPath';

export interface DiagnosticResult {
  category: ResultCategory;
  headline: string;
  summary: string;
  recommendedFocus: string[];
  cta: string;
}

export interface LeadFormData {
  name: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
  helpText: string;
}

export interface DiagnosticState {
  answers: Record<string, string>; // questionId -> selectedAnswerText
  scores: Record<ResultCategory, number>;
  completed: boolean;
  result: DiagnosticResult | null;
}
