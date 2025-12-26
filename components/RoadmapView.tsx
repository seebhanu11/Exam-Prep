import React from 'react';
import { RoadmapItem } from '../types';
import { Clock, BookOpen, Coffee, Code2 } from 'lucide-react';

interface RoadmapViewProps {
  roadmap: RoadmapItem[];
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
  if (roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-400 max-w-md">Your personalized 48-hour plan is being generated. This usually takes a few seconds...</p>
      </div>
    );
  }

  const days = [1, 2];

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('break') || t.includes('lunch') || t.includes('dinner')) return <Coffee className="w-5 h-5 text-amber-400" />;
    if (t.includes('sql') || t.includes('database')) return <BookOpen className="w-5 h-5 text-blue-400" />;
    if (t.includes('dsa') || t.includes('code') || t.includes('algorithm')) return <Code2 className="w-5 h-5 text-emerald-400" />;
    return <Clock className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {days.map(day => (
        <div key={day} className="relative">
          <div className="sticky top-4 z-10 mb-6 bg-slate-900/95 backdrop-blur py-4 border-b border-slate-700">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg text-sm">D{day}</span>
               {day === 1 ? 'Foundations & Core' : 'Advanced & Practice'}
             </h2>
          </div>
          
          <div className="space-y-0 relative border-l-2 border-slate-700 ml-4 md:ml-6 pb-12">
            {roadmap.filter(r => r.day === day).map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10 py-4 group">
                <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-colors"></div>
                
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all hover:bg-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-2 text-indigo-400 font-mono text-sm font-semibold bg-indigo-500/10 px-2 py-1 rounded">
                      <Clock size={14} /> {item.timeRange}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.activity}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                    {getIcon(item.focusArea)}
                    {item.focusArea}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapView;