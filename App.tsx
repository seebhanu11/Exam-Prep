import React, { useState, useEffect } from 'react';
import { generateRoadmap, generateQuestionBatch, getStaticSurvivalKit } from './services/gemini';
import { RoadmapItem, Question, TopicCategory, QuestionLevel } from './types';
import RoadmapView from './components/RoadmapView';
import QuestionList from './components/QuestionList';
import PrintLayout from './components/PrintLayout';
import { 
  Rocket, 
  Map as MapIcon, 
  Database, 
  Code2, 
  Printer, 
  Loader2, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  BookOpen,
  BrainCircuit,
  Trophy,
  GraduationCap
} from 'lucide-react';

// Pre-defined topics to ensure we cover ground for the "100 questions" goal
const SQL_TOPICS = [
  "Basic Queries & Filtering", 
  "Joins (Inner, Left, Right, Full)", 
  "Aggregation & Group By", 
  "Subqueries & CTEs", 
  "Window Functions", 
  "Normalization & Indexes"
];

const DSA_TOPICS = [
  "Arrays & Strings", 
  "Linked Lists", 
  "Stacks & Queues", 
  "Trees & BST", 
  "Graphs (BFS/DFS)", 
  "Dynamic Programming Basics"
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'sql' | 'dsa'>('roadmap');
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [sqlQuestions, setSqlQuestions] = useState<Question[]>([]);
  const [dsaQuestions, setDsaQuestions] = useState<Question[]>([]);
  
  const [roadmapStatus, setRoadmapStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sqlStatus, setSqlStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dsaStatus, setDsaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Load Static Survival Kit on mount
  useEffect(() => {
    if (roadmapStatus === 'idle') {
      const survivalKit = getStaticSurvivalKit();
      setRoadmap(survivalKit.roadmap);
      setSqlQuestions(survivalKit.sqlQuestions);
      setDsaQuestions(survivalKit.dsaQuestions);
      setRoadmapStatus('success');
      // We set these to idle/success but populated so user can add more
      setSqlStatus('idle'); 
      setDsaStatus('idle');
    }
  }, []);

  const handleGenerateRoadmap = async () => {
    setRoadmapStatus('loading');
    try {
      const data = await generateRoadmap();
      setRoadmap(data);
      setRoadmapStatus('success');
    } catch (e) {
      console.error(e);
      setRoadmapStatus('error');
    }
  };

  const handleGenerateSQL = async (level: QuestionLevel) => {
    if (sqlStatus === 'loading') return;
    setSqlStatus('loading');
    try {
      // Generate in batches
      const questions = await generateQuestionBatch(TopicCategory.SQL, SQL_TOPICS, level);
      setSqlQuestions(prev => [...questions, ...prev]); // Add new ones to top
      setSqlStatus('success');
    } catch (e) {
      console.error(e);
      setSqlStatus('error');
    }
  };

  const handleGenerateDSA = async (level: QuestionLevel) => {
    if (dsaStatus === 'loading') return;
    setDsaStatus('loading');
    try {
      const questions = await generateQuestionBatch(TopicCategory.DSA, DSA_TOPICS, level);
      setDsaQuestions(prev => [...questions, ...prev]); // Add new ones to top
      setDsaStatus('success');
    } catch (e) {
      console.error(e);
      setDsaStatus('error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const LevelSelector = ({ onSelect, isLoading, category }: { onSelect: (l: QuestionLevel) => void, isLoading: boolean, category: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button 
        onClick={() => onSelect('Basic')}
        disabled={isLoading}
        className="text-left group relative p-6 bg-slate-800/50 hover:bg-indigo-900/20 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all duration-300"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
          <GraduationCap className="w-12 h-12 text-indigo-500" />
        </div>
        <div className="flex items-center gap-2 mb-2">
           <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><GraduationCap size={20}/></span>
           <h3 className="font-bold text-lg text-white">Basic & Core</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Foundational concepts for fresher interviews. Focus on syntax and standard definitions.</p>
        <div className="flex items-center text-xs font-bold text-indigo-400 uppercase tracking-wider">
           {isLoading ? <Loader2 className="animate-spin mr-2" size={14}/> : 'Generate Core'}
        </div>
      </button>

      <button 
        onClick={() => onSelect('Advanced')}
        disabled={isLoading}
        className="text-left group relative p-6 bg-slate-800/50 hover:bg-amber-900/20 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all duration-300"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
          <BrainCircuit className="w-12 h-12 text-amber-500" />
        </div>
        <div className="flex items-center gap-2 mb-2">
           <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><BrainCircuit size={20}/></span>
           <h3 className="font-bold text-lg text-white">Advanced</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Complex scenarios, optimizations, and deep-dives. Perfect for proving depth of knowledge.</p>
        <div className="flex items-center text-xs font-bold text-amber-400 uppercase tracking-wider">
           {isLoading ? <Loader2 className="animate-spin mr-2" size={14}/> : 'Generate Advanced'}
        </div>
      </button>

      <button 
        onClick={() => onSelect('MAANG')}
        disabled={isLoading}
        className="text-left group relative p-6 bg-slate-800/50 hover:bg-rose-900/20 border border-slate-700 hover:border-rose-500/50 rounded-xl transition-all duration-300"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
          <Trophy className="w-12 h-12 text-rose-500" />
        </div>
        <div className="flex items-center gap-2 mb-2">
           <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Trophy size={20}/></span>
           <h3 className="font-bold text-lg text-white">FAANG / MAANG</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Tricky edge cases, scalability problems, and high-bar algorithmic challenges.</p>
        <div className="flex items-center text-xs font-bold text-rose-400 uppercase tracking-wider">
           {isLoading ? <Loader2 className="animate-spin mr-2" size={14}/> : 'Generate MAANG'}
        </div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Print View Component (Hidden until print) */}
      <PrintLayout roadmap={roadmap} sqlQuestions={sqlQuestions} dsaQuestions={dsaQuestions} />

      {/* Main UI */}
      <div className="no-print flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                InterviewSprint
              </h1>
              <p className="text-slate-400 text-sm font-medium">48-Hour Intensive Prep Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex gap-2 text-xs font-mono text-slate-500 mr-4 hidden md:flex">
               <span className={roadmapStatus === 'success' ? 'text-emerald-400' : ''}>RD: {roadmap.length > 0 ? 'Ready' : '-'}</span>
               <span className="text-slate-700">|</span>
               <span className={sqlQuestions.length > 0 ? 'text-emerald-400' : ''}>SQL: {sqlQuestions.length}</span>
               <span className="text-slate-700">|</span>
               <span className={dsaQuestions.length > 0 ? 'text-emerald-400' : ''}>DSA: {dsaQuestions.length}</span>
             </div>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg border border-slate-700 transition-all font-medium"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Save as PDF</span>
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-full sm:w-fit self-center sm:self-start">
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <MapIcon size={18} /> Roadmap
          </button>
          <button 
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'sql' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Database size={18} /> SQL Prep
          </button>
          <button 
            onClick={() => setActiveTab('dsa')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'dsa' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Code2 size={18} /> DSA Prep
          </button>
        </nav>

        {/* Content Area */}
        <main className="flex-1">
          {activeTab === 'roadmap' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Your 2-Day Strategy</h2>
                  <p className="text-slate-400 text-sm">Hour-by-hour breakdown to maximize retention.</p>
                </div>
                {roadmapStatus === 'success' && (
                   <button onClick={handleGenerateRoadmap} className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors">
                     <RefreshCw size={12} /> Regenerate
                   </button>
                )}
              </div>
              <RoadmapView roadmap={roadmap} />
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-6">
                 <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                   <Database className="text-blue-400" /> SQL Mastery
                 </h2>
                 <p className="text-slate-400 mb-6">Select a difficulty level to generate a focused batch of interview questions.</p>
                 
                 <LevelSelector 
                    category="SQL" 
                    isLoading={sqlStatus === 'loading'} 
                    onSelect={handleGenerateSQL} 
                 />
               </div>
               
               {sqlQuestions.length > 0 && (
                   <div className="mb-4 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full">
                       <CheckCircle2 size={14} /> {sqlQuestions.length} Questions Available
                     </div>
                     <button onClick={() => setSqlQuestions([])} className="text-xs text-slate-500 hover:text-slate-300">Clear All</button>
                   </div>
               )}
               
               <QuestionList questions={sqlQuestions} category="SQL" />
            </div>
          )}

          {activeTab === 'dsa' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-6">
                 <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                   <Code2 className="text-emerald-400" /> DSA Crunch
                 </h2>
                 <p className="text-slate-400 mb-6">Select a difficulty level to generate a focused batch of interview questions.</p>

                 <LevelSelector 
                    category="DSA" 
                    isLoading={dsaStatus === 'loading'} 
                    onSelect={handleGenerateDSA} 
                 />
               </div>

               {dsaQuestions.length > 0 && (
                   <div className="mb-4 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full">
                       <CheckCircle2 size={14} /> {dsaQuestions.length} Questions Available
                     </div>
                     <button onClick={() => setDsaQuestions([])} className="text-xs text-slate-500 hover:text-slate-300">Clear All</button>
                   </div>
               )}

              <QuestionList questions={dsaQuestions} category="DSA" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;