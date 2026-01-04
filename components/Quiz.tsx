
import React, { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Star, Trophy, ArrowRight } from 'lucide-react';
import { GRADES, SUBJECTS } from '../constants';
import { Language, QuizQuestion } from '../types';
import { generateQuiz } from '../services/gemini';

const Quiz: React.FC = () => {
  const [grade, setGrade] = useState(GRADES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [unit, setUnit] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const startQuiz = async () => {
    if (!unit) return;
    setLoading(true);
    try {
      const res = await generateQuiz(grade, subject, unit, lang);
      setQuestions(res);
      setCurrentIdx(0);
      setAnswers([]);
      setFinished(false);
    } catch (e) {
      console.error(e);
      alert("Error generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 500);
    } else {
      setFinished(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
  };

  const score = calculateScore();
  const stars = Math.ceil((score / questions.length) * 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-indigo-600 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-semibold text-lg animate-pulse">Generating your custom quiz...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 animate-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full text-amber-500 mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Excellent Work!</h2>
          <p className="text-slate-500 mt-2">You completed the {subject} quiz.</p>
          
          <div className="my-8 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-10 h-10 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>

          <div className="text-5xl font-black text-indigo-600 mb-8">
            {score}/{questions.length}
          </div>

          <button 
            onClick={() => setQuestions([])}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Practice More
          </button>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-slate-500 text-sm font-semibold">Question {currentIdx + 1} of {questions.length}</div>
          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-2xl font-bold text-slate-800 leading-tight">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                  answers[currentIdx] === i 
                  ? (i === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                  : 'border-slate-100 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <span className={`font-medium ${answers[currentIdx] === i ? (i === q.correctAnswer ? 'text-green-700' : 'text-red-700') : 'text-slate-700'}`}>
                  {opt}
                </span>
                {answers[currentIdx] === i ? (
                  i === q.correctAnswer ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Builder</h2>
        <p className="text-slate-500 mb-8">Ready to test your knowledge? Choose a topic to get started.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">Target Grade</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400">Unit / Specific Topic</label>
            <input 
              type="text" 
              value={unit} 
              onChange={e => setUnit(e.target.value)} 
              placeholder="e.g. Geometry basics"
              className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-4">
            {(['en', 'si', 'ta'] as Language[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${lang === l ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button 
            onClick={startQuiz}
            disabled={!unit}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
          >
            Start Personalized Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
