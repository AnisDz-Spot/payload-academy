// data/types.ts
export type Role = 'all' | 'frontend' | 'backend' | 'devops';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  m: string;         // Module name
  t: string;         // Title
  r: Role[];         // Role tags
  badge?: 'new';
  c: string;         // HTML Content
  difficulty?: Difficulty;
  readingMins?: number;
  relatedIds?: string[];  // IDs of related lessons
  tags?: string[];        // Topic tags e.g. ['hooks', 'auth']
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Challenge {
  docsPath: string;
  challengeText: string;
  starterCode?: string;
  solutionCode?: string;
  testPrompt?: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}
