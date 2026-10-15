'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
  timestamp: string;
}

const CHEATSHEET = [
  { cmd: 'payload generate:types', desc: 'Compiles TS schema into payload-types.ts' },
  { cmd: 'payload migrate:create add_inventory', desc: 'Creates new timestamped SQL migration' },
  { cmd: 'payload migrate', desc: 'Executes pending DB migrations in transaction' },
  { cmd: 'payload migrate:status', desc: 'Lists applied vs pending migrations' },
  { cmd: 'payload jobs:run', desc: 'Processes queued background tasks' },
  { cmd: 'payload graphql:generate-schema', desc: 'Exports schema.graphql SDL' },
  { cmd: 'npx create-payload-app@latest', desc: 'Interactive project scaffolding wizard' },
  { cmd: 'tsx src/scripts/seed.ts', desc: 'Runs custom standalone seed script' },
  { cmd: 'help', desc: 'Displays all available terminal commands' },
  { cmd: 'clear', desc: 'Clears the terminal screen' },
];

export default function TerminalSimulatorPage() {
  const { toggleTheme } = useAcademy();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [interactiveWizardStep, setInteractiveWizardStep] = useState<number | null>(null);
  const [wizardAnswers, setWizardAnswers] = useState<{ project?: string; template?: string; db?: string }>({});

  const [logs, setLogs] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: 'system:init',
      output: '⚡ Payload 3.x Virtual Terminal Emulator [v3.24.0]\nType "help" to view available CLI commands, or click any command in the quick-run sidebar.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isRunning, interactiveWizardStep]);

  const executeCommand = async (cmdToRun: string) => {
    const rawCmd = cmdToRun.trim();
    if (!rawCmd) return;

    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
    setInput('');

    // Handle clear
    if (rawCmd === 'clear') {
      setLogs([]);
      return;
    }

    setIsRunning(true);

    // Interactive Scaffolding Wizard
    if (rawCmd === 'npx create-payload-app@latest' || rawCmd === 'npx create-payload-app') {
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          command: rawCmd,
          output: '📦 Initializing create-payload-app wizard...',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsRunning(false);
      setInteractiveWizardStep(1);
      return;
    }

    let output = '';
    let isError = false;

    if (rawCmd === 'help') {
      output = `Payload 3.x CLI Developer Reference:
  payload generate:types          - Compiles schema into payload-types.ts
  payload generate:importmap      - Scans custom components for admin bundler
  payload migrate:create <name>   - Diffs schema and creates SQL migration
  payload migrate                 - Applies unapplied migrations in transaction
  payload migrate:down            - Rolls back last executed migration batch
  payload migrate:status          - Displays database migration ledger
  payload jobs:run                - Triggers immediate execution of queued tasks
  payload graphql:generate-schema - Exports GraphQL SDL schema to disk
  npx create-payload-app@latest   - Launches interactive scaffolding wizard
  tsx src/scripts/seed.ts         - Executes programmatic Local API seed script
  clear                           - Clears console window`;
    } else if (rawCmd.startsWith('payload generate:types')) {
      await new Promise((r) => setTimeout(r, 600));
      output = `> payload generate:types
[14:20:01] 🔍 Scanning collections: [users, posts, media, categories, orders]
[14:20:01] 🔍 Scanning globals: [header, site-settings]
[14:20:02] ⚙️  Compiling TypeScript AST with strict relational types...
[14:20:02] ✨ Successfully written 542 lines to src/payload-types.ts (14.2 KB)
[14:20:02] ✅ Type generation completed in 842ms. Zero errors.`;
    } else if (rawCmd.startsWith('payload migrate:create')) {
      const parts = rawCmd.split(' ');
      const name = parts[2] || 'custom_migration';
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '_').slice(0, 15);
      await new Promise((r) => setTimeout(r, 700));
      output = `> payload migrate:create ${name}
[14:20:05] 📡 Connecting to PostgreSQL (Drizzle adapter)...
[14:20:05] 🔎 Analyzing schema diff against public database tables...
[14:20:06] 📝 Created migration file:
   └── src/migrations/${timestamp}_${name}.ts
[14:20:06] ✅ Migration template ready. Run "payload migrate" to execute.`;
    } else if (rawCmd === 'payload migrate') {
      await new Promise((r) => setTimeout(r, 900));
      output = `> payload migrate
[14:20:10] 🔒 Starting ACID database transaction...
[14:20:10] 🚀 Executing: 20260401_add_inventory_stock.ts
   ├── ALTER TABLE "products" ADD COLUMN "inventory_stock" integer DEFAULT 0 NOT NULL;
   └── CREATE INDEX "idx_products_inventory" ON "products" ("inventory_stock");
[14:20:11] 💾 Committing transaction...
[14:20:11] ✅ 1 migration executed successfully (took 184ms). Database is up to date.`;
    } else if (rawCmd === 'payload migrate:status') {
      output = `> payload migrate:status
Status     Migration Name                            Executed At
-------------------------------------------------------------------------------
[APPLIED]  20260110_100000_initial_schema.ts          2026-01-10 10:00:04 UTC
[APPLIED]  20260215_143000_add_categories.ts         2026-02-15 14:30:11 UTC
[APPLIED]  20260320_091500_auth_rbac_roles.ts        2026-03-20 09:15:22 UTC
[PENDING]  20260401_180000_add_vector_embeddings.ts  --
-------------------------------------------------------------------------------
Total: 3 Applied, 1 Pending`;
    } else if (rawCmd === 'payload jobs:run') {
      await new Promise((r) => setTimeout(r, 800));
      output = `> payload jobs:run
[14:20:15] 🔄 Worker queue initialized (concurrency: 5)
[14:20:15] ⏳ Processing job #401: generateAiSummary (Post ID: post_102)...
[14:20:16] ⏳ Processing job #402: syncStripeCustomers...
[14:20:16] ✅ Job #401 completed in 1.2s -> { status: 'success', tokens: 412 }
[14:20:17] ✅ Job #402 completed in 840ms -> { synced: 14 }
[14:20:17] 💤 All 2 queued jobs executed successfully. Queue is idle.`;
    } else if (rawCmd.startsWith('tsx') || rawCmd.includes('seed')) {
      await new Promise((r) => setTimeout(r, 700));
      output = `> tsx src/scripts/seed.ts
🌱 Initializing Payload in standalone script context...
📦 Connected to PostgreSQL (sslmode: require)
🗑️  Purging demo fixtures...
✅ Created 4 categories (Technology, Design, Infrastructure, Tutorials)
✅ Created 15 published articles with Lexical rich text AST
👤 Created root administrator: admin@payloadcms.internal
🎉 Database seed complete! Terminating process.`;
    } else if (rawCmd === 'payload graphql:generate-schema') {
      await new Promise((r) => setTimeout(r, 500));
      output = `> payload graphql:generate-schema
[14:20:20] 🌐 Building GraphQL Schema SDL from collections and globals...
[14:20:20] ✨ Generated schema.graphql (2,184 lines)
[14:20:20] 💡 Ready for GraphQL Code Generator or Apollo Client tooling.`;
    } else {
      isError = true;
      output = `zsh: command not found: ${rawCmd}\nType "help" to see available Payload CLI commands.`;
    }

    setIsRunning(false);
    setLogs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        command: rawCmd,
        output,
        isError,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx] || '');
        }
      }
    }
  };

  const handleWizardChoice = (val: string) => {
    if (interactiveWizardStep === 1) {
      setWizardAnswers((p) => ({ ...p, project: val }));
      setInteractiveWizardStep(2);
    } else if (interactiveWizardStep === 2) {
      setWizardAnswers((p) => ({ ...p, template: val }));
      setInteractiveWizardStep(3);
    } else if (interactiveWizardStep === 3) {
      setWizardAnswers((p) => ({ ...p, db: val }));
      setInteractiveWizardStep(null);
      // Finalize creation
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          command: 'npx create-payload-app (summary)',
          output: `✨ Project "${wizardAnswers.project || 'my-app'}" scaffolded successfully!
  • Template: ${wizardAnswers.template || 'blank'}
  • Database: ${val} (Drizzle ORM)
  • Next.js: 15.1 (App Router + React Server Components)

Next steps:
  cd ${wizardAnswers.project || 'my-app'}
  cp .env.example .env
  pnpm dev

🚀 Admin panel will be running at http://localhost:3000/admin`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
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
            <span>Payload CLI Workbench</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/schema-builder" className="t">
              ⚙️ Schema Studio
            </Link>
            <Link href="/query-simulator" className="t">
              🧪 Query Simulator
            </Link>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1280 }}>
          <div className="kick">Simulated Environment</div>
          <h1>Payload 3.x CLI &amp; Terminal Workbench</h1>
          <p className="lead">
            Practice running migrations, generating TypeScript types, executing seed scripts, and background worker queues in an interactive shell.
          </p>

          <div className="standalone-grid" style={{ gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Terminal Window */}
            <div
              style={{
                background: '#0a0d14',
                border: '1px solid #1e293b',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 560,
              }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Terminal Top Window Bar */}
              <div
                style={{
                  background: '#111827',
                  borderBottom: '1px solid #1f2937',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
                  <span style={{ marginLeft: 12, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8' }}>
                    bash — payload-academy@sandbox: ~/my-project
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogs([]);
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid #374151',
                    color: '#9ca3af',
                    fontSize: 11,
                    borderRadius: 4,
                    padding: '2px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Console
                </button>
              </div>

              {/* Terminal Scroll Content */}
              <div
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                  overflowY: 'auto',
                }}
              >
                {logs.map((item) => (
                  <div key={item.id} style={{ marginBottom: 16 }}>
                    {item.command !== 'system:init' && (
                      <div style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', gap: 8 }}>
                        <span style={{ color: '#10b981' }}>➜</span>
                        <span>~/my-project</span>
                        <span style={{ color: '#e2e8f0' }}>$ {item.command}</span>
                      </div>
                    )}
                    <pre
                      style={{
                        margin: '4px 0 0 0',
                        padding: 0,
                        background: 'transparent',
                        color: item.isError ? '#f87171' : '#cbd5e1',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                      }}
                    >
                      {item.output}
                    </pre>
                  </div>
                ))}

                {/* Interactive Scaffolding Step Prompts */}
                {interactiveWizardStep === 1 && (
                  <div style={{ background: '#1e293b44', border: '1px solid #334155', padding: 14, borderRadius: 8, margin: '12px 0' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>
                      ? What is your project name? (Press a preset below)
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="t" onClick={() => handleWizardChoice('my-payload-cms')}>
                        my-payload-cms
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('acme-enterprise-blog')}>
                        acme-enterprise-blog
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('ecommerce-store')}>
                        ecommerce-store
                      </button>
                    </div>
                  </div>
                )}

                {interactiveWizardStep === 2 && (
                  <div style={{ background: '#1e293b44', border: '1px solid #334155', padding: 14, borderRadius: 8, margin: '12px 0' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>
                      ? Choose a project template:
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="t" onClick={() => handleWizardChoice('blank')}>
                        📦 blank (Minimal config)
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('website')}>
                        📰 website (Full marketing site with blocks)
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('ecommerce')}>
                        🛒 ecommerce (Products + Cart + Stripe)
                      </button>
                    </div>
                  </div>
                )}

                {interactiveWizardStep === 3 && (
                  <div style={{ background: '#1e293b44', border: '1px solid #334155', padding: 14, borderRadius: 8, margin: '12px 0' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>
                      ? Select a database adapter:
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="t" onClick={() => handleWizardChoice('PostgreSQL (Drizzle)')}>
                        🐘 PostgreSQL (Recommended for production)
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('SQLite (Drizzle)')}>
                        ⚡ SQLite (Lightweight &amp; Edge friendly)
                      </button>
                      <button className="t" onClick={() => handleWizardChoice('MongoDB (Mongoose)')}>
                        🍃 MongoDB
                      </button>
                    </div>
                  </div>
                )}

                {isRunning && (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Executing command...
                  </div>
                )}

                {/* Live Input Line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ color: '#10b981' }}>➜</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>~/my-project</span>
                  <span style={{ color: '#94a3b8' }}>$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isRunning || interactiveWizardStep !== null}
                    autoFocus
                    spellCheck={false}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f8fafc',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      padding: 0,
                    }}
                    placeholder="Type command here (e.g. payload generate:types)..."
                  />
                </div>
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Right Sidebar: One-Click Quick Run & Cheatsheet */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span> Quick Run Commands
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px 0' }}>
                Click any command below to execute it immediately in the terminal simulator:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
                {CHEATSHEET.map((item) => (
                  <button
                    key={item.cmd}
                    onClick={() => executeCommand(item.cmd)}
                    style={{
                      textAlign: 'left',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:border-accent"
                  >
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      $ {item.cmd}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
