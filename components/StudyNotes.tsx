
import React, { useState } from 'react';
import { Volume2, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { GRADES, SUBJECTS, LANG_LABELS } from '../constants';
import { Language, StudyNote } from '../types';
import { generateStudyNotes, speakText } from '../services/gemini';

const StudyNotes: React.FC = () => {
  const [grade, setGrade] = useState(GRADES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [unit, setUnit] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<StudyNote | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const handleGenerate = async () => {
    if (!unit) return;
    setLoading(true);
    try {
      const result = await generateStudyNotes(grade, subject, unit, lang);
      setNote(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!note || speaking) return;
    setSpeaking(true);
    try {
      await speakText(note.content);
    } catch (e) {
      console.error(e);
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI Study Material
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Grade</label>
            <select 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Subject</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-500">Unit / Topic Name</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Photosynthesis, Fractions"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !unit}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {(['en', 'si', 'ta'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                lang === l ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {note && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{note.title}</h3>
                <p className="opacity-80 text-sm mt-1">{grade} • {subject}</p>
              </div>
              <button 
                onClick={handleSpeak}
                disabled={speaking}
                className={`p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all ${speaking ? 'animate-pulse text-indigo-200' : ''}`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                  {note.content}
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h4 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Key Takeaways
                </h4>
                <ul className="space-y-3">
                  {note.summary.map((point, i) => (
                    <li key={i} className="flex gap-3 text-amber-900/80">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800">
                        {i + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyNotes;
