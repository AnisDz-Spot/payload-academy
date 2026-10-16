// lib/queryEngine.ts
//
// A small, dependency-free evaluator that mirrors the shape and semantics of
// Payload's Local API `find` query: `where` operators, `sort`, `limit`, and
// `depth`. It runs entirely client-side against an in-memory mock dataset so
// the Query Simulator can show a genuinely evaluated result instead of a
// static array.

export type WhereOp =
  | 'equals'
  | 'not_equals'
  | 'like'
  | 'in'
  | 'greater_than'
  | 'less_than'
  | 'exists';

export type Where = Record<string, Partial<Record<WhereOp, unknown>>>;

export interface QueryParams {
  collection: string;
  where?: Where;
  sort?: string;
  limit?: number;
  depth?: number;
}

export interface QueryResult {
  docs: Record<string, unknown>[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const QUERY_COLLECTIONS: Record<string, Record<string, unknown>[]> = {
  posts: [
    { id: 'post_101', title: 'Getting Started with Payload 3.x in Next.js 16', slug: 'getting-started-payload-3', _status: 'published', category: { id: 'cat_1', name: 'Engineering' }, author: { id: 'usr_1', name: 'Alice Chen' }, createdAt: '2026-03-15T10:00:00Z' },
    { id: 'post_102', title: 'Deep Dive: Drizzle ORM and Postgres Connection Pooling', slug: 'drizzle-postgres-pooling', _status: 'published', category: { id: 'cat_1', name: 'Engineering' }, author: { id: 'usr_2', name: 'Bob Smith' }, createdAt: '2026-03-20T14:30:00Z' },
    { id: 'post_103', title: 'Upcoming 3.2 Roadmap and Vector Search Support', slug: 'roadmap-vector-search', _status: 'draft', category: { id: 'cat_2', name: 'Announcements' }, author: { id: 'usr_1', name: 'Alice Chen' }, createdAt: '2026-04-01T09:15:00Z' },
  ],
  products: [
    { id: 'prod_1', title: 'Mechanical Keyboard Pro RGB', slug: 'mechanical-keyboard-pro', priceInCents: 14900, inventoryStock: 45, status: 'active', sku: 'KB-RGB-01' },
    { id: 'prod_2', title: 'Ergonomic Vertical Mouse', slug: 'ergo-vertical-mouse', priceInCents: 7900, inventoryStock: 0, status: 'active', sku: 'MS-VR-02' },
    { id: 'prod_3', title: 'UltraWide 34-inch Curved Monitor', slug: 'ultrawide-34-monitor', priceInCents: 69900, inventoryStock: 12, status: 'active', sku: 'MN-34-UW' },
  ],
  users: [
    { id: 'usr_1', email: 'alice@acme.com', name: 'Alice Chen', role: 'admin', createdAt: '2026-01-10T08:00:00Z' },
    { id: 'usr_2', email: 'bob@acme.com', name: 'Bob Smith', role: 'editor', createdAt: '2026-02-14T11:20:00Z' },
  ],
};

function getByPath(doc: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = doc;
  for (const part of parts) {
    if (cur && typeof cur === 'object') {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

function looseEquals(docVal: unknown, expected: unknown): boolean {
  if (docVal === undefined || docVal === null) return false;
  if (typeof docVal === 'number') {
    const n = Number(expected);
    return !Number.isNaN(n) && docVal === n;
  }
  if (typeof docVal === 'boolean') {
    return String(docVal) === String(expected);
  }
  if (typeof docVal === 'object') {
    const id = (docVal as Record<string, unknown>).id;
    return id !== undefined && String(id) === String(expected);
  }
  return String(docVal) === String(expected);
}

function compareValues(a: unknown, b: unknown): number {
  if (a === undefined || a === null) return Number.NaN;
  const an = typeof a === 'number' ? a : Number(a);
  const bn = typeof b === 'number' ? b : Number(b);
  if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
  const as = String(a);
  const bs = String(b);
  const ad = Date.parse(as);
  const bd = Date.parse(bs);
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;
  return as.localeCompare(bs);
}

function matchValue(docVal: unknown, op: WhereOp, expected: unknown): boolean {
  switch (op) {
    case 'equals':
      return looseEquals(docVal, expected);
    case 'not_equals':
      return !looseEquals(docVal, expected);
    case 'like':
      return (
        docVal !== undefined &&
        docVal !== null &&
        String(docVal).toLowerCase().includes(String(expected).toLowerCase())
      );
    case 'in': {
      const list = Array.isArray(expected) ? expected : String(expected).split(',').map((s) => s.trim());
      return list.some((e) => looseEquals(docVal, e));
    }
    case 'greater_than': {
      const c = compareValues(docVal, expected);
      return !Number.isNaN(c) && c > 0;
    }
    case 'less_than': {
      const c = compareValues(docVal, expected);
      return !Number.isNaN(c) && c < 0;
    }
    case 'exists': {
      const exists = docVal !== undefined && docVal !== null;
      const want = expected === true || expected === 'true';
      return exists === want;
    }
    default:
      return true;
  }
}

function collapseToId(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((el) => (el && typeof el === 'object' ? (el as Record<string, unknown>).id : el));
  }
  if (value && typeof value === 'object') {
    const id = (value as Record<string, unknown>).id;
    return id !== undefined ? id : value;
  }
  return value;
}

function collapseRelations(doc: Record<string, unknown>, depth: number): Record<string, unknown> {
  if (depth >= 1) return doc;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc)) {
    out[key] = value && typeof value === 'object' ? collapseToId(value) : value;
  }
  return out;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [value as Record<string, unknown>];
}

// Evaluates a Payload-style `where` object (field operators plus `and`/`or`/`not`
// groups) against a single document. Shared by the query simulator and the
// RBAC access-control evaluator.
export function matchesWhere(doc: Record<string, unknown>, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (key === 'and') return asArray(value).every((w) => matchesWhere(doc, w));
    if (key === 'or') return asArray(value).some((w) => matchesWhere(doc, w));
    if (key === 'not') return !asArray(value).every((w) => matchesWhere(doc, w));
    const fieldVal = getByPath(doc, key);
    return Object.entries(value as Record<string, unknown>).every(([op, expected]) =>
      matchValue(fieldVal, op as WhereOp, expected),
    );
  });
}

export function runQuery(params: QueryParams): QueryResult {
  const all = QUERY_COLLECTIONS[params.collection] || [];
  const where = params.where || {};

  const filtered = all.filter((doc) =>
    Object.entries(where).every(([field, cond]) =>
      Object.entries(cond).every(([op, expected]) =>
        matchValue(getByPath(doc, field), op as WhereOp, expected),
      ),
    ),
  );

  const sortSpec = params.sort?.trim();
  const sorted = sortSpec
    ? [...filtered].sort((a, b) => {
        const desc = sortSpec.startsWith('-');
        const path = desc ? sortSpec.slice(1) : sortSpec;
        const c = compareValues(getByPath(a, path), getByPath(b, path));
        const safe = Number.isNaN(c) ? 0 : c;
        return desc ? -safe : safe;
      })
    : filtered;

  const totalDocs = sorted.length;
  const limit = params.limit && params.limit > 0 ? params.limit : Math.max(totalDocs, 1);
  const depth = params.depth ?? 1;
  const docs = sorted.slice(0, limit).map((d) => collapseRelations(d, depth));
  const totalPages = totalDocs > 0 ? Math.ceil(totalDocs / limit) : 0;

  return {
    docs,
    totalDocs,
    limit,
    totalPages,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: totalPages > 1,
    nextPage: totalPages > 1 ? 2 : null,
    prevPage: null,
  };
}
