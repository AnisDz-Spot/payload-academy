import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

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

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// ── Connection ────────────────────────────────────────────────────
// Works on Vercel / Neon / any serverless platform (HTTP driver, no sockets).
// Provide the connection string via DATABASE_URL (Neon) or POSTGRES_URL (Vercel Postgres).
let sqlClient: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) {
      throw new Error(
        'Database is not configured. Set the DATABASE_URL environment variable to your Postgres connection string.'
      );
    }
    sqlClient = neon(url);
  }
  return sqlClient;
}

// Create the schema on first use (cached per process).
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

async function createSchema(): Promise<void> {
  // Retry: concurrent cold-start requests across serverless instances can race
  // on DDL even with IF NOT EXISTS, which can surface a transient
  // "already exists" error.
  for (let attempt = 0; ; attempt++) {
    try {
      await runSchemaDdl();
      return;
    } catch (err) {
      if (attempt >= 2) throw err;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}

async function runSchemaDdl(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      is_pro BOOLEAN NOT NULL DEFAULT FALSE,
      plan_type TEXT NOT NULL DEFAULT 'free',
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      verification_token TEXT,
      verification_token_expiry TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      completed_lessons JSONB NOT NULL DEFAULT '{}'::jsonb,
      completed_quizzes JSONB NOT NULL DEFAULT '{}'::jsonb,
      exam_score INTEGER,
      user_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
      bookmarks JSONB NOT NULL DEFAULT '{}'::jsonb,
      lesson_feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
      study_days JSONB NOT NULL DEFAULT '[]'::jsonb,
      theme TEXT NOT NULL DEFAULT 'dark',
      sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      current_lesson_index INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS users_verification_token_idx ON users (verification_token)`;
}

// ── Row mapping ───────────────────────────────────────────────────
interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  name: string;
  avatar: string | null;
  role: string;
  is_pro: boolean;
  plan_type: string;
  email_verified: boolean;
  verification_token: string | null;
  verification_token_expiry: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ProgressRow {
  user_id: string;
  completed_lessons: Record<string, boolean> | null;
  completed_quizzes: Record<string, boolean> | null;
  exam_score: number | null;
  user_notes: Record<string, string> | null;
  bookmarks: Record<string, boolean> | null;
  lesson_feedback: Record<string, 'up' | 'down'> | null;
  study_days: string[] | null;
  theme: string;
  sound_enabled: boolean;
  current_lesson_index: number;
  updated_at: string | Date;
}

interface SessionRow {
  token: string;
  user_id: string;
  created_at: string | Date;
  expires_at: string | Date;
}

function toIso(value: string | Date | null): string | undefined {
  if (value === null || value === undefined) return undefined;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function rowToUser(r: UserRow): DbUser {
  return {
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    salt: r.salt,
    name: r.name,
    avatar: r.avatar ?? undefined,
    role: r.role as DbUser['role'],
    isPro: r.is_pro,
    planType: r.plan_type as DbUser['planType'],
    emailVerified: r.email_verified,
    verificationToken: r.verification_token ?? undefined,
    verificationTokenExpiry: toIso(r.verification_token_expiry),
    createdAt: toIso(r.created_at) ?? new Date().toISOString(),
    updatedAt: toIso(r.updated_at) ?? new Date().toISOString(),
  };
}

function rowToProgress(r: ProgressRow): DbUserProgress {
  return {
    userId: r.user_id,
    completedLessons: r.completed_lessons ?? {},
    completedQuizzes: r.completed_quizzes ?? {},
    examScore: r.exam_score ?? null,
    userNotes: r.user_notes ?? {},
    bookmarks: r.bookmarks ?? {},
    lessonFeedback: r.lesson_feedback ?? {},
    studyDays: r.study_days ?? [],
    theme: (r.theme as DbUserProgress['theme']) ?? 'dark',
    soundEnabled: r.sound_enabled ?? true,
    currentLessonIndex: r.current_lesson_index ?? 0,
    updatedAt: toIso(r.updated_at) ?? new Date().toISOString(),
  };
}

function rowToSession(r: SessionRow): DbSession {
  return {
    token: r.token,
    userId: r.user_id,
    createdAt: toIso(r.created_at) ?? new Date().toISOString(),
    expiresAt: toIso(r.expires_at) ?? new Date().toISOString(),
  };
}

// ── Password hashing utilities ──
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(computedHash, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── Progress helpers ──
async function insertProgress(
  userId: string,
  partial: Partial<DbUserProgress> | undefined,
  now: string
): Promise<DbUserProgress> {
  const sql = getSql();
  const progress: DbUserProgress = {
    userId,
    completedLessons: partial?.completedLessons || {},
    completedQuizzes: partial?.completedQuizzes || {},
    examScore: partial?.examScore ?? null,
    userNotes: partial?.userNotes || {},
    bookmarks: partial?.bookmarks || {},
    lessonFeedback: partial?.lessonFeedback || {},
    studyDays: partial?.studyDays || [now.slice(0, 10)],
    theme: partial?.theme || 'dark',
    soundEnabled: partial?.soundEnabled ?? true,
    currentLessonIndex: partial?.currentLessonIndex ?? 0,
    updatedAt: now,
  };

  await sql`
    INSERT INTO progress (
      user_id, completed_lessons, completed_quizzes, exam_score, user_notes,
      bookmarks, lesson_feedback, study_days, theme, sound_enabled,
      current_lesson_index, updated_at
    ) VALUES (
      ${userId},
      ${JSON.stringify(progress.completedLessons)}::jsonb,
      ${JSON.stringify(progress.completedQuizzes)}::jsonb,
      ${progress.examScore},
      ${JSON.stringify(progress.userNotes)}::jsonb,
      ${JSON.stringify(progress.bookmarks)}::jsonb,
      ${JSON.stringify(progress.lessonFeedback)}::jsonb,
      ${JSON.stringify(progress.studyDays)}::jsonb,
      ${progress.theme},
      ${progress.soundEnabled},
      ${progress.currentLessonIndex},
      ${now}
    )
    ON CONFLICT (user_id) DO NOTHING
  `;

  return progress;
}

async function updateProgressRow(progress: DbUserProgress, now: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE progress SET
      completed_lessons = ${JSON.stringify(progress.completedLessons)}::jsonb,
      completed_quizzes = ${JSON.stringify(progress.completedQuizzes)}::jsonb,
      exam_score = ${progress.examScore},
      user_notes = ${JSON.stringify(progress.userNotes)}::jsonb,
      bookmarks = ${JSON.stringify(progress.bookmarks)}::jsonb,
      lesson_feedback = ${JSON.stringify(progress.lessonFeedback)}::jsonb,
      study_days = ${JSON.stringify(progress.studyDays)}::jsonb,
      theme = ${progress.theme},
      sound_enabled = ${progress.soundEnabled},
      current_lesson_index = ${progress.currentLessonIndex},
      updated_at = ${now}
    WHERE user_id = ${progress.userId}
  `;
}

// ── User Management ──
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureSchema();
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const rows = (await sql`SELECT * FROM users WHERE lower(email) = ${normalized} LIMIT 1`) as unknown as UserRow[];
  return rows.length ? rowToUser(rows[0]) : null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as unknown as UserRow[];
  return rows.length ? rowToUser(rows[0]) : null;
}

export async function createUser(params: {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role?: 'student' | 'admin';
  initialProgress?: Partial<DbUserProgress>;
}): Promise<{ user: DbUser; verificationToken: string }> {
  await ensureSchema();
  const sql = getSql();
  const normalizedEmail = params.email.trim().toLowerCase();

  const existing = (await sql`SELECT id FROM users WHERE lower(email) = ${normalizedEmail} LIMIT 1`) as unknown as {
    id: string;
  }[];
  if (existing.length) {
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

  await sql`
    INSERT INTO users (
      id, email, password_hash, salt, name, avatar, role, is_pro, plan_type,
      email_verified, verification_token, verification_token_expiry, created_at, updated_at
    ) VALUES (
      ${newUser.id}, ${newUser.email}, ${newUser.passwordHash}, ${newUser.salt}, ${newUser.name},
      ${newUser.avatar}, ${newUser.role}, ${newUser.isPro}, ${newUser.planType},
      ${newUser.emailVerified}, ${verificationToken}, ${verificationTokenExpiry}, ${now}, ${now}
    )
  `;

  await insertProgress(userId, params.initialProgress, now);

  // Return the user (and verification token) but NO session yet — session is
  // created only after email is confirmed.
  return { user: newUser, verificationToken };
}

// ── Email Verification ──
export async function verifyEmailToken(token: string): Promise<DbUser | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM users
    WHERE verification_token = ${token}
      AND verification_token_expiry IS NOT NULL
      AND verification_token_expiry > now()
    LIMIT 1
  `) as unknown as UserRow[];
  if (!rows.length) return null;

  const user = rowToUser(rows[0]);
  const now = new Date().toISOString();
  await sql`
    UPDATE users SET
      email_verified = TRUE,
      verification_token = NULL,
      verification_token_expiry = NULL,
      updated_at = ${now}
    WHERE id = ${user.id}
  `;

  return {
    ...user,
    emailVerified: true,
    verificationToken: undefined,
    verificationTokenExpiry: undefined,
    updatedAt: now,
  };
}

export async function refreshVerificationToken(email: string): Promise<{ token: string } | null> {
  await ensureSchema();
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const rows = (await sql`SELECT * FROM users WHERE lower(email) = ${normalized} LIMIT 1`) as unknown as UserRow[];
  if (!rows.length) return null;

  const user = rowToUser(rows[0]);
  if (user.emailVerified) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();
  await sql`
    UPDATE users SET
      verification_token = ${token},
      verification_token_expiry = ${expiry},
      updated_at = ${now}
    WHERE id = ${user.id}
  `;
  return { token };
}

export async function createSessionForUser(userId: string): Promise<DbSession> {
  await ensureSchema();
  const sql = getSql();
  const now = new Date().toISOString();
  const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await sql`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (${token}, ${userId}, ${now}, ${expiresAt})
  `;

  return { token, userId, createdAt: now, expiresAt };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: DbUser; session: DbSession }> {
  const user = await getUserByEmail(email);
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

  const session = await createSessionForUser(user.id);
  return { user, session };
}

export async function getSessionUser(
  token: string
): Promise<{ user: DbUser; progress: DbUserProgress } | null> {
  if (!token) return null;
  await ensureSchema();
  const sql = getSql();

  const sessionRows = (await sql`SELECT * FROM sessions WHERE token = ${token} LIMIT 1`) as unknown as SessionRow[];
  if (!sessionRows.length) return null;
  const session = rowToSession(sessionRows[0]);

  if (new Date(session.expiresAt) < new Date()) {
    // Session expired
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return null;
  }

  const userRows = (await sql`SELECT * FROM users WHERE id = ${session.userId} LIMIT 1`) as unknown as UserRow[];
  if (!userRows.length) return null;
  const user = rowToUser(userRows[0]);

  const progressRows = (await sql`SELECT * FROM progress WHERE user_id = ${user.id} LIMIT 1`) as unknown as ProgressRow[];
  let progress: DbUserProgress;
  if (!progressRows.length) {
    progress = await insertProgress(user.id, undefined, new Date().toISOString());
  } else {
    progress = rowToProgress(progressRows[0]);
  }

  return { user, progress };
}

export async function deleteSession(token: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

// ── Progress Management ──
export async function getUserProgress(userId: string): Promise<DbUserProgress | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`SELECT * FROM progress WHERE user_id = ${userId} LIMIT 1`) as unknown as ProgressRow[];
  return rows.length ? rowToProgress(rows[0]) : null;
}

// Alias for external callers (used by verify-email API route)
export const getUserProgressByUserId = getUserProgress;

export async function saveUserProgress(
  userId: string,
  progressData: Partial<Omit<DbUserProgress, 'userId' | 'updatedAt'>>
): Promise<DbUserProgress> {
  await ensureSchema();
  const sql = getSql();
  const now = new Date().toISOString();

  const rows = (await sql`SELECT * FROM progress WHERE user_id = ${userId} LIMIT 1`) as unknown as ProgressRow[];

  if (!rows.length) {
    return insertProgress(userId, progressData, now);
  }

  // Merge updates
  const current = rowToProgress(rows[0]);
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

  await updateProgressRow(updated, now);
  return updated;
}

export async function updateUserProStatus(
  userId: string,
  isPro: boolean,
  planType: 'free' | 'monthly' | 'annual' | 'lifetime'
): Promise<DbUser | null> {
  await ensureSchema();
  const sql = getSql();
  const now = new Date().toISOString();
  const rows = (await sql`
    UPDATE users SET is_pro = ${isPro}, plan_type = ${planType}, updated_at = ${now}
    WHERE id = ${userId}
    RETURNING *
  `) as unknown as UserRow[];
  return rows.length ? rowToUser(rows[0]) : null;
}

export async function updateUserProStatusByEmail(
  email: string,
  isPro: boolean,
  planType: 'free' | 'monthly' | 'annual' | 'lifetime'
): Promise<DbUser | null> {
  await ensureSchema();
  const sql = getSql();
  const normalized = email.toLowerCase().trim();
  const now = new Date().toISOString();
  const rows = (await sql`
    UPDATE users SET is_pro = ${isPro}, plan_type = ${planType}, updated_at = ${now}
    WHERE lower(email) = ${normalized}
    RETURNING *
  `) as unknown as UserRow[];
  return rows.length ? rowToUser(rows[0]) : null;
}
