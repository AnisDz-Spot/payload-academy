/**
 * Role-based learning paths for Payload Academy.
 * 
 * Each track curates lessons by role tag, with ordering,
 * estimated hours, and a completion plan.
 * 
 * Tracks:
 *  - frontend: Frontend & UI focus
 *  - backend: Backend & APIs focus  
 *  - devops: DevOps & Infra focus
 */

export interface TrackLesson {
  lessonId: string;
  title: string;
  module: string;
  estimatedMins: number;
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  colorLight: string;
  colorDark: string;
  lessons: TrackLesson[];
  totalHours: number;
  moduleCount: number;
  badgeText: string;
}

// Track definitions
export const TRACKS = {
  frontend: {
    id: 'frontend' as const,
    title: 'Frontend & UI',
    description: 'Master the user-facing side of Payload CMS: rich text, hooks, auth, and beautiful interfaces.',
    color: 'from-emerald-500 to-emerald-600',
    colorLight: 'emerald-500',
    colorDark: 'emerald-800',
    lessons: [
      { lessonId: 'intro', title: 'Introduction', module: 'Getting Started', estimatedMins: 10 },
      { lessonId: 'install', title: 'Installation', module: 'Getting Started', estimatedMins: 5 },
      { lessonId: 'prereqs', title: 'Prerequisites', module: 'Getting Started', estimatedMins: 8 },
      { lessonId: 'rich-text', title: 'Rich Text & Lexical', module: 'Rich Text', estimatedMins: 15 },
      { lessonId: 'hooks', title: 'Hooks & Effects', module: 'Hooks', estimatedMins: 12 },
      { lessonId: 'auth', title: 'Authentication', module: 'Auth', estimatedMins: 15 },
      { lessonId: 'components', title: 'Component Patterns', module: 'UI', estimatedMins: 10 },
      { lessonId: 'styling', title: 'Styling & Theming', module: 'UI', estimatedMins: 8 },
      { lessonId: 'performance', title: 'Performance Optimisation', module: 'Performance', estimatedMins: 12 },
      { lessonId: 'accessibility', title: 'Accessibility', module: 'Accessibility', estimatedMins: 10 },
    ],
    totalHours: 98,
    moduleCount: 9,
    badgeText: 'Frontend Specialist',
  },
  backend: {
    id: 'backend' as const,
    title: 'Backend & APIs',
    description: 'Build the server-side power of Payload CMS: collections, access control, and database operations.',
    color: 'from-indigo-500 to-indigo-600',
    colorLight: 'indigo-500',
    colorDark: 'indigo-800',
    lessons: [
      { lessonId: 'intro', title: 'Introduction', module: 'Getting Started', estimatedMins: 10 },
      { lessonId: 'install', title: 'Installation', module: 'Getting Started', estimatedMins: 5 },
      { lessonId: 'prereqs', title: 'Prerequisites', module: 'Getting Started', estimatedMins: 8 },
      { lessonId: 'collections', title: 'Collections & Fields', module: 'Collections', estimatedMins: 18 },
      { lessonId: 'access-control', title: 'Access Control & RLS', module: 'Security', estimatedMins: 15 },
      { lessonId: 'api-endpoints', title: 'API Endpoints', module: 'API', estimatedMins: 12 },
      { lessonId: 'webhooks', title: 'Webhooks & Background Jobs', module: 'Jobs', estimatedMins: 15 },
      { lessonId: 'migrations', title: 'Migrations & Versioning', module: 'Migrations', estimatedMins: 10 },
      { lessonId: 'query-simulator', title: 'Query Simulator', module: 'Query', estimatedMins: 12 },
      { lessonId: 'performance', title: 'Performance Optimisation', module: 'Performance', estimatedMins: 12 },
    ],
    totalHours: 114,
    moduleCount: 9,
    badgeText: 'Backend Engineer',
  },
  devops: {
    id: 'devops' as const,
    title: 'DevOps & Infra',
    description: 'Deploy, monitor, and scale Payload CMS production environments: CI/CD, caching, and infrastructure.',
    color: 'from-purple-500 to-purple-600',
    colorLight: 'purple-500',
    colorDark: 'purple-800',
    lessons: [
      { lessonId: 'intro', title: 'Introduction', module: 'Getting Started', estimatedMins: 10 },
      { lessonId: 'install', title: 'Installation', module: 'Getting Started', estimatedMins: 5 },
      { lessonId: 'prereqs', title: 'Prerequisites', module: 'Getting Started', estimatedMins: 8 },
      { lessonId: 'docker', title: 'Docker & Containerisation', module: 'Deployment', estimatedMins: 15 },
      { lessonId: 'ci-cd', title: 'CI/CD Pipelines', module: 'CI/CD', estimatedMins: 12 },
      { lessonId: 'monitoring', title: 'Monitoring & Logging', module: 'Observability', estimatedMins: 10 },
      { lessonId: 'caching', title: 'Caching & Performance', module: 'Performance', estimatedMins: 12 },
      { lessonId: 'deployment', title: 'Deployment & Hosting', module: 'Deployment', estimatedMins: 15 },
      { lessonId: 'backups', title: 'Backups & Recovery', module: 'Operations', estimatedMins: 8 },
      { lessonId: 'scaling', title: 'Scaling Payload', module: 'Scaling', estimatedMins: 12 },
    ],
    totalHours: 97,
    moduleCount: 9,
    badgeText: 'DevOps Engineer',
  },
};

/**
 * Get a track by ID
 */
export function getTrack(id: keyof typeof TRACKS): typeof TRACKS[keyof typeof TRACKS] | undefined {
  return TRACKS[id];
}

/**
 * Get all tracks
 */
export function getAllTracks(): Array<typeof TRACKS[keyof typeof TRACKS]> {
  return Object.values(TRACKS);
}

/**
 * Get lessons for a specific role tag
 */
export function getLessonsByRole(role: string, allLessons: any[]): TrackLesson[] {
  const lessons: TrackLesson[] = [];
  allLessons.forEach((lesson, index) => {
    if (lesson.r && lesson.r.includes(role)) {
      lessons.push({
        lessonId: lesson.id,
        title: lesson.t,
        module: lesson.m,
        estimatedMins: lesson.readingMins ?? 8,
      });
    }
  });
  return lessons;
}

/**
 * Calculate a 2-week plan (45 min/day, 10 days)
 */
export function generateTwoWeekPlan(trackId: string): { days: number; dailyMins: number; lessons: TrackLesson[]; remaining: TrackLesson[] } {
  const track = TRACKS[trackId];
  if (!track) {
    return { days: 0, dailyMins: 0, lessons: [], remaining: [] };
  }

  const dailyMins = 45;
  const totalDays = 10; // 2 weeks at 45 min/day = 450 mins
  const totalMinutes = dailyMins * totalDays;

  const allLessons = track.lessons;
  let accumulated = 0;
  const selected: TrackLesson[] = [];
  let i = 0;

  while (i < allLessons.length && accumulated < totalMinutes && selected.length < allLessons.length) {
    const lesson = allLessons[i];
    if (accumulated + lesson.estimatedMins <= totalMinutes) {
      selected.push(lesson);
      accumulated += lesson.estimatedMins;
    }
    i++;
  }

  const remaining = allLessons.slice(i);

  return {
    days: totalDays,
    dailyMins,
    lessons: selected,
    remaining,
  };
}

export type { TrackLesson, LearningTrack };