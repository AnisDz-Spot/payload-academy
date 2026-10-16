'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import type { SchemaTable } from '@/lib/schemaParser';

const SAMPLE_CONFIG = `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
    { name: 'featured', type: 'checkbox' },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
  ],
}`;

interface ColumnDef {
  name: string;
  sqlType: string;
  drizzleType: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  isIndex?: boolean;
  foreignKey?: string;
  defaultValue?: string;
}

interface TableSchema {
  tableName: string;
  collectionSlug: string;
  description: string;
  columns: ColumnDef[];
}

const SCHEMAS: Record<string, TableSchema> = {
  posts: {
    tableName: 'posts',
    collectionSlug: 'posts',
    description: 'Stores blog articles with draft states, Lexical JSON AST, and relational author/media pointers.',
    columns: [
      { name: 'id', sqlType: 'serial', drizzleType: 'serial("id")', isPrimary: true, isNullable: false },
      { name: 'title', sqlType: 'varchar(255)', drizzleType: 'varchar("title", { length: 255 })', isNullable: false },
      { name: 'slug', sqlType: 'varchar(255)', drizzleType: 'varchar("slug", { length: 255 })', isNullable: false, isUnique: true, isIndex: true },
      { name: 'content', sqlType: 'jsonb', drizzleType: 'jsonb("content")', isNullable: true, defaultValue: "'{}'::jsonb" },
      { name: 'excerpt', sqlType: 'text', drizzleType: 'text("excerpt")', isNullable: true },
      { name: '_status', sqlType: 'varchar(32)', drizzleType: 'varchar("_status", { length: 32 })', isNullable: false, isIndex: true, defaultValue: "'draft'" },
      { name: 'author_id', sqlType: 'integer', drizzleType: 'integer("author_id")', isNullable: false, foreignKey: 'users(id)', isIndex: true },
      { name: 'cover_image_id', sqlType: 'integer', drizzleType: 'integer("cover_image_id")', isNullable: true, foreignKey: 'media(id)' },
      { name: 'created_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("created_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("updated_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    ],
  },
  products: {
    tableName: 'products',
    collectionSlug: 'products',
    description: 'E-commerce product catalog with inventory stock integer and pricing in cents.',
    columns: [
      { name: 'id', sqlType: 'serial', drizzleType: 'serial("id")', isPrimary: true, isNullable: false },
      { name: 'title', sqlType: 'varchar(255)', drizzleType: 'varchar("title", { length: 255 })', isNullable: false },
      { name: 'slug', sqlType: 'varchar(255)', drizzleType: 'varchar("slug", { length: 255 })', isNullable: false, isUnique: true, isIndex: true },
      { name: 'sku', sqlType: 'varchar(64)', drizzleType: 'varchar("sku", { length: 64 })', isNullable: false, isUnique: true },
      { name: 'price_in_cents', sqlType: 'integer', drizzleType: 'integer("price_in_cents")', isNullable: false, isIndex: true },
      { name: 'inventory_stock', sqlType: 'integer', drizzleType: 'integer("inventory_stock")', isNullable: false, defaultValue: '0' },
      { name: 'category_id', sqlType: 'integer', drizzleType: 'integer("category_id")', isNullable: false, foreignKey: 'categories(id)' },
      { name: 'created_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("created_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    ],
  },
  users: {
    tableName: 'users',
    collectionSlug: 'users',
    description: 'Authentication collection with Argon2 password hashes, session lock tracking, and API keys.',
    columns: [
      { name: 'id', sqlType: 'serial', drizzleType: 'serial("id")', isPrimary: true, isNullable: false },
      { name: 'email', sqlType: 'varchar(255)', drizzleType: 'varchar("email", { length: 255 })', isNullable: false, isUnique: true, isIndex: true },
      { name: 'hash', sqlType: 'varchar(255)', drizzleType: 'varchar("hash", { length: 255 })', isNullable: false },
      { name: 'role', sqlType: 'varchar(32)', drizzleType: 'varchar("role", { length: 32 })', isNullable: false, defaultValue: "'editor'", isIndex: true },
      { name: 'api_key', sqlType: 'varchar(255)', drizzleType: 'varchar("api_key", { length: 255 })', isNullable: true, isUnique: true },
      { name: 'login_attempts', sqlType: 'integer', drizzleType: 'integer("login_attempts")', isNullable: false, defaultValue: '0' },
      { name: 'lock_until', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("lock_until", { withTimezone: true })', isNullable: true },
      { name: 'created_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("created_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    ],
  },
};

export default function DbVisualizerPage() {
  const { toggleTheme } = useAcademy();
  const [schemas, setSchemas] = useState<Record<string, TableSchema>>(SCHEMAS);
  const [selectedKey, setSelectedKey] = useState<string>('posts');
  const [viewTab, setViewTab] = useState<'table' | 'drizzle' | 'sql' | 'migration'>('table');
  const [copied, setCopied] = useState(false);

  const [analysisSource, setAnalysisSource] = useState(SAMPLE_CONFIG);
  const [analyzing, setAnalyzing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [parsedFromConfig, setParsedFromConfig] = useState(false);

  const currentSchema = schemas[selectedKey] || Object.values(schemas)[0];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setParseError(null);
    setParseWarnings([]);
    try {
      const res = await fetch('/api/db-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: analysisSource }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParseError(typeof data.error === 'string' ? data.error : 'Schema parsing failed.');
        return;
      }
      if (Array.isArray(data.syntaxErrors) && data.syntaxErrors.length) {
        setParseWarnings(data.syntaxErrors as string[]);
      }
      if (data.error) {
        setParseError(data.error as string);
        return;
      }
      const tables = data.tables as SchemaTable[];
      const next: Record<string, TableSchema> = {};
      for (const t of tables) next[t.tableName] = t;
      if (Object.keys(next).length) {
        setSchemas(next);
        setSelectedKey(tables[0].tableName);
        setParsedFromConfig(true);
      }
    } catch {
      setParseError('Network error while parsing the config.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetToSamples = () => {
    setSchemas(SCHEMAS);
    setSelectedKey('posts');
    setParsedFromConfig(false);
    setParseError(null);
    setParseWarnings([]);
  };

  // Generate Drizzle ORM TypeScript
  let drizzleCode = `import { pgTable, serial, varchar, text, integer, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'\nimport { relations } from 'drizzle-orm'\n\n`;
  drizzleCode += `export const ${currentSchema.tableName} = pgTable(\n  '${currentSchema.tableName}',\n  {\n`;
  currentSchema.columns.forEach((col) => {
    let line = `    ${col.name}: ${col.drizzleType}`;
    if (col.isPrimary) line += '.primaryKey()';
    if (!col.isNullable && !col.isPrimary) line += '.notNull()';
    if (col.defaultValue) line += `.default(${col.defaultValue.replace(/::.*$/, '')})`;
    line += ',\n';
    drizzleCode += line;
  });
  drizzleCode += `  },\n  (table) => ({\n`;
  currentSchema.columns.forEach((col) => {
    if (col.isUnique && !col.isPrimary) {
      drizzleCode += `    idx_${currentSchema.tableName}_${col.name}_uniq: uniqueIndex('${currentSchema.tableName}_${col.name}_idx').on(table.${col.name}),\n`;
    } else if (col.isIndex && !col.isPrimary) {
      drizzleCode += `    idx_${currentSchema.tableName}_${col.name}: index('${currentSchema.tableName}_${col.name}_idx').on(table.${col.name}),\n`;
    }
  });
  drizzleCode += `  })\n)\n`;

  // Generate Raw PostgreSQL DDL
  let rawSql = `-- PostgreSQL DDL Schema for Table: "${currentSchema.tableName}"\n\n`;
  rawSql += `CREATE TABLE "${currentSchema.tableName}" (\n`;
  const sqlCols = currentSchema.columns.map((col) => {
    let c = `  "${col.name}" ${col.sqlType.toUpperCase()}`;
    if (col.isPrimary) c += ' PRIMARY KEY';
    if (!col.isNullable) c += ' NOT NULL';
    if (col.isUnique && !col.isPrimary) c += ' UNIQUE';
    if (col.defaultValue) c += ` DEFAULT ${col.defaultValue}`;
    if (col.foreignKey) c += ` REFERENCES ${col.foreignKey} ON DELETE CASCADE`;
    return c;
  });
  rawSql += sqlCols.join(',\n') + '\n);\n\n';

  currentSchema.columns.forEach((col) => {
    if (col.isIndex && !col.isPrimary && !col.isUnique) {
      rawSql += `CREATE INDEX "idx_${currentSchema.tableName}_${col.name}" ON "${currentSchema.tableName}" ("${col.name}");\n`;
    }
  });

  // Generate Migration File
  let migrationCode = `import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'\n\n`;
  migrationCode += `export async function up({ db }: MigrateUpArgs): Promise<void> {\n`;
  migrationCode += `  await db.execute(sql\`\n`;
  migrationCode += `    CREATE TABLE IF NOT EXISTS "${currentSchema.tableName}" (\n`;
  migrationCode += currentSchema.columns.map((c) => `      "${c.name}" ${c.sqlType.toUpperCase()}`).join(',\n');
  migrationCode += `\n    );\n  \`)\n}\n\n`;
  migrationCode += `export async function down({ db }: MigrateDownArgs): Promise<void> {\n`;
  migrationCode += `  await db.execute(sql\`DROP TABLE IF EXISTS "${currentSchema.tableName}" CASCADE;\`)\n}\n`;

  const handleCopy = () => {
    let text = drizzleCode;
    if (viewTab === 'sql') text = rawSql;
    if (viewTab === 'migration') text = migrationCode;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">
            ← Back to Academy
          </Link>
          <div className="logo-small">
            <i>P</i>
            <span>Drizzle &amp; SQL Visualizer</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/schema-builder" className="t">
              ⚙️ Schema Studio
            </Link>
            <Link href="/terminal" className="t">
              💻 Terminal
            </Link>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1280 }}>
          <div className="kick">Relational Architecture Engine</div>
          <h1>Payload 3.x to Drizzle ORM &amp; PostgreSQL Visualizer</h1>
          <p className="lead">
            Inspect how high-level Payload TypeScript Collection Schemas are compiled into strongly-typed Drizzle ORM tables, composite indices, foreign keys, and SQL DDL migrations.
            <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
              🔬 Paste your own Payload config below and the table mappings, indices, foreign keys and DDL are derived from your actual fields. The built-in samples are illustrative of Payload&apos;s Postgres adapter.
            </span>
          </p>

          {/* Config Parser */}
          <div className="panel-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>🔬 Parse a Payload Config</span>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                  Paste a collection config to derive its Drizzle table, indices, foreign keys and DDL from the actual fields.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="t" onClick={resetToSamples}>↺ Sample tables</button>
                <button
                  className="quick-mark-btn"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '6px 14px', opacity: analyzing ? 0.6 : 1, cursor: analyzing ? 'wait' : 'pointer' }}
                >
                  {analyzing ? 'Analyzing…' : '⚡ Parse Config'}
                </button>
              </div>
            </div>
            <textarea
              value={analysisSource}
              onChange={(e) => setAnalysisSource(e.target.value)}
              spellCheck={false}
              className="sb-input"
              style={{ width: '100%', minHeight: 150, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5, resize: 'vertical' }}
            />
            {parseWarnings.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#f59e0b' }}>
                ⚠️ Syntax warnings: {parseWarnings.join('; ')}
              </div>
            )}
            {parseError && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>⛔ {parseError}</div>
            )}
            {parsedFromConfig && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>✅ Showing tables parsed from your config.</div>
            )}
          </div>

          {/* Table Switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>Select Table:</span>
            {Object.keys(schemas).map((key) => (
              <button
                key={key}
                className={`t ${selectedKey === key ? 'active' : ''}`}
                onClick={() => setSelectedKey(key)}
              >
                🗄️ {schemas[key].tableName} table
              </button>
            ))}
          </div>

          <div className="panel-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  PostgreSQL Table: {currentSchema.tableName}
                </span>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>{currentSchema.description}</p>
              </div>
              <span className="lesson-meta-chip">{currentSchema.columns.length} Relational Columns</span>
            </div>

            {/* View Switcher Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="sb-tabs">
                <button
                  className={`sb-tab ${viewTab === 'table' ? 'active' : ''}`}
                  onClick={() => setViewTab('table')}
                >
                  📊 Schema ER Table
                </button>
                <button
                  className={`sb-tab ${viewTab === 'drizzle' ? 'active' : ''}`}
                  onClick={() => setViewTab('drizzle')}
                >
                  TypeScript Drizzle ORM
                </button>
                <button
                  className={`sb-tab ${viewTab === 'sql' ? 'active' : ''}`}
                  onClick={() => setViewTab('sql')}
                >
                  Raw PostgreSQL SQL
                </button>
                <button
                  className={`sb-tab ${viewTab === 'migration' ? 'active' : ''}`}
                  onClick={() => setViewTab('migration')}
                >
                  Migration File (.ts)
                </button>
              </div>
              {viewTab !== 'table' && (
                <button className="t" onClick={handleCopy}>
                  {copied ? '✓ Copied' : '📋 Copy Code'}
                </button>
              )}
            </div>

            {/* View Tab 1: Interactive Table */}
            {viewTab === 'table' && (
              <div className="tbl" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>PostgreSQL Type</th>
                      <th>Drizzle ORM Definition</th>
                      <th>Constraints &amp; Indices</th>
                      <th>Default Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSchema.columns.map((col) => (
                      <tr key={col.name}>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text)' }}>
                          {col.name}
                        </td>
                        <td>
                          <span className="role-tag" style={{ fontSize: 11, background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                            {col.sqlType}
                          </span>
                        </td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
                          {col.drizzleType}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {col.isPrimary && (
                              <span className="status-badge in-progress" style={{ fontSize: 10, background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
                                PK
                              </span>
                            )}
                            {col.isUnique && !col.isPrimary && (
                              <span className="status-badge completed" style={{ fontSize: 10 }}>
                                UNIQUE
                              </span>
                            )}
                            {!col.isNullable && !col.isPrimary && (
                              <span className="role-tag" style={{ fontSize: 10 }}>NOT NULL</span>
                            )}
                            {col.isIndex && !col.isPrimary && (
                              <span className="role-tag" style={{ fontSize: 10, borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                                INDEX (btree)
                              </span>
                            )}
                            {col.foreignKey && (
                              <span className="role-tag" style={{ fontSize: 10, background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', borderColor: '#ef444444' }}>
                                FK → {col.foreignKey}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
                          {col.defaultValue || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* View Tab 2: Drizzle ORM */}
            {viewTab === 'drizzle' && (
              <div className="sb-code-box" style={{ minHeight: 400 }}>
                <pre style={{ margin: 0, padding: 18 }}>
                  <code>{drizzleCode}</code>
                </pre>
              </div>
            )}

            {/* View Tab 3: Raw SQL */}
            {viewTab === 'sql' && (
              <div className="sb-code-box" style={{ minHeight: 400 }}>
                <pre style={{ margin: 0, padding: 18 }}>
                  <code>{rawSql}</code>
                </pre>
              </div>
            )}

            {/* View Tab 4: Migration File */}
            {viewTab === 'migration' && (
              <div className="sb-code-box" style={{ minHeight: 400 }}>
                <pre style={{ margin: 0, padding: 18 }}>
                  <code>{migrationCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
