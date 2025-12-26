import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  category: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, category }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.Easy: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case Difficulty.Medium: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case Difficulty.Hard: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-400">No questions generated yet. Start the generator to build your bank.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {category} Questions <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">{questions.length}</span>
        </h3>
      </div>
      
      <div className="grid gap-3">
        {questions.map((q, idx) => (
          <div 
            key={q.id} 
            className={`transition-all duration-200 border rounded-xl overflow-hidden ${
              expandedId === q.id 
                ? 'bg-slate-800 border-indigo-500/50 shadow-lg shadow-indigo-900/20' 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div 
              onClick={() => toggleExpand(q.id)}
              className="p-4 cursor-pointer flex items-start gap-4"
            >
              <div className="flex-shrink-0 mt-1">
                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                   {idx + 1}
                 </span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                    {q.topic}
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-medium text-slate-100 leading-snug">
                  {q.question}
                </h4>
              </div>
              <div className="flex-shrink-0 mt-1 text-slate-400">
                {expandedId === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {expandedId === q.id && (
              <div className="px-4 pb-4 pl-[3.5rem]">
                <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-700 font-mono text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto relative group">
                  {q.answer}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(q.answer);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                    title="Copy answer"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;