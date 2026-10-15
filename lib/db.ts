import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  avatar?: string;
  role: 'student' | 'admin';
  isPro: boolean;
  planType: 'free' | 'monthly' | 'annual' | 'lifetime';
  // Email verification
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbUserProgress {
  userId: string;
  completedLessons: Record<string, boolean>;
  completedQuizzes: Record<string, boolean>;
  examScore: number | null;
  userNotes: Record<string, string>;
  bookmarks: Record<string, boolean>;
  lessonFeedback: Record<string, 'up' | 'down'>;
  studyDays: string[];
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  currentLessonIndex: number;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  progress: DbUserProgress[];
  sessions: DbSession[];
}

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// (DatabaseSchema already declared above)

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure DB directory and initial database file exist
function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        users: [],
        progress: [],
        sessions: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error initializing DB:', err);
    return { users: [], progress: [], sessions: [] };
  }
}

function readDb(): DatabaseSchema {
  return initDb();
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB:', err);
    throw new Error('Database write failed');
  }
}

// ── Password hashing utilities ──
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
}

// ── User Management ──
export function getUserByEmail(email: string): DbUser | null {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find(u => u.email.toLowerCase() === normalized) || null;
}

export function getUserById(id: string): DbUser | null {
  const db = readDb();
  return db.users.find(u => u.id === id) || null;
}

export function createUser(params: {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role?: 'student' | 'admin';
  initialProgress?: Partial<DbUserProgress>;
}): { user: DbUser; verificationToken: string } {
  const db = readDb();
  const normalizedEmail = params.email.trim().toLowerCase();

  if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists');
  }

  const { hash, salt } = hashPassword(params.password);
  const now = new Date().toISOString();
  const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

  const newUser: DbUser = {
    id: userId,
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    name: params.name.trim() || normalizedEmail.split('@')[0],
    avatar: params.avatar || '👨‍💻',
    role: params.role || 'student',
    isPro: false,
    planType: 'free',
    emailVerified: false,
    verificationToken,
    verificationTokenExpiry,
    createdAt: now,
    updatedAt: now,
  };

  const newProgress: DbUserProgress = {
    userId,
    completedLessons: params.initialProgress?.completedLessons || {},
    completedQuizzes: params.initialProgress?.completedQuizzes || {},
    examScore: params.initialProgress?.examScore ?? null,
    userNotes: params.initialProgress?.userNotes || {},
    bookmarks: params.initialProgress?.bookmarks || {},
    lessonFeedback: params.initialProgress?.lessonFeedback || {},
    studyDays: params.initialProgress?.studyDays || [new Date().toISOString().slice(0, 10)],
    theme: params.initialProgress?.theme || 'dark',
    soundEnabled: params.initialProgress?.soundEnabled ?? true,
    currentLessonIndex: params.initialProgress?.currentLessonIndex ?? 0,
    updatedAt: now,
  };

  db.users.push(newUser);
  db.progress.push(newProgress);
  writeDb(db);

  // Return the user (and verification token) but NO session yet — session is
  // created only after email is confirmed.
  return { user: newUser, verificationToken };
}

// ── Email Verification ──
export function verifyEmailToken(token: string): DbUser | null {
  const db = readDb();
  const user = db.users.find(u =>
    u.verificationToken === token &&
    u.verificationTokenExpiry &&
    new Date(u.verificationTokenExpiry) > new Date()
  );
  if (!user) return null;

  const now = new Date().toISOString();
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  user.updatedAt = now;
  writeDb(db);
  return user;
}

export function refreshVerificationToken(email: string): { token: string } | null {
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.emailVerified) return null;

  const token = crypto.randomBytes(32).toString('hex');
  user.verificationToken = token;
  user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return { token };
}

export function authenticateUser(email: string, password: string): { user: DbUser; session: DbSession } {
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  const db = readDb();
  const now = new Date().toISOString();
  const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const session: DbSession = {
    token,
    userId: user.id,
    createdAt: now,
    expiresAt,
  };

  db.sessions.push(session);
  writeDb(db);

  return { user, session };
}

export function getSessionUser(token: string): { user: DbUser; progress: DbUserProgress } | null {
  if (!token) return null;
  const db = readDb();
  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    // Session expired
    db.sessions = db.sessions.filter(s => s.token !== token);
    writeDb(db);
    return null;
  }

  const user = db.users.find(u => u.id === session.userId);
  if (!user) return null;

  let progress = db.progress.find(p => p.userId === user.id);
  if (!progress) {
    progress = {
      userId: user.id,
      completedLessons: {},
      completedQuizzes: {},
      examScore: null,
      userNotes: {},
      bookmarks: {},
      lessonFeedback: {},
      studyDays: [new Date().toISOString().slice(0, 10)],
      theme: 'dark',
      soundEnabled: true,
      currentLessonIndex: 0,
      updatedAt: new Date().toISOString(),
    };
    db.progress.push(progress);
    writeDb(db);
  }

  return { user, progress };
}

export function deleteSession(token: string): void {
  const db = readDb();
  db.sessions = db.sessions.filter(s => s.token !== token);
  writeDb(db);
}

// ── Progress Management ──
export function getUserProgress(userId: string): DbUserProgress | null {
  const db = readDb();
  return db.progress.find(p => p.userId === userId) || null;
}

// Alias for external callers (used by verify-email API route)
export const getUserProgressByUserId = getUserProgress;

export function saveUserProgress(
  userId: string,
  progressData: Partial<Omit<DbUserProgress, 'userId' | 'updatedAt'>>
): DbUserProgress {
  const db = readDb();
  const now = new Date().toISOString();
  let progressIndex = db.progress.findIndex(p => p.userId === userId);

  if (progressIndex === -1) {
    const newProgress: DbUserProgress = {
      userId,
      completedLessons: progressData.completedLessons || {},
      completedQuizzes: progressData.completedQuizzes || {},
      examScore: progressData.examScore ?? null,
      userNotes: progressData.userNotes || {},
      bookmarks: progressData.bookmarks || {},
      lessonFeedback: progressData.lessonFeedback || {},
      studyDays: progressData.studyDays || [new Date().toISOString().slice(0, 10)],
      theme: progressData.theme || 'dark',
      soundEnabled: progressData.soundEnabled ?? true,
      currentLessonIndex: progressData.currentLessonIndex ?? 0,
      updatedAt: now,
    };
    db.progress.push(newProgress);
    writeDb(db);
    return newProgress;
  }

  // Merge updates
  const current = db.progress[progressIndex];
  const updated: DbUserProgress = {
    ...current,
    ...progressData,
    completedLessons: { ...current.completedLessons, ...(progressData.completedLessons || {}) },
    completedQuizzes: { ...current.completedQuizzes, ...(progressData.completedQuizzes || {}) },
    userNotes: { ...current.userNotes, ...(progressData.userNotes || {}) },
    bookmarks: { ...current.bookmarks, ...(progressData.bookmarks || {}) },
    lessonFeedback: { ...current.lessonFeedback, ...(progressData.lessonFeedback || {}) },
    studyDays: Array.from(new Set([...(current.studyDays || []), ...(progressData.studyDays || [])])),
    updatedAt: now,
  };

  db.progress[progressIndex] = updated;
  writeDb(db);
  return updated;
}

export function updateUserProStatus(
  userId: string,
  isPro: boolean,
  planType: 'free' | 'monthly' | 'annual' | 'lifetime'
): DbUser | null {
  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) return null;

  user.isPro = isPro;
  user.planType = planType;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return user;
}

export function updateUserProStatusByEmail(
  email: string,
  isPro: boolean,
  planType: 'free' | 'monthly' | 'annual' | 'lifetime'
): DbUser | null {
  const db = readDb();
  const normalized = email.toLowerCase().trim();
  const user = db.users.find(u => u.email.toLowerCase().trim() === normalized);
  if (!user) return null;

  user.isPro = isPro;
  user.planType = planType;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return user;
}
