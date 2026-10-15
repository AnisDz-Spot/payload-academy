'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

interface SchemaField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  localized: boolean;
  sidebar: boolean;
  relationTo?: string;
  defaultValue?: string;
  options?: string;
}

const TEMPLATES: Record<string, { slug: string; useAsTitle: string; auth: boolean; upload: boolean; versions: boolean; fields: SchemaField[] }> = {
  blog: {
    slug: 'posts',
    useAsTitle: 'title',
    auth: false,
    upload: false,
    versions: true,
    fields: [
      { id: '1', name: 'title', type: 'text', required: true, unique: false, localized: false, sidebar: false },
      { id: '2', name: 'slug', type: 'text', required: true, unique: true, localized: false, sidebar: true },
      { id: '3', name: 'author', type: 'relationship', relationTo: 'users', required: true, unique: false, localized: false, sidebar: true },
      { id: '4', name: 'coverImage', type: 'upload', relationTo: 'media', required: false, unique: false, localized: false, sidebar: false },
      { id: '5', name: 'excerpt', type: 'textarea', required: false, unique: false, localized: true, sidebar: false },
      { id: '6', name: 'content', type: 'richText', required: false, unique: false, localized: true, sidebar: false },
    ],
  },
  ecommerce: {
    slug: 'products',
    useAsTitle: 'title',
    auth: false,
    upload: false,
    versions: true,
    fields: [
      { id: '1', name: 'title', type: 'text', required: true, unique: false, localized: false, sidebar: false },
      { id: '2', name: 'slug', type: 'text', required: true, unique: true, localized: false, sidebar: true },
      { id: '3', name: 'priceInCents', type: 'number', required: true, unique: false, localized: false, sidebar: false, defaultValue: '1999' },
      { id: '4', name: 'inventoryStock', type: 'number', required: true, unique: false, localized: false, sidebar: true, defaultValue: '100' },
      { id: '5', name: 'category', type: 'relationship', relationTo: 'categories', required: true, unique: false, localized: false, sidebar: true },
      { id: '6', name: 'images', type: 'upload', relationTo: 'media', required: false, unique: false, localized: false, sidebar: false },
    ],
  },
  userAuth: {
    slug: 'users',
    useAsTitle: 'email',
    auth: true,
    upload: false,
    versions: false,
    fields: [
      { id: '1', name: 'firstName', type: 'text', required: true, unique: false, localized: false, sidebar: false },
      { id: '2', name: 'lastName', type: 'text', required: true, unique: false, localized: false, sidebar: false },
      { id: '3', name: 'role', type: 'select', required: true, unique: false, localized: false, sidebar: true, defaultValue: 'editor', options: 'admin, editor, customer' },
      { id: '4', name: 'avatar', type: 'upload', relationTo: 'media', required: false, unique: false, localized: false, sidebar: false },
    ],
  },
};

export default function SchemaBuilderPage() {
  const { toggleTheme } = useAcademy();
  const [slug, setSlug] = useState('posts');
  const [useAsTitle, setUseAsTitle] = useState('title');
  const [auth, setAuth] = useState(false);
  const [upload, setUpload] = useState(false);
  const [versions, setVersions] = useState(true);
  const [activeTab, setActiveTab] = useState<'config' | 'types' | 'preview'>('config');
  const [copied, setCopied] = useState(false);

  const [fields, setFields] = useState<SchemaField[]>(TEMPLATES.blog.fields);

  const handleApplyTemplate = (tplKey: string) => {
    const tpl = TEMPLATES[tplKey];
    if (!tpl) return;
    setSlug(tpl.slug);
    setUseAsTitle(tpl.useAsTitle);
    setAuth(tpl.auth);
    setUpload(tpl.upload);
    setVersions(tpl.versions);
    setFields(tpl.fields);
  };

  const handleAddField = () => {
    const newId = String(Date.now());
    setFields((prev) => [
      ...prev,
      {
        id: newId,
        name: `field_${prev.length + 1}`,
        type: 'text',
        required: false,
        unique: false,
        localized: false,
        sidebar: false,
      },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<SchemaField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // Generate Collection Config TypeScript
  const capSlug = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection';
  let configCode = `import type { CollectionConfig } from 'payload'\n\n`;
  configCode += `export const ${capSlug}: CollectionConfig = {\n`;
  configCode += `  slug: '${slug || 'items'}',\n`;

  if (useAsTitle) {
    configCode += `  admin: {\n    useAsTitle: '${useAsTitle}',\n    defaultColumns: ['${useAsTitle}', 'createdAt'],\n  },\n`;
  }

  if (auth) {
    configCode += `  auth: {\n    tokenExpiration: 7200,\n    maxLoginAttempts: 5,\n  },\n`;
  }

  if (upload) {
    configCode += `  upload: {\n    staticDir: 'media',\n    mimeTypes: ['image/*'],\n    imageSizes: [\n      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },\n      { name: 'card', width: 768 },\n    ],\n  },\n`;
  }

  if (versions) {
    configCode += `  versions: {\n    maxPerDoc: 25,\n    drafts: {\n      autosave: true,\n      schedulePublish: true,\n    },\n  },\n`;
  }

  configCode += `  access: {\n    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),\n    create: ({ req: { user } }) => Boolean(user),\n    update: ({ req: { user } }) => Boolean(user),\n    delete: ({ req: { user } }) => user?.role === 'admin',\n  },\n`;

  configCode += `  fields: [\n`;
  fields.forEach((f) => {
    const props: string[] = [`name: '${f.name || 'field'}'`, `type: '${f.type}'`];
    if (f.required) props.push('required: true');
    if (f.unique) props.push('unique: true, index: true');
    if (f.localized) props.push('localized: true');
    if (f.defaultValue) props.push(`defaultValue: '${f.defaultValue}'`);
    if (f.type === 'relationship') props.push(`relationTo: '${f.relationTo || 'users'}'`);
    if (f.type === 'upload') props.push(`relationTo: 'media'`);
    if (f.type === 'select' && f.options) {
      const opts = f.options.split(',').map((s) => s.trim()).filter(Boolean);
      props.push(`options: ${JSON.stringify(opts)}`);
    }
    if (f.sidebar) props.push(`admin: { position: 'sidebar' }`);
    configCode += `    { ${props.join(', ')} },\n`;
  });
  configCode += `  ],\n};\n`;

  // Generate TypeScript Interface
  let tsTypes = `export interface ${capSlug.replace(/s$/, '')} {\n  id: string;\n`;
  fields.forEach((f) => {
    let t = 'string';
    if (f.type === 'number') t = 'number';
    if (f.type === 'checkbox') t = 'boolean';
    if (f.type === 'json') t = 'Record<string, unknown>';
    if (f.type === 'relationship') t = `${(f.relationTo || 'User').charAt(0).toUpperCase() + (f.relationTo || 'User').slice(1)} | string`;
    if (f.type === 'upload') t = 'Media | string';
    if (f.type === 'richText') t = 'SerializedEditorState';
    tsTypes += `  ${f.name}${f.required ? '' : '?'}: ${t};\n`;
  });
  if (versions) {
    tsTypes += `  _status?: 'draft' | 'published';\n`;
  }
  tsTypes += `  createdAt: string;\n  updatedAt: string;\n}\n`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'types' ? tsTypes : configCode;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([configCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'collection'}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">
            ← Back to Academy
          </Link>
          <div className="logo-small">
            <i>P</i>
            <span>Visual Schema Studio</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/query-simulator" className="t">
              🧪 Query Simulator
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
          <div className="kick">Visual Architect Tool</div>
          <h1>Payload 3.x Schema &amp; Collection Studio</h1>
          <p className="lead">
            Design production collection schemas visually with real-time TypeScript generation, draft states, relations, and an interactive Admin UI preview.
          </p>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>Presets:</span>
            <button className="t" onClick={() => handleApplyTemplate('blog')}>
              📰 Blog &amp; Editorial
            </button>
            <button className="t" onClick={() => handleApplyTemplate('ecommerce')}>
              🛒 E-Commerce Catalog
            </button>
            <button className="t" onClick={() => handleApplyTemplate('userAuth')}>
              👥 Auth &amp; Users
            </button>
          </div>

          <div className="standalone-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 24 }}>
            {/* Left Column: Schema Designer */}
            <div className="panel-card">
              <h2 style={{ marginTop: 0, fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Collection Configuration</span>
                <span className="lesson-meta-chip">{fields.length} Fields</span>
              </h2>

              <div className="sb-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="sb-group">
                    <label>Collection Slug</label>
                    <input
                      type="text"
                      className="sb-input"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="posts"
                    />
                  </div>
                  <div className="sb-group">
                    <label>useAsTitle Field</label>
                    <input
                      type="text"
                      className="sb-input"
                      value={useAsTitle}
                      onChange={(e) => setUseAsTitle(e.target.value)}
                      placeholder="title"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, margin: '14px 0', flexWrap: 'wrap' }}>
                  <label className="sb-check" style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={versions} onChange={(e) => setVersions(e.target.checked)} />
                    <span>Enable Drafts &amp; Versions</span>
                  </label>
                  <label className="sb-check" style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={auth} onChange={(e) => setAuth(e.target.checked)} />
                    <span>Auth Collection</span>
                  </label>
                  <label className="sb-check" style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={upload} onChange={(e) => setUpload(e.target.checked)} />
                    <span>Media Upload Collection</span>
                  </label>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Fields Schema</h3>
                  <button
                    onClick={handleAddField}
                    className="quick-mark-btn"
                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '6px 14px' }}
                  >
                    + Add Field
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 32px', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          className="sb-input"
                          value={field.name}
                          onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                          placeholder="Field name"
                        />
                        <select
                          className="sb-select"
                          value={field.type}
                          onChange={(e) => handleUpdateField(field.id, { type: e.target.value })}
                        >
                          <option value="text">text</option>
                          <option value="textarea">textarea</option>
                          <option value="number">number</option>
                          <option value="richText">richText (Lexical)</option>
                          <option value="relationship">relationship</option>
                          <option value="upload">upload</option>
                          <option value="select">select</option>
                          <option value="checkbox">checkbox</option>
                          <option value="date">date</option>
                          <option value="json">json</option>
                        </select>
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          title="Remove field"
                        >
                          ✕
                        </button>
                      </div>

                      {field.type === 'relationship' && (
                        <input
                          type="text"
                          className="sb-input"
                          placeholder="relationTo (e.g. users, categories)"
                          value={field.relationTo || ''}
                          onChange={(e) => handleUpdateField(field.id, { relationTo: e.target.value })}
                        />
                      )}

                      {field.type === 'select' && (
                        <input
                          type="text"
                          className="sb-input"
                          placeholder="Options (comma-separated: draft, published, archived)"
                          value={field.options || ''}
                          onChange={(e) => handleUpdateField(field.id, { options: e.target.value })}
                        />
                      )}

                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted)', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                          />
                          <span>Required</span>
                        </label>
                        <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={field.unique}
                            onChange={(e) => handleUpdateField(field.id, { unique: e.target.checked })}
                          />
                          <span>Unique &amp; Index</span>
                        </label>
                        <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={field.localized}
                            onChange={(e) => handleUpdateField(field.id, { localized: e.target.checked })}
                          />
                          <span>Localized</span>
                        </label>
                        <label style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={field.sidebar}
                            onChange={(e) => handleUpdateField(field.id, { sidebar: e.target.checked })}
                          />
                          <span>Sidebar Drawer</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Code & Admin UI Preview */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="sb-tabs">
                  <button
                    className={`sb-tab ${activeTab === 'config' ? 'active' : ''}`}
                    onClick={() => setActiveTab('config')}
                  >
                    TypeScript Config
                  </button>
                  <button
                    className={`sb-tab ${activeTab === 'types' ? 'active' : ''}`}
                    onClick={() => setActiveTab('types')}
                  >
                    Types (.d.ts)
                  </button>
                  <button
                    className={`sb-tab ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    Admin UI Preview
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="t" onClick={handleDownload} title="Download .ts file">
                    💾 Export
                  </button>
                  <button className="t" onClick={handleCopy}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'config' && (
                <div className="sb-code-box" style={{ flex: 1, minHeight: 480 }}>
                  <pre style={{ margin: 0, padding: 16 }}>
                    <code>{configCode}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'types' && (
                <div className="sb-code-box" style={{ flex: 1, minHeight: 480 }}>
                  <pre style={{ margin: 0, padding: 16 }}>
                    <code>{tsTypes}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'preview' && (
                <div
                  style={{
                    flex: 1,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 18,
                    minHeight: 480,
                  }}
                >
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>
                        Payload Admin / {capSlug} / Edit Document
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.2rem' }}>New {capSlug.replace(/s$/, '')}</h3>
                    </div>
                    {versions && <span className="status-badge in-progress">Draft</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                    {/* Main Fields Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {fields
                        .filter((f) => !f.sidebar)
                        .map((f) => (
                          <div key={f.id}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
                              {f.name} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                              {f.localized && <span className="role-tag" style={{ marginLeft: 6, fontSize: 10 }}>i18n</span>}
                            </label>
                            {f.type === 'textarea' ? (
                              <textarea className="sb-input" rows={3} placeholder={`Enter ${f.name}...`} readOnly />
                            ) : f.type === 'richText' ? (
                              <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 12, background: 'var(--card)', minHeight: 100, color: 'var(--muted)', fontSize: 13 }}>
                                <i>Lexical WYSIWYG Editor area...</i>
                              </div>
                            ) : f.type === 'upload' ? (
                              <div style={{ border: '2px dashed var(--border)', borderRadius: 6, padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                                📁 Choose or drag asset file
                              </div>
                            ) : (
                              <input type="text" className="sb-input" placeholder={`Enter ${f.name}...`} readOnly />
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Sidebar Inspector Area */}
                    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
                        Document Sidebar
                      </div>
                      {fields
                        .filter((f) => f.sidebar)
                        .map((f) => (
                          <div key={f.id}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                              {f.name} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            <input type="text" className="sb-input" placeholder={`Select ${f.name}...`} readOnly style={{ fontSize: 12 }} />
                          </div>
                        ))}
                      <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                        <button className="quick-mark-btn" style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 0', fontWeight: 700 }}>
                          Save &amp; Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
