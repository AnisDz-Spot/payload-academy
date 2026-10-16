'use client'
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

// Lexical node representations
interface LexicalTextNode {
  type: 'text';
  text: string;
  format: number; // 0=normal, 1=bold, 2=italic, 8=code, 9=bold+code
  style?: string;
  version: 1;
}

interface LexicalLinkNode {
  type: 'link';
  url: string;
  target?: string;
  children: LexicalTextNode[];
  version: 1;
}

interface LexicalHeadingNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3';
  direction: 'ltr' | 'rtl';
  format: string;
  indent: number;
  version: 1;
  children: (LexicalTextNode | LexicalLinkNode)[];
}

interface LexicalParagraphNode {
  type: 'paragraph';
  direction: 'ltr' | 'rtl';
  format: string;
  indent: number;
  version: 1;
  children: (LexicalTextNode | LexicalLinkNode)[];
}

interface LexicalListNode {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  tag: 'ul' | 'ol';
  start: number;
  direction: 'ltr';
  children: {
    type: 'listitem';
    value: number;
    children: (LexicalTextNode | LexicalLinkNode)[];
    version: 1;
  }[];
  version: 1;
}

interface LexicalBlockNode {
  type: 'block';
  fields: {
    id: string;
    blockType: 'callout' | 'codeBlock' | 'banner' | 'mediaGrid';
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  version: 1;
}

type LexicalNode = LexicalHeadingNode | LexicalParagraphNode | LexicalListNode | LexicalBlockNode;

interface LexicalRoot {
  root: {
    type: 'root';
    format: string;
    indent: number;
    version: 1;
    direction: 'ltr';
    children: LexicalNode[];
  };
}

const PRESETS: Record<string, { label: string; description: string; data: LexicalRoot }> = {
  blog: {
    label: '📰 Blog Article with Callout',
    description: 'Heading, rich paragraphs, links, and custom Alert Callout block.',
    data: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [{ type: 'text', text: 'Mastering Payload 3.x Lexical RichText', format: 1, version: 1 }],
          },
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'text', text: 'Payload 3.x replaces Slate with ', format: 0, version: 1 },
              { type: 'text', text: 'Lexical', format: 1, version: 1 },
              { type: 'text', text: ', offering a blazing fast AST schema built for ', format: 0, version: 1 },
              { type: 'link', url: 'https://nextjs.org', target: '_blank', version: 1, children: [{ type: 'text', text: 'Next.js 16 Server Components', format: 0, version: 1 }] },
              { type: 'text', text: '.', format: 0, version: 1 },
            ],
          },
          {
            type: 'block',
            version: 1,
            fields: {
              id: 'callout_node_99',
              blockType: 'callout',
              theme: 'warning',
              title: 'Server Component Requirement',
              message: 'Always use @payloadcms/richtext-lexical/react to render AST safely in React Server Components without HTML injection.',
            },
          },
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'text', text: 'Custom blocks enable embedding dynamic interactive widgets directly within editorial copy without splitting documents into separate entities.', format: 0, version: 1 },
            ],
          },
        ],
      },
    },
  },
  docs: {
    label: '💻 Technical Docs with CodeBlock',
    description: 'Documentation page with TypeScript code block and bullet list.',
    data: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [{ type: 'text', text: 'Configuring Lexical in payload.config.ts', format: 0, version: 1 }],
          },
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'text', text: 'Import ', format: 0, version: 1 },
              { type: 'text', text: 'lexicalEditor', format: 8, version: 1 },
              { type: 'text', text: ' and pass feature sets directly into your collection schema:', format: 0, version: 1 },
            ],
          },
          {
            type: 'block',
            version: 1,
            fields: {
              id: 'code_node_01',
              blockType: 'codeBlock',
              language: 'typescript',
              filename: 'src/collections/Posts.ts',
              code: `import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'\nimport { CalloutBlock } from '../blocks/Callout'\n\nexport const Posts = {\n  slug: 'posts',\n  fields: [\n    {\n      name: 'content',\n      type: 'richText',\n      editor: lexicalEditor({\n        features: ({ defaultFeatures }) => [\n          ...defaultFeatures,\n          BlocksFeature({ blocks: [CalloutBlock] }),\n        ],\n      }),\n    },\n  ],\n}`,
            },
          },
          {
            type: 'list',
            listType: 'bullet',
            tag: 'ul',
            start: 1,
            direction: 'ltr',
            version: 1,
            children: [
              {
                type: 'listitem',
                value: 1,
                version: 1,
                children: [{ type: 'text', text: '100% type-safe JSON tree AST', format: 1, version: 1 }],
              },
              {
                type: 'listitem',
                value: 2,
                version: 1,
                children: [{ type: 'text', text: 'Zero DOMPurify overhead on the server', format: 0, version: 1 }],
              },
              {
                type: 'listitem',
                value: 3,
                version: 1,
                children: [{ type: 'text', text: 'Native relationship population inside blocks', format: 0, version: 1 }],
              },
            ],
          },
        ],
      },
    },
  },
  marketing: {
    label: '✨ Marketing Landing Page',
    description: 'Hero title, interactive banner, and media callout.',
    data: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [{ type: 'text', text: 'Build Faster with Payload CMS', format: 1, version: 1 }],
          },
          {
            type: 'block',
            version: 1,
            fields: {
              id: 'banner_promo_42',
              blockType: 'banner',
              heading: 'Payload 3.0 is Officially Next.js Native',
              subheading: 'No separate Express server. Instant deployment on Vercel, Cloudflare & Docker.',
              ctaText: 'Deploy Starter Now',
              ctaUrl: 'https://github.com/payloadcms/payload',
            },
          },
          {
            type: 'paragraph',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'text', text: 'With native TypeScript support and Drizzle ORM power, developers ship full-stack web applications in record time.', format: 0, version: 1 },
            ],
          },
        ],
      },
    },
  },
};

export default function LexicalInspectorPage() {
  const { toggleTheme } = useAcademy();

  const [activePreset, setActivePreset] = useState<string>('blog');
  const [astData, setAstData] = useState<LexicalRoot>(PRESETS.blog.data);
  const [activeTab, setActiveTab] = useState<'ast' | 'jsx' | 'config'>('ast');
  const [copied, setCopied] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  // Quick insertion helpers
  const addHeading = (tag: 'h1' | 'h2' | 'h3') => {
    const newHeading: LexicalHeadingNode = {
      type: 'heading',
      tag,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [{ type: 'text', text: `New ${tag.toUpperCase()} Heading Section`, format: 1, version: 1 }],
    };
    setAstData(prev => ({
      root: { ...prev.root, children: [...prev.root.children, newHeading] },
    }));
  };

  const addParagraph = () => {
    const newPara: LexicalParagraphNode = {
      type: 'paragraph',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [{ type: 'text', text: 'New rich text paragraph with embedded Lexical styling.', format: 0, version: 1 }],
    };
    setAstData(prev => ({
      root: { ...prev.root, children: [...prev.root.children, newPara] },
    }));
  };

  const addCalloutBlock = () => {
    const newBlock: LexicalBlockNode = {
      type: 'block',
      version: 1,
      fields: {
        id: `callout_${Date.now()}`,
        blockType: 'callout',
        theme: 'info',
        title: 'Pro Tip',
        message: 'Lexical allows custom React blocks to render seamlessly within the flow of text.',
      },
    };
    setAstData(prev => ({
      root: { ...prev.root, children: [...prev.root.children, newBlock] },
    }));
  };

  const addCodeBlock = () => {
    const newCode: LexicalBlockNode = {
      type: 'block',
      version: 1,
      fields: {
        id: `code_${Date.now()}`,
        blockType: 'codeBlock',
        language: 'typescript',
        filename: 'src/app/page.tsx',
        code: `export default async function Page() {\n  const payload = await getPayload({ config })\n  const post = await payload.findGlobal({ slug: 'settings' })\n  return <RichText data={post.content} />\n}`,
      },
    };
    setAstData(prev => ({
      root: { ...prev.root, children: [...prev.root.children, newCode] },
    }));
  };

  const removeNode = (idx: number) => {
    setAstData(prev => ({
      root: { ...prev.root, children: prev.root.children.filter((_, i) => i !== idx) },
    }));
    if (selectedNodeIndex === idx) setSelectedNodeIndex(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonString = useMemo(() => {
    return JSON.stringify(astData, null, 2);
  }, [astData]);

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>📜</i>
            <span>Interactive Lexical AST Rich Text Inspector</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/dashboard" className="t">📊 Dashboard</Link>
            <Link href="/schema-builder" className="t">⚙️ Schema Studio</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1280 }}>
          {/* Top Hero Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div className="kick">Payload 3.x Rich Text Architecture</div>
              <h1 style={{ margin: '4px 0 8px' }}>Lexical AST Inspector &amp; React Serializer</h1>
              <p className="lead" style={{ margin: 0, maxWidth: 840 }}>
                Explore how Payload 3.x transforms rich content into a type-safe Abstract Syntax Tree (AST), inspect node hierarchies, and preview React Server Component serialization.
                <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
                  🧪 Simulated AST — node data is illustrative of Payload&apos;s Lexical schema rather than parsed live from your editor.
                </span>
              </p>
            </div>

            {/* Presets Bar */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => { setActivePreset(key); setAstData(p.data); setSelectedNodeIndex(null); }}
                  className="chip"
                  style={{
                    background: activePreset === key ? 'var(--accent)' : 'var(--card)',
                    color: activePreset === key ? '#fff' : 'var(--text)',
                    borderColor: activePreset === key ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Split Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', gap: 20, alignItems: 'start' }}>
            {/* ═══════════ LEFT: VISUAL NODE BUILDER & PREVIEW ═══════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Insertion Toolbar */}
              <div className="dash-section-card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Insert Lexical Nodes into AST
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => addHeading('h1')} className="chip" style={{ fontSize: 11 }}>+ H1 Heading</button>
                  <button onClick={() => addHeading('h2')} className="chip" style={{ fontSize: 11 }}>+ H2 Heading</button>
                  <button onClick={addParagraph} className="chip" style={{ fontSize: 11 }}>+ Paragraph</button>
                  <button onClick={addCalloutBlock} className="chip" style={{ fontSize: 11, background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>+ Callout Block</button>
                  <button onClick={addCodeBlock} className="chip" style={{ fontSize: 11, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+ Code Snippet</button>
                </div>
              </div>

              {/* Visual Node Flow */}
              <div className="dash-section-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    Visual Content Document Flow ({astData.root.children.length} Nodes)
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>Click to highlight in AST</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {astData.root.children.map((node, idx) => {
                    const isSelected = selectedNodeIndex === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedNodeIndex(idx)}
                        style={{
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        }}
                      >
                        {/* Header chip */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: node.type === 'heading' ? 'rgba(59, 130, 246, 0.2)' : node.type === 'block' ? 'rgba(234, 179, 8, 0.2)' : node.type === 'list' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                              color: node.type === 'heading' ? 'var(--accent)' : node.type === 'block' ? '#eab308' : node.type === 'list' ? '#10b981' : 'var(--text)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {node.type === 'heading' ? `Heading (${node.tag})` : node.type === 'block' ? `Custom Block: ${node.fields.blockType}` : node.type}
                          </span>

                          <button
                            onClick={(e) => { e.stopPropagation(); removeNode(idx); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }}
                            title="Remove node"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Node Content Preview */}
                        {node.type === 'heading' && (
                          <div style={{ fontSize: node.tag === 'h1' ? 18 : node.tag === 'h2' ? 16 : 14, fontWeight: 700, color: 'var(--text)' }}>
                            {node.children.map((c, i) => (
                              <span key={i}>{c.type === 'text' ? c.text : c.children?.[0]?.text || ''}</span>
                            ))}
                          </div>
                        )}

                        {node.type === 'paragraph' && (
                          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                            {node.children.map((c, i) => {
                              if (c.type === 'link') {
                                return <a key={i} href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{c.children?.[0]?.text}</a>;
                              }
                              return (
                                <span key={i} style={{ fontWeight: c.format === 1 || c.format === 9 ? 700 : 400, fontStyle: c.format === 2 ? 'italic' : 'normal', fontFamily: c.format === 8 || c.format === 9 ? 'var(--font-mono)' : 'inherit', background: c.format === 8 || c.format === 9 ? 'rgba(255,255,255,0.1)' : 'transparent', padding: c.format === 8 || c.format === 9 ? '1px 4px' : 0, borderRadius: 3 }}>
                                  {c.text}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {node.type === 'list' && (
                          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                            {node.children.map((item, i) => (
                              <li key={i} style={{ margin: '3px 0' }}>
                                {item.children.map((c, ci) => (
                                  <span key={ci} style={{ fontWeight: c.type === 'text' && (c.format === 1 || c.format === 9) ? 700 : 400 }}>
                                    {c.type === 'text' ? c.text : c.children?.[0]?.text || ''}
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        )}

                        {node.type === 'block' && node.fields.blockType === 'callout' && (
                          <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontSize: 12 }}>
                            <div style={{ fontWeight: 700 }}>⚠️ {node.fields.title}</div>
                            <div style={{ marginTop: 2, color: 'var(--text)' }}>{node.fields.message}</div>
                          </div>
                        )}

                        {node.type === 'block' && node.fields.blockType === 'codeBlock' && (
                          <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                            <div style={{ color: 'var(--muted)', marginBottom: 4 }}>📄 {node.fields.filename}</div>
                            <pre style={{ margin: 0, color: '#38bdf8', overflowX: 'auto' }}>{node.fields.code}</pre>
                          </div>
                        )}

                        {node.type === 'block' && node.fields.blockType === 'banner' && (
                          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(59,130,246,0.3)' }}>
                            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{node.fields.heading}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{node.fields.subheading}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ═══════════ RIGHT: AST INSPECTOR & REACT SERIALIZER TABS ═══════════ */}
            <div className="dash-section-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Tab Selector Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setActiveTab('ast')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: activeTab === 'ast' ? 'var(--accent)' : 'transparent',
                      color: activeTab === 'ast' ? '#fff' : 'var(--text)',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    🌳 Lexical AST JSON ({astData.root.children.length} Nodes)
                  </button>
                  <button
                    onClick={() => setActiveTab('jsx')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: activeTab === 'jsx' ? 'var(--accent)' : 'transparent',
                      color: activeTab === 'jsx' ? '#fff' : 'var(--text)',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    ⚛️ React JSX Serializer Output
                  </button>
                  <button
                    onClick={() => setActiveTab('config')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: activeTab === 'config' ? 'var(--accent)' : 'transparent',
                      color: activeTab === 'config' ? '#fff' : 'var(--text)',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    ⚙️ Field Config &amp; Feature Schema
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(jsonString)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy AST JSON'}
                </button>
              </div>

              {/* Tab 1: AST JSON */}
              {activeTab === 'ast' && (
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    Payload 3.x stores rich text as pure JSON Abstract Syntax Trees in PostgreSQL/MongoDB JSONB columns.
                  </div>
                  <pre style={{ margin: 0, padding: 14, background: 'rgba(0,0,0,0.35)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', maxHeight: 580, overflowY: 'auto' }}>
                    {jsonString}
                  </pre>
                </div>
              )}

              {/* Tab 2: React Serializer */}
              {activeTab === 'jsx' && (
                <div style={{ padding: 16 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                      React Server Component Code:
                    </div>
                    <pre style={{ margin: '8px 0 16px', padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>
{`import { RichText } from '@payloadcms/richtext-lexical/react'
import { CustomCallout } from '@/components/blocks/CustomCallout'
import { CustomCodeBlock } from '@/components/blocks/CustomCodeBlock'

// Zero client javascript needed — 100% server serialized!
export default function BlogPost({ post }) {
  return (
    <article className="prose">
      <RichText
        data={post.content}
        converters={{
          callout: ({ node }) => <CustomCallout {...node.fields} />,
          codeBlock: ({ node }) => <CustomCodeBlock {...node.fields} />,
        }}
      />
    </article>
  )
}`}
                    </pre>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Rendered Semantic HTML Output Preview
                    </div>
                    <div style={{ padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      {astData.root.children.map((node, i) => {
                        if (node.type === 'heading') {
                          const Tag = node.tag;
                          return (
                            <Tag key={i} style={{ margin: '0.8em 0 0.4em', color: 'var(--text)' }}>
                              {node.children.map((c, ci) => (
                                <span key={ci}>{c.type === 'text' ? c.text : c.children?.[0]?.text || ''}</span>
                              ))}
                            </Tag>
                          );
                        }
                        if (node.type === 'paragraph') {
                          return (
                            <p key={i} style={{ margin: '0.6em 0', lineHeight: 1.6, color: 'var(--text)' }}>
                              {node.children.map((c, ci) => {
                                if (c.type === 'link') {
                                  return <a key={ci} href={c.url} style={{ color: 'var(--accent)' }}>{c.children?.[0]?.text}</a>;
                                }
                                return (
                                  <span key={ci} style={{ fontWeight: c.format === 1 || c.format === 9 ? 700 : 400, fontStyle: c.format === 2 ? 'italic' : 'normal' }}>
                                    {c.text}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        }
                        if (node.type === 'block') {
                          return (
                            <div key={i} style={{ margin: '14px 0', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 6, borderLeft: '4px solid var(--accent)' }}>
                              <strong style={{ fontSize: 12, color: 'var(--accent)' }}>Block: {node.fields.blockType}</strong>
                              <div style={{ fontSize: 13, marginTop: 4 }}>{JSON.stringify(node.fields)}</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Config */}
              {activeTab === 'config' && (
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                    Payload 3.x Collection Lexical Configuration
                  </div>
                  <pre style={{ margin: 0, padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
{`import { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  LinkFeature,
  UploadFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const Articles: CollectionConfig = {
  slug: 'articles',
  fields: [
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures, rootFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          LinkFeature({
            fields: [
              {
                name: 'rel',
                type: 'select',
                options: ['nofollow', 'noopener'],
              },
            ],
          }),
          BlocksFeature({
            blocks: [
              {
                slug: 'callout',
                fields: [
                  { name: 'theme', type: 'select', options: ['info', 'warning', 'success'] },
                  { name: 'title', type: 'text', required: true },
                  { name: 'message', type: 'textarea', required: true },
                ],
              },
            ],
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
