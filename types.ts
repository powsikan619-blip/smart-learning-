
export type Language = 'en' | 'si' | 'ta';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface StudyNote {
  title: string;
  content: string;
  summary: string[];
}

export interface PlannerTask {
  id: string;
  subject: string;
  time: string;
  completed: boolean;
}

export enum Grade {
  Grade6 = "Grade 6",
  Grade7 = "Grade 7",
  Grade8 = "Grade 8",
  Grade9 = "Grade 9",
  Grade10 = "Grade 10",
  Grade11 = "Grade 11",
  Grade12 = "Grade 12",
  Grade13 = "Grade 13"
}

export type AppView = 'home' | 'signin' | 'study' | 'quiz' | 'planner';
