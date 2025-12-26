export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum TopicCategory {
  SQL = 'SQL',
  DSA = 'DSA',
}

export type QuestionLevel = 'Basic' | 'Advanced' | 'MAANG';

export interface Question {
  id: string;
  category: TopicCategory;
  topic: string; // e.g., "Joins", "Arrays"
  question: string;
  answer: string;
  difficulty: Difficulty;
  level?: QuestionLevel;
}

export interface RoadmapItem {
  day: number;
  timeRange: string;
  activity: string;
  focusArea: string;
  details: string;
}

export interface StudyPlan {
  roadmap: RoadmapItem[];
  questions: Question[];
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';