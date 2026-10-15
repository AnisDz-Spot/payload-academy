'use client'
import React, { useState } from 'react';
import { useAcademy } from '@/context/AcademyContext';

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  localized: boolean;
  sidebar: boolean;
  relationTo?: string;
}

export const SchemaBuilderModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAcademy();
  const isOpen = activeModal === 'schema';

  const [slug, setSlug] = useState('posts');
  const [useAsTitle, setUseAsTitle] = useState('title');
  const [versions, setVersions] = useState(true);
  const [autosave, setAutosave] = useState(true);
  const [auth, setAuth] = useState(false);
  const [upload, setUpload] = useState(false);
  const [copied, setCopied] = useState(false);

  const [fields, setFields] = useState<SchemaField[]>([
    { name: 'title', type: 'text', required: true, unique: false, localized: false, sidebar: false },
    { name: 'slug', type: 'text', required: true, unique: true, localized: false, sidebar: true },
    { name: 'content', type: 'richText', required: false, unique: false, localized: true, sidebar: false },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true, unique: false, localized: false, sidebar: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: false, unique: false, localized: false, sidebar: false },
  ]);

  if (!isOpen) return null;

  const handleAddField = () => {
    setFields(prev => [
      ...prev,
      {
        name: 'field' + (prev.length + 1),
        type: 'text',
        required: false,
        unique: false,
        localized: false,
        sidebar: false,
      },
    ]);
  };

  const handleRemoveField = (idx: number) => {
    setFields(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateField = (idx: number, updates: Partial<SchemaField>) => {
    setFields(prev => prev.map((f, i) => (i === idx ? { ...f, ...updates } : f)));
  };

  const capitalized = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection';
  let generatedCode = `import type { CollectionConfig } from 'payload'\n\n`;
  generatedCode += `export const ${capitalized}: CollectionConfig = {\n`;
  generatedCode += `  slug: '${slug || 'items'}',\n`;

  if (useAsTitle) {
    generatedCode += `  admin: {\n    useAsTitle: '${useAsTitle}',\n    defaultColumns: ['${useAsTitle}', 'createdAt'],\n  },\n`;
  }

  if (auth) {
    generatedCode += `  auth: true,\n`;
  }

  if (upload) {
    generatedCode += `  upload: {\n    staticDir: 'media',\n    imageSizes: [\n      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },\n      { name: 'card', width: 768 },\n    ],\n  },\n`;
  }

  if (versions) {
    generatedCode += `  versions: {\n    maxPerDoc: 25,\n`;
    if (autosave) {
      generatedCode += `    drafts: { autosave: true },\n`;
    } else {
      generatedCode += `    drafts: true,\n`;
    }
    generatedCode += `  },\n`;
  }

  generatedCode += `  fields: [\n`;
  fields.forEach(f => {
    const parts = [`name: '${f.name || 'field'}'`, `type: '${f.type}'`];
    if (f.required) parts.push('required: true');
    if (f.unique) parts.push('unique: true, index: true');
    if (f.localized) parts.push('localized: true');
    if (f.type === 'relationship') parts.push(`relationTo: '${f.relationTo || 'users'}'`);
    if (f.type === 'upload') parts.push(`relationTo: 'media'`);
    if (f.type === 'join') parts.push(`collection: 'posts', on: 'category'`);
    if (f.sidebar) parts.push(`admin: { position: 'sidebar' }`);
    generatedCode += `    { ${parts.join(', ')} },\n`;
  });
  generatedCode += `  ],\n};\n`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal('none'); }}>
      <div className="modal">
        <div className="modal-head">
          <h2>⚙️ Payload 3.x Schema Builder</h2>
          <button className="modal-close" onClick={() => setActiveModal('none')}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="sb-form">
            <div className="sb-group">
              <label>Collection Slug</label>
              <input
                type="text"
                className="sb-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. posts, products"
              />
            </div>
            <div className="sb-group">
              <label>Admin Title Field</label>
              <input
                type="text"
                className="sb-input"
                value={useAsTitle}
                onChange={(e) => setUseAsTitle(e.target.value)}
                placeholder="Field used as title"
              />
            </div>
            <div className="sb-toggles">
              <label className="sb-toggle">
                <input type="checkbox" checked={versions} onChange={(e) => setVersions(e.target.checked)} />
                Enable Drafts &amp; Versions
              </label>
              <label className="sb-toggle">
                <input type="checkbox" checked={autosave} onChange={(e) => setAutosave(e.target.checked)} />
                Autosave Drafts
              </label>
              <label className="sb-toggle">
                <input type="checkbox" checked={auth} onChange={(e) => setAuth(e.target.checked)} />
                Auth Collection
              </label>
              <label className="sb-toggle">
                <input type="checkbox" checked={upload} onChange={(e) => setUpload(e.target.checked)} />
                Upload Collection
              </label>
            </div>

            <div className="sb-fields-head">
              <b>Schema Fields</b>
              <button className="sb-btn" onClick={handleAddField}>+ Add Field</button>
            </div>

            <div className="sb-fields-list">
              {fields.map((f, idx) => (
                <div key={idx} className="sb-field-card">
                  <div className="sb-fc-row">
                    <input
                      type="text"
                      value={f.name}
                      placeholder="Field name"
                      onChange={(e) => handleUpdateField(idx, { name: e.target.value })}
                    />
                    <select
                      value={f.type}
                      onChange={(e) => handleUpdateField(idx, { type: e.target.value })}
                    >
                      <option value="text">text</option>
                      <option value="textarea">textarea</option>
                      <option value="number">number</option>
                      <option value="richText">richText</option>
                      <option value="relationship">relationship</option>
                      <option value="upload">upload</option>
                      <option value="select">select</option>
                      <option value="checkbox">checkbox</option>
                      <option value="date">date</option>
                      <option value="json">json</option>
                      <option value="join">join</option>
                    </select>
                    <button
                      className="sb-del-btn"
                      onClick={() => handleRemoveField(idx)}
                      title="Delete Field"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="sb-fc-opts">
                    <label>
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => handleUpdateField(idx, { required: e.target.checked })}
                      />
                      Required
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={f.unique}
                        onChange={(e) => handleUpdateField(idx, { unique: e.target.checked })}
                      />
                      Unique
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={f.localized}
                        onChange={(e) => handleUpdateField(idx, { localized: e.target.checked })}
                      />
                      Localized
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={f.sidebar}
                        onChange={(e) => handleUpdateField(idx, { sidebar: e.target.checked })}
                      />
                      Sidebar
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sb-preview">
            <div className="sb-preview-head">
              <b>Generated CollectionConfig</b>
              <button className="sb-btn sec" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Copy TypeScript'}
              </button>
            </div>
            <div className="sb-code-box">
              <pre><code>{generatedCode}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
