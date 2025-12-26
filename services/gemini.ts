import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, RoadmapItem, TopicCategory, Difficulty, QuestionLevel } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateRoadmap = async (): Promise<RoadmapItem[]> => {
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Create a strict, high-intensity 48-hour interview preparation roadmap for a fresher computer science graduate.
    Focus ONLY on SQL and Data Structures & Algorithms (DSA).
    Assume the interview is in 2 days.
    Break it down hour-by-hour or in 2-hour blocks.
    Day 1 should focus on core concepts and breadth.
    Day 2 should focus on complex problems, practice, and revision.
    Include breaks.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.INTEGER, description: "1 or 2" },
        timeRange: { type: Type.STRING, description: "e.g., '08:00 - 10:00'" },
        activity: { type: Type.STRING, description: "Short title of the activity" },
        focusArea: { type: Type.STRING, description: "e.g., 'SQL Joins' or 'Binary Trees'" },
        details: { type: Type.STRING, description: "Specific topics to cover in this block" },
      },
      required: ["day", "timeRange", "activity", "focusArea", "details"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a senior technical interviewer creating a survival guide for a student.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as RoadmapItem[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    throw error;
  }
};

export const generateQuestions = async (category: TopicCategory, topic: string, level: QuestionLevel, count: number = 5): Promise<Question[]> => {
  const model = "gemini-3-pro-preview";
  
  let levelInstruction = "";
  if (level === 'Basic') {
    levelInstruction = "Focus on foundational concepts, syntax, definitions, and standard fresher-level questions. Difficulty: Easy to Medium.";
  } else if (level === 'Advanced') {
    levelInstruction = "Focus on complex scenarios, optimization, performance tuning, and advanced features. Difficulty: Medium to Hard.";
  } else if (level === 'MAANG') {
    levelInstruction = "Focus on high-bar algorithmic thinking, tricky edge cases, scalability, and system design implications. Difficulty: Hard/Expert.";
  }

  const prompt = `
    Generate ${count} distinct, practical interview questions for ${category}.
    Topic: ${topic}.
    Level: ${level} (${levelInstruction}).
    Target audience: Fresher/Junior Developer preparing for ${level} interviews.
    
    The answer should be concise but complete. For SQL, include the query. For DSA, include the approach or pseudo-code logic.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        answer: { type: Type.STRING, description: "Detailed answer with code/query if applicable. Markdown allowed." },
        difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
      },
      required: ["question", "answer", "difficulty"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      const rawQuestions = JSON.parse(response.text) as Omit<Question, 'id' | 'category' | 'topic' | 'level'>[];
      return rawQuestions.map(q => ({
        ...q,
        id: generateId(),
        category,
        topic,
        difficulty: q.difficulty as Difficulty,
        level: level
      }));
    }
    return [];
  } catch (error) {
    console.error(`Failed to generate ${category} questions:`, error);
    throw error;
  }
};

// Batch generator
export const generateQuestionBatch = async (category: TopicCategory, topics: string[], level: QuestionLevel): Promise<Question[]> => {
    let allQuestions: Question[] = [];
    // Generating fewer questions per topic to allow for faster multi-level generation if user clicks multiple times
    // 5 questions * 6 topics = 30 questions per click per level
    for (const topic of topics) {
        const questions = await generateQuestions(category, topic, level, 5); 
        allQuestions = [...allQuestions, ...questions];
    }
    return allQuestions;
}

// Static Data based on "48-Hour Interview Survival Kit"
export const getStaticSurvivalKit = () => {
  const roadmap: RoadmapItem[] = [
    { day: 1, timeRange: "09:00 - 12:00", activity: "The Essentials", focusArea: "SQL Core", details: "Group By, Having, Joins (Left vs Inner)." },
    { day: 1, timeRange: "13:00 - 17:00", activity: "The Essentials", focusArea: "DSA Core", details: "Arrays, Hash Maps, Strings." },
    { day: 1, timeRange: "18:00 - 21:00", activity: "Review", focusArea: "Patterns", details: "Aggregate functions, 'Nth Highest' logic." },
    { day: 2, timeRange: "09:00 - 12:00", activity: "Advanced Logic", focusArea: "DSA Advanced", details: "Linked Lists, Stacks, Recursion basics." },
    { day: 2, timeRange: "13:00 - 17:00", activity: "Advanced Logic", focusArea: "SQL Advanced", details: "Subqueries, Window Functions, Case Statements." },
    { day: 2, timeRange: "18:00 - 21:00", activity: "Final Prep", focusArea: "Mock Interview", details: "Behavioral Questions & Confidence building." },
  ];

  const sqlQuestions: Question[] = [
    {
      id: generateId(),
      category: TopicCategory.SQL,
      topic: "Aggregation",
      difficulty: Difficulty.Medium,
      level: 'Basic',
      question: "Find customers who have ordered more than $500 in total.",
      answer: "The Trap: You cannot use WHERE to filter aggregates. Use HAVING.\n\nSELECT customer_id, SUM(amount) as total\nFROM orders\nGROUP BY customer_id\nHAVING SUM(amount) > 500;"
    },
    {
      id: generateId(),
      category: TopicCategory.SQL,
      topic: "Joins",
      difficulty: Difficulty.Medium,
      level: 'Basic',
      question: "Find Employees who do NOT belong to any Department.",
      answer: "Logic: Use a Left Join and look for NULLs on the right side.\n\nSELECT e.name \nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.id\nWHERE d.id IS NULL;"
    },
    {
      id: generateId(),
      category: TopicCategory.SQL,
      topic: "Ranking",
      difficulty: Difficulty.Medium,
      level: 'Advanced',
      question: "Find the 3rd highest salary.",
      answer: "Logic: Use DENSE_RANK() to handle ties correctly.\n\nSELECT salary FROM (\n    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n    FROM salaries\n) WHERE rnk = 3;"
    },
    {
      id: generateId(),
      category: TopicCategory.SQL,
      topic: "Logic",
      difficulty: Difficulty.Easy,
      level: 'Basic',
      question: "Find emails that appear more than once.",
      answer: "SELECT email, COUNT(email)\nFROM users\nGROUP BY email\nHAVING COUNT(email) > 1;"
    }
  ];

  const dsaQuestions: Question[] = [
    {
      id: generateId(),
      category: TopicCategory.DSA,
      topic: "Hash Map",
      difficulty: Difficulty.Easy,
      level: 'Basic',
      question: "Two Sum: Find indices of two numbers that add up to a target.",
      answer: "Goal: O(n) lookup.\nLogic: Iterate array. Calculate `diff = target - current`. If `diff` is in map, you found the pair. If not, add current to map."
    },
    {
      id: generateId(),
      category: TopicCategory.DSA,
      topic: "Frequency Count",
      difficulty: Difficulty.Easy,
      level: 'Basic',
      question: "Valid Anagram: Check if 'silent' and 'listen' are anagrams.",
      answer: "Logic: Use an array of size 26 (for a-z). Increment index for first string, decrement for second. All must be zero at end."
    },
    {
      id: generateId(),
      category: TopicCategory.DSA,
      topic: "Two Pointers",
      difficulty: Difficulty.Easy,
      level: 'Basic',
      question: "Palindrome Check: Check if string reads same forward/backward.",
      answer: "Logic: Pointer L at start, Pointer R at end. While L < R, check if chars match. Move them inward."
    },
    {
      id: generateId(),
      category: TopicCategory.DSA,
      topic: "Greedy / Array",
      difficulty: Difficulty.Medium,
      level: 'Advanced',
      question: "Stock Buy & Sell: Maximize profit from one buy/sell.",
      answer: "Logic: Track `min_price` so far. Loop through prices. `profit = current_price - min_price`. Update max profit if higher."
    }
  ];

  return { roadmap, sqlQuestions, dsaQuestions };
};