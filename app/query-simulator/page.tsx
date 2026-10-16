'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { runQuery, type Where, type WhereOp } from '@/lib/queryEngine';

interface WhereClause {
  field: string;
  op: WhereOp;
  val: string;
}

export default function QuerySimulatorPage() {
  const { toggleTheme } = useAcademy();
  const [collection, setCollection] = useState('posts');
  const [operation, setOperation] = useState<'find' | 'findByID' | 'count'>('find');
  const [sort, setSort] = useState('-createdAt');
  const [limit, setLimit] = useState(10);
  const [depth, setDepth] = useState(1);
  const [activeTab, setActiveTab] = useState<'local' | 'rest' | 'graphql' | 'response'>('local');
  const [copied, setCopied] = useState(false);

  const [clauses, setClauses] = useState<WhereClause[]>([
    { field: '_status', op: 'equals', val: 'published' },
  ]);

  const handleAddClause = () => {
    setClauses((prev) => [...prev, { field: 'status', op: 'equals', val: 'published' }]);
  };

  const handleRemoveClause = (idx: number) => {
    setClauses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateClause = (idx: number, updates: Partial<WhereClause>) => {
    setClauses((prev) => prev.map((c, i) => (i === idx ? { ...c, ...updates } : c)));
  };

  const whereObj: Record<string, unknown> = {};
  clauses.forEach((c) => {
    if (c.field) {
      whereObj[c.field] = {
        [c.op]: c.op === 'in' ? c.val.split(',').map((s) => s.trim()) : c.op === 'exists' ? c.val === 'true' : c.val,
      };
    }
  });

  // Generate Code Output
  let outputCode = '';
  if (activeTab === 'local') {
    outputCode =
      `import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nconst payload = await getPayload({ config })\n\n` +
      `const results = await payload.${operation}({\n` +
      `  collection: '${collection}',\n` +
      (operation === 'find' || operation === 'count'
        ? `  where: ${JSON.stringify(whereObj, null, 4).replace(/\n/g, '\n  ')},\n`
        : '') +
      (operation === 'find'
        ? `  sort: '${sort}',\n  limit: ${limit},\n  depth: ${depth},\n`
        : '') +
      `})`;
  } else if (activeTab === 'rest') {
    const params: string[] = [];
    clauses.forEach((c) => {
      if (c.field) params.push(`where[${encodeURIComponent(c.field)}][${c.op}]=${encodeURIComponent(c.val)}`);
    });
    if (operation === 'find') {
      params.push(`sort=${encodeURIComponent(sort)}`);
      params.push(`limit=${limit}`);
      params.push(`depth=${depth}`);
    }
    const qs = params.length ? `?${params.join('&')}` : '';
    const url = `https://api.mycorp.com/api/${collection}${qs}`;
    outputCode = `// REST Endpoint:\nGET ${url}\n\n// cURL Example:\ncurl -X GET "${url}" \\\n  -H "Authorization: users API-Key YOUR_KEY" \\\n  -H "Content-Type: application/json"`;
  } else if (activeTab === 'graphql') {
    const cap = collection.charAt(0).toUpperCase() + collection.slice(1);
    const gqlWhere = Object.keys(whereObj).length
      ? JSON.stringify(whereObj).replace(/"([^"]+)":/g, '$1:')
      : '{}';
    outputCode = `query Get${cap} {\n  ${cap}(\n    where: ${gqlWhere}\n    sort: "${sort}"\n    limit: ${limit}\n  ) {\n    docs {\n      id\n      title\n      createdAt\n    }\n    totalDocs\n    hasNextPage\n  }\n}`;
  }

  // Actually evaluate the query against the in-memory mock dataset, honoring
  // where operators, sort, limit and depth.
  const queryResult = runQuery({ collection, where: whereObj as Where, sort, limit, depth });

  const mockResponse =
    operation === 'find'
      ? queryResult
      : operation === 'count'
        ? { totalDocs: queryResult.totalDocs }
        : (queryResult.docs[0] ?? null);

  const handleCopy = () => {
    const text = activeTab === 'response' ? JSON.stringify(mockResponse, null, 2) : outputCode;
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
            <span>Interactive Query Simulator</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/schema-builder" className="t">
              ⚙️ Schema Studio
            </Link>
            <Link href="/config-linter" className="t">
              🛡️ Config Linter
            </Link>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1280 }}>
          <div className="kick">Interactive Engine</div>
          <h1>Payload Query, REST &amp; Local API Simulator</h1>
          <p className="lead">
            Build complex database queries visually and preview the generated code for the Local API (in Server Components), REST and GraphQL. Filters, sort, limit and depth are evaluated in real time against an in-memory mock dataset so you can see exactly how the query narrows the result set.
          </p>

          <div className="standalone-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left Column: Query Configurator */}
            <div className="panel-card">
              <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>Query Configuration</h2>

              <div className="sb-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="sb-group">
                    <label>Collection</label>
                    <select
                      className="sb-select"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                    >
                      <option value="posts">posts (Blog)</option>
                      <option value="products">products (E-commerce)</option>
                      <option value="users">users (Authentication)</option>
                    </select>
                  </div>
                  <div className="sb-group">
                    <label>Operation</label>
                    <select
                      className="sb-select"
                      value={operation}
                      onChange={(e) => setOperation(e.target.value as 'find' | 'findByID' | 'count')}
                    >
                      <option value="find">payload.find() [Find Multiple]</option>
                      <option value="findByID">payload.findByID() [Find One]</option>
                      <option value="count">payload.count() [Total Count]</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
                  <div className="sb-group">
                    <label>Sort</label>
                    <input
                      type="text"
                      className="sb-input"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      placeholder="-createdAt"
                    />
                  </div>
                  <div className="sb-group">
                    <label>Limit</label>
                    <input
                      type="number"
                      className="sb-input"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value, 10) || 10)}
                    />
                  </div>
                  <div className="sb-group">
                    <label>Depth</label>
                    <input
                      type="number"
                      className="sb-input"
                      value={depth}
                      min={0}
                      max={4}
                      onChange={(e) => setDepth(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>WHERE Filters</h3>
                  <button
                    onClick={handleAddClause}
                    className="quick-mark-btn"
                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '5px 12px' }}
                  >
                    + Add Filter
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clauses.map((clause, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 28px',
                        gap: 8,
                        alignItems: 'center',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: 8,
                      }}
                    >
                      <input
                        type="text"
                        className="sb-input"
                        placeholder="Field path"
                        value={clause.field}
                        onChange={(e) => handleUpdateClause(idx, { field: e.target.value })}
                      />
                      <select
                        className="sb-select"
                        value={clause.op}
                        onChange={(e) => handleUpdateClause(idx, { op: e.target.value as WhereClause['op'] })}
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">not_equals</option>
                        <option value="like">like (contains)</option>
                        <option value="in">in (list)</option>
                        <option value="greater_than">greater_than</option>
                        <option value="less_than">less_than</option>
                        <option value="exists">exists</option>
                      </select>
                      <input
                        type="text"
                        className="sb-input"
                        placeholder="Value"
                        value={clause.val}
                        onChange={(e) => handleUpdateClause(idx, { val: e.target.value })}
                      />
                      <button
                        onClick={() => handleRemoveClause(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Generated Code & Mock Response */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="sb-tabs">
                  <button
                    className={`sb-tab ${activeTab === 'local' ? 'active' : ''}`}
                    onClick={() => setActiveTab('local')}
                  >
                    Local API (Next.js RSC)
                  </button>
                  <button
                    className={`sb-tab ${activeTab === 'rest' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rest')}
                  >
                    REST + cURL
                  </button>
                  <button
                    className={`sb-tab ${activeTab === 'graphql' ? 'active' : ''}`}
                    onClick={() => setActiveTab('graphql')}
                  >
                    GraphQL
                  </button>
                  <button
                    className={`sb-tab ${activeTab === 'response' ? 'active' : ''}`}
                    onClick={() => setActiveTab('response')}
                  >
                    Evaluated Result
                  </button>
                </div>
                <button className="t" onClick={handleCopy}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>

              <div className="sb-code-box" style={{ flex: 1, minHeight: 460 }}>
                <pre style={{ margin: 0, padding: 16 }}>
                  <code>
                    {activeTab === 'response'
                      ? JSON.stringify(mockResponse, null, 2)
                      : outputCode}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
