'use client'
import React from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

export default function StudyGuidePage() {
  const { toggleTheme } = useAcademy();

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">
            ← Back to Academy
          </Link>
          <div className="logo-small">
            <i>P</i>
            <span>Payload 3.x Official Study Guide &amp; Cheatsheet</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="t"
              onClick={() => window.print()}
              style={{ background: 'var(--accent)', color: '#fff', fontWeight: 700 }}
            >
              🖨️ Export PDF
            </button>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div className="kick">Certification Preparation Material</div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Payload 3.x Master Reference &amp; Study Guide</h1>
          <p className="lead">
            High-density quick reference sheet covering configuration syntax, access control patterns, lifecycle hooks, Local API operations, and CLI commands. Printable directly to PDF.
          </p>

          {/* Section 1: In-Process Local API */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              ⚡ 1. Local API in Server Components &amp; Server Actions
            </h2>
            <div className="tbl" style={{ margin: '14px 0' }}>
              <table>
                <thead>
                  <tr><th>Operation</th><th>Method Signature</th><th>Key Arguments</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Find Multiple</b></td>
                    <td><code>payload.find()</code></td>
                    <td><code>collection, where, sort, limit, page, depth, overrideAccess, user</code></td>
                  </tr>
                  <tr>
                    <td><b>Find Single by ID</b></td>
                    <td><code>payload.findByID()</code></td>
                    <td><code>collection, id, depth, select, populate</code></td>
                  </tr>
                  <tr>
                    <td><b>Create Document</b></td>
                    <td><code>payload.create()</code></td>
                    <td><code>collection, data, overrideAccess, req</code></td>
                  </tr>
                  <tr>
                    <td><b>Update Document</b></td>
                    <td><code>payload.update()</code></td>
                    <td><code>collection, id, data, where, context</code></td>
                  </tr>
                  <tr>
                    <td><b>Delete Document</b></td>
                    <td><code>payload.delete()</code></td>
                    <td><code>collection, id, where, overrideAccess</code></td>
                  </tr>
                  <tr>
                    <td><b>Count Documents</b></td>
                    <td><code>payload.count()</code></td>
                    <td><code>collection, where</code></td>
                  </tr>
                  <tr>
                    <td><b>Find Global</b></td>
                    <td><code>payload.findGlobal()</code></td>
                    <td><code>slug, depth, draft</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tip">
              <b>Security Rule:</b> The Local API bypasses access control by default (<code>overrideAccess: true</code>). When executing queries on behalf of users in Server Actions, always pass <code>overrideAccess: false</code> and <code>user: req.user</code>.
            </div>
          </div>

          {/* Section 2: Access Control Patterns */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              🔒 2. Declarative Access Control &amp; Row-Level Security
            </h2>
            <div className="cb">
              <div className="fn">Access Control Cheat Sheet</div>
              <pre><code>{`// 1. Boolean return (all or nothing)
const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

// 2. Row-Level Security Query Constraint (filters database rows)
const canReadPublishedOrOwn: Access = ({ req: { user } }) => {
  if (!user) return { _status: { equals: 'published' } }
  if (user.role === 'admin') return true
  return {
    or: [
      { _status: { equals: 'published' } },
      { author: { equals: user.id } },
    ],
  }
}`}</code></pre>
            </div>
          </div>

          {/* Section 3: Lifecycle Hooks Pipeline */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              🔄 3. Lifecycle Hooks Execution Pipeline
            </h2>
            <div className="tbl" style={{ margin: '14px 0' }}>
              <table>
                <thead>
                  <tr><th>Hook Name</th><th>Execution Point</th><th>Can Mutate Data?</th><th>Common Use Case</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>beforeValidate</code></td>
                    <td>Before schema validation</td>
                    <td>✅ Yes</td>
                    <td>Sanitizing raw user strings, pre-filling defaults.</td>
                  </tr>
                  <tr>
                    <td><code>beforeChange</code></td>
                    <td>After validation, before DB write</td>
                    <td>✅ Yes</td>
                    <td>Auto-generating slugs from title, computing hashes.</td>
                  </tr>
                  <tr>
                    <td><code>afterChange</code></td>
                    <td>After database write completes</td>
                    <td>❌ No</td>
                    <td>Next.js on-demand cache revalidation (<code>revalidatePath</code>), sending transactional emails.</td>
                  </tr>
                  <tr>
                    <td><code>afterRead</code></td>
                    <td>After reading from database</td>
                    <td>✅ Yes</td>
                    <td>Calculating dynamic virtual fields (e.g. <code>fullName</code>).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Query Operators Reference */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              🔍 4. WHERE Query Operators &amp; Relational Filtering
            </h2>
            <div className="tbl" style={{ margin: '14px 0' }}>
              <table>
                <thead>
                  <tr><th>Operator</th><th>SQL Equivalent</th><th>Example Query Syntax</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>equals</code> / <code>not_equals</code></td><td><code>=</code> / <code>!=</code></td><td><code>{"{ status: { equals: 'published' } }"}</code></td></tr>
                  <tr><td><code>in</code> / <code>not_in</code></td><td><code>IN (...)</code></td><td><code>{"{ category: { in: ['tech', 'news'] } }"}</code></td></tr>
                  <tr><td><code>like</code> / <code>contains</code></td><td><code>ILIKE '%val%'</code></td><td><code>{"{ title: { like: 'payload' } }"}</code> (Case-insensitive)</td></tr>
                  <tr><td><code>greater_than</code> / <code>less_than</code></td><td><code>&gt;</code> / <code>&lt;</code></td><td><code>{"{ price: { greater_than: 100 } }"}</code></td></tr>
                  <tr><td><code>exists</code></td><td><code>IS NOT NULL</code></td><td><code>{"{ publishedAt: { exists: true } }"}</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Essential CLI Commands */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              💻 5. Essential CLI Commands
            </h2>
            <div className="tbl" style={{ margin: '14px 0' }}>
              <table>
                <thead>
                  <tr><th>Command</th><th>Purpose</th><th>When to Run</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>payload generate:types</code></td><td>Compiles TS schema into <code>payload-types.ts</code></td><td>After any schema/field modification.</td></tr>
                  <tr><td><code>payload generate:importmap</code></td><td>Scans custom React admin components</td><td>When adding custom components to admin UI.</td></tr>
                  <tr><td><code>payload migrate:create &lt;name&gt;</code></td><td>Diffs schema and generates SQL migration file</td><td>Before altering production database tables.</td></tr>
                  <tr><td><code>payload migrate</code></td><td>Executes pending migrations in an ACID transaction</td><td>During CI/CD production deployments.</td></tr>
                  <tr><td><code>payload jobs:run</code></td><td>Executes queued background worker jobs</td><td>In cron daemons or serverless queues.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
