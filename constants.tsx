
import React from 'react';
import { BookOpen, HelpCircle, Calendar, GraduationCap } from 'lucide-react';

export const SUBJECTS = [
  "Science",
  "Mathematics",
  "History",
  "Geography",
  "English",
  "Information Technology",
  "Civics",
  "Sinhala / Tamil Literature"
];

export const NAV_ITEMS = [
  { id: 'study', label: 'Study', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-5 h-5" /> },
  { id: 'planner', label: 'Planner', icon: <Calendar className="w-5 h-5" /> },
];

export const GRADES = [
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Grade 13"
];

export const LANG_LABELS: Record<string, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்"
};
