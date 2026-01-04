
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, CheckCircle2, Bell } from 'lucide-react';
import { SUBJECTS } from '../constants';
import { PlannerTask } from '../types';

const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    const saved = localStorage.getItem('study-planner-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [time, setTime] = useState('16:00');

  useEffect(() => {
    localStorage.setItem('study-planner-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const newTask: PlannerTask = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      time,
      completed: false
    };
    setTasks([...tasks, newTask].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-500" />
          Schedule Study Session
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400">Subject</label>
            <select 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400">Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={addTask}
            className="md:col-span-2 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            Add To Schedule
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 px-2">Today's Schedule</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            No study sessions planned yet.
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 transition-all ${task.completed ? 'opacity-60 bg-slate-50' : 'shadow-sm'}`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`p-2 rounded-full transition-all ${task.completed ? 'text-green-500' : 'text-slate-200 hover:text-indigo-500'}`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
                
                <div className="flex-1">
                  <h4 className={`font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.subject}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>

                <button 
                  onClick={() => removeTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
