export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'streak' | 'exam' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  condition: (state: {
    completedLessonsCount: number;
    completedQuizzesCount: number;
    streak: number;
    examScore: number | null;
    bookmarksCount: number;
    notesCount: number;
    isAdmin: boolean;
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first lesson in Payload Academy.',
    icon: '🌱',
    category: 'progress',
    rarity: 'common',
    xp: 50,
    condition: ({ completedLessonsCount }) => completedLessonsCount >= 1,
  },
  {
    id: 'quiz_initiate',
    title: 'Quiz Novice',
    description: 'Pass your first knowledge check quiz.',
    icon: '💡',
    category: 'progress',
    rarity: 'common',
    xp: 50,
    condition: ({ completedQuizzesCount }) => completedQuizzesCount >= 1,
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day continuous study streak.',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    xp: 150,
    condition: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Weekly Champion',
    description: 'Achieve a 7-day study streak mastering Payload 3.x.',
    icon: '⚡',
    category: 'streak',
    rarity: 'epic',
    xp: 350,
    condition: ({ streak }) => streak >= 7,
  },
  {
    id: 'halfway_there',
    title: 'Halfway Pioneer',
    description: 'Master 25 complete curriculum lessons.',
    icon: '🎯',
    category: 'progress',
    rarity: 'rare',
    xp: 250,
    condition: ({ completedLessonsCount }) => completedLessonsCount >= 25,
  },
  {
    id: 'quiz_master_25',
    title: 'Knowledge Scholar',
    description: 'Pass 25 knowledge check quizzes with a perfect score.',
    icon: '🧠',
    category: 'mastery',
    rarity: 'rare',
    xp: 300,
    condition: ({ completedQuizzesCount }) => completedQuizzesCount >= 25,
  },
  {
    id: 'diligent_scribe',
    title: 'Diligent Scribe',
    description: 'Write custom study notes on 5 or more lessons.',
    icon: '📝',
    category: 'special',
    rarity: 'common',
    xp: 100,
    condition: ({ notesCount }) => notesCount >= 5,
  },
  {
    id: 'curator',
    title: 'Resource Curator',
    description: 'Bookmark 5 or more key architectural lessons.',
    icon: '🔖',
    category: 'special',
    rarity: 'common',
    xp: 100,
    condition: ({ bookmarksCount }) => bookmarksCount >= 5,
  },
  {
    id: 'curriculum_complete',
    title: 'Curriculum Master',
    description: 'Complete all 50 lessons across all 10 modules.',
    icon: '🎓',
    category: 'progress',
    rarity: 'epic',
    xp: 500,
    condition: ({ completedLessonsCount }) => completedLessonsCount >= 50,
  },
  {
    id: 'quiz_perfectionist',
    title: 'Quiz Perfectionist',
    description: 'Ace all 50 lesson quizzes throughout the academy.',
    icon: '💎',
    category: 'mastery',
    rarity: 'epic',
    xp: 600,
    condition: ({ completedQuizzesCount }) => completedQuizzesCount >= 50,
  },
  {
    id: 'exam_certified',
    title: 'Certified Payload 3.x Master',
    description: 'Pass the 50-Question Master Certification Exam with ≥ 80%.',
    icon: '🏆',
    category: 'exam',
    rarity: 'legendary',
    xp: 1000,
    condition: ({ examScore, isAdmin }) => isAdmin || (examScore !== null && examScore >= 80),
  },
  {
    id: 'exam_perfect',
    title: 'Grandmaster Architect',
    description: 'Achieve a flawless 100% score on the Master Certification Exam.',
    icon: '👑',
    category: 'exam',
    rarity: 'legendary',
    xp: 2000,
    condition: ({ examScore }) => examScore !== null && examScore === 100,
  },
];
