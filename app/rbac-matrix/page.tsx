'use client'
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

type UserRole = 'admin' | 'editor' | 'author' | 'customer' | 'guest';
type CrudAction = 'read' | 'create' | 'update' | 'delete' | 'admin';

interface CollectionAccessConfig {
  collection: string;
  description: string;
  icon: string;
  roles: Record<UserRole, Record<CrudAction, {
    allowed: boolean | 'conditional';
    description: string;
    conditionCode?: string;
    sqlFilter?: string;
  }>>;
}

const MATRIX_COLLECTIONS: CollectionAccessConfig[] = [
  {
    collection: 'Posts',
    icon: '📝',
    description: 'Public blog articles with draft/published lifecycle and author attribution.',
    roles: {
      admin: {
        read:   { allowed: true, description: 'Full access to all posts (drafts & published).' },
        create: { allowed: true, description: 'Can create posts for any author.' },
        update: { allowed: true, description: 'Can update any post unconditionally.' },
        delete: { allowed: true, description: 'Can delete any post unconditionally.' },
        admin:  { allowed: true, description: 'Can view collection in Admin UI.' },
      },
      editor: {
        read:   { allowed: true, description: 'Can read all posts regardless of status.' },
        create: { allowed: true, description: 'Can create new posts.' },
        update: { allowed: true, description: 'Can edit and publish any post.' },
        delete: { allowed: 'conditional', description: 'Can only delete drafts or own posts.', conditionCode: '({ req: { user } }) => user?.roles?.includes("editor") ? { status: { equals: "draft" } } : false', sqlFilter: 'WHERE "status" = \'draft\'' },
        admin:  { allowed: true, description: 'Can view collection in Admin UI.' },
      },
      author: {
        read:   { allowed: 'conditional', description: 'Can read published posts OR own posts.', conditionCode: '({ req: { user } }) => ({\n  or: [\n    { status: { equals: "published" } },\n    { author: { equals: user?.id } }\n  ]\n})', sqlFilter: 'WHERE ("status" = \'published\' OR "author_id" = :userId)' },
        create: { allowed: true, description: 'Can create posts (author auto-populated).' },
        update: { allowed: 'conditional', description: 'Can only update own posts.', conditionCode: '({ req: { user } }) => ({ author: { equals: user?.id } })', sqlFilter: 'WHERE "author_id" = :userId' },
        delete: { allowed: 'conditional', description: 'Can only delete own unpublished posts.', conditionCode: '({ req: { user } }) => ({\n  and: [\n    { author: { equals: user?.id } },\n    { status: { not_equals: "published" } }\n  ]\n})', sqlFilter: 'WHERE ("author_id" = :userId AND "status" != \'published\')' },
        admin:  { allowed: true, description: 'Can view collection in Admin UI.' },
      },
      customer: {
        read:   { allowed: 'conditional', description: 'Can only read published posts.', conditionCode: '() => ({ status: { equals: "published" } })', sqlFilter: 'WHERE "status" = \'published\'' },
        create: { allowed: false, description: 'Customers cannot create blog posts.' },
        update: { allowed: false, description: 'Customers cannot modify blog posts.' },
        delete: { allowed: false, description: 'Customers cannot delete blog posts.' },
        admin:  { allowed: false, description: 'Hidden from Admin UI.' },
      },
      guest: {
        read:   { allowed: 'conditional', description: 'Publicly readable if published.', conditionCode: '() => ({ status: { equals: "published" } })', sqlFilter: 'WHERE "status" = \'published\'' },
        create: { allowed: false, description: 'Unauthenticated users cannot create.' },
        update: { allowed: false, description: 'Unauthenticated users cannot modify.' },
        delete: { allowed: false, description: 'Unauthenticated users cannot delete.' },
        admin:  { allowed: false, description: 'Hidden from Admin UI.' },
      },
    },
  },
  {
    collection: 'Users',
    icon: '👥',
    description: 'Payload authentication collection with password hashes and role claims.',
    roles: {
      admin: {
        read:   { allowed: true, description: 'Can read all user accounts.' },
        create: { allowed: true, description: 'Can create users with any role.' },
        update: { allowed: true, description: 'Can update any user account.' },
        delete: { allowed: true, description: 'Can delete any user account.' },
        admin:  { allowed: true, description: 'Can manage users in Admin UI.' },
      },
      editor: {
        read:   { allowed: true, description: 'Can list authors and editors for attribution.' },
        create: { allowed: false, description: 'Cannot invite or register new users.' },
        update: { allowed: 'conditional', description: 'Can only update own profile.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        delete: { allowed: false, description: 'Cannot delete accounts.' },
        admin:  { allowed: false, description: 'No direct access to Users admin view.' },
      },
      author: {
        read:   { allowed: 'conditional', description: 'Can only read own user profile.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        create: { allowed: false, description: 'Cannot create users.' },
        update: { allowed: 'conditional', description: 'Can only update own profile.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        delete: { allowed: false, description: 'Cannot delete accounts.' },
        admin:  { allowed: false, description: 'No access to Users admin.' },
      },
      customer: {
        read:   { allowed: 'conditional', description: 'Can only read own account data.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        create: { allowed: true, description: 'Self-registration allowed via REST /auth/register.' },
        update: { allowed: 'conditional', description: 'Can update own account and address.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        delete: { allowed: 'conditional', description: 'Can request GDPR account erasure.', conditionCode: '({ req: { user } }) => ({ id: { equals: user?.id } })', sqlFilter: 'WHERE "id" = :userId' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
      guest: {
        read:   { allowed: false, description: 'Unauthenticated users cannot list accounts.' },
        create: { allowed: true, description: 'Can register new customer account.' },
        update: { allowed: false, description: 'Must authenticate first.' },
        delete: { allowed: false, description: 'Must authenticate first.' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
    },
  },
  {
    collection: 'Media',
    icon: '🖼️',
    description: 'File upload storage with Sharp image resizing and CDN URL generation.',
    roles: {
      admin: {
        read:   { allowed: true, description: 'Can view all media assets.' },
        create: { allowed: true, description: 'Can upload assets to S3/Local.' },
        update: { allowed: true, description: 'Can edit alt text and focal points.' },
        delete: { allowed: true, description: 'Can delete assets and purge CDN.' },
        admin:  { allowed: true, description: 'Full access in Admin UI.' },
      },
      editor: {
        read:   { allowed: true, description: 'Can view all media.' },
        create: { allowed: true, description: 'Can upload media.' },
        update: { allowed: true, description: 'Can edit media metadata.' },
        delete: { allowed: true, description: 'Can delete unlinked media.' },
        admin:  { allowed: true, description: 'Full access in Admin UI.' },
      },
      author: {
        read:   { allowed: true, description: 'Can view media library.' },
        create: { allowed: true, description: 'Can upload media for articles.' },
        update: { allowed: 'conditional', description: 'Can only update own uploaded files.', conditionCode: '({ req: { user } }) => ({ uploadedBy: { equals: user?.id } })', sqlFilter: 'WHERE "uploaded_by" = :userId' },
        delete: { allowed: 'conditional', description: 'Can only delete own files.', conditionCode: '({ req: { user } }) => ({ uploadedBy: { equals: user?.id } })', sqlFilter: 'WHERE "uploaded_by" = :userId' },
        admin:  { allowed: true, description: 'Media library access in Admin UI.' },
      },
      customer: {
        read:   { allowed: true, description: 'Public read access to images.' },
        create: { allowed: false, description: 'Cannot upload files.' },
        update: { allowed: false, description: 'Cannot modify files.' },
        delete: { allowed: false, description: 'Cannot delete files.' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
      guest: {
        read:   { allowed: true, description: 'Public read access to images.' },
        create: { allowed: false, description: 'Must log in.' },
        update: { allowed: false, description: 'Must log in.' },
        delete: { allowed: false, description: 'Must log in.' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
    },
  },
  {
    collection: 'Orders',
    icon: '🛍️',
    description: 'E-commerce transactions, Stripe payment intents, and customer invoices.',
    roles: {
      admin: {
        read:   { allowed: true, description: 'Can view all orders.' },
        create: { allowed: true, description: 'Can manually create manual orders.' },
        update: { allowed: true, description: 'Can adjust status & issue refunds.' },
        delete: { allowed: true, description: 'Can archive orders.' },
        admin:  { allowed: true, description: 'Full access in Admin UI.' },
      },
      editor: {
        read:   { allowed: true, description: 'Can view order fulfillments.' },
        create: { allowed: false, description: 'Orders generated via checkout.' },
        update: { allowed: 'conditional', description: 'Can only update fulfillment status.', conditionCode: '({ req: { user } }) => user?.roles?.includes("editor")', sqlFilter: '/* Field-level restriction: status only */' },
        delete: { allowed: false, description: 'Cannot delete orders.' },
        admin:  { allowed: true, description: 'View orders in Admin UI.' },
      },
      author: {
        read:   { allowed: false, description: 'Authors have no order access.' },
        create: { allowed: false, description: 'No order creation.' },
        update: { allowed: false, description: 'No order updates.' },
        delete: { allowed: false, description: 'No order deletion.' },
        admin:  { allowed: false, description: 'Hidden in Admin UI.' },
      },
      customer: {
        read:   { allowed: 'conditional', description: 'Can only view own orders.', conditionCode: '({ req: { user } }) => ({ customer: { equals: user?.id } })', sqlFilter: 'WHERE "customer_id" = :userId' },
        create: { allowed: true, description: 'Created via Stripe webhook / checkout.' },
        update: { allowed: false, description: 'Customers cannot modify placed orders.' },
        delete: { allowed: false, description: 'Orders are immutable for audit.' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
      guest: {
        read:   { allowed: false, description: 'Must log in to view orders.' },
        create: { allowed: true, description: 'Guest checkout with email token.' },
        update: { allowed: false, description: 'Cannot modify.' },
        delete: { allowed: false, description: 'Cannot delete.' },
        admin:  { allowed: false, description: 'No Admin UI access.' },
      },
    },
  },
];

interface Persona {
  role: UserRole;
  name: string;
  id: string;
  email: string;
  avatar: string;
}

const PERSONAS: Persona[] = [
  { role: 'admin',    name: 'Ada Lovelace (Chief Admin)', id: 'user_admin_01', email: 'admin@payloadcms.com', avatar: '👑' },
  { role: 'editor',   name: 'Sarah Connor (Senior Editor)', id: 'user_ed_02', email: 'sarah@payloadcms.com', avatar: '✍️' },
  { role: 'author',   name: 'John Doe (Staff Author)', id: 'user_auth_03', email: 'john@payloadcms.com', avatar: '✒️' },
  { role: 'customer', name: 'Alex Smith (Client)', id: 'user_cust_04', email: 'alex@example.com', avatar: '🛍️' },
  { role: 'guest',    name: 'Anonymous Guest (Unauthenticated)', id: '', email: '', avatar: '👤' },
];

export default function RbacMatrixPage() {
  const { toggleTheme } = useAcademy();

  const [activeRoleFilter, setActiveRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[2]); // Default Author
  const [selectedCollection, setSelectedCollection] = useState<string>('Posts');
  const [selectedAction, setSelectedAction] = useState<CrudAction>('read');
  const [docOwnership, setDocOwnership] = useState<'own' | 'other'>('own');
  const [docStatus, setDocStatus] = useState<'published' | 'draft'>('published');
  const [simulationResult, setSimulationResult] = useState<{
    timestamp: string;
    statusCode: number;
    statusText: string;
    granted: boolean;
    reason: string;
    sqlQuery: string;
    fnCode: string;
    mockPayload: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'tester' | 'snippets'>('matrix');

  // Simulated request evaluation
  const runSimulation = () => {
    const colConfig = MATRIX_COLLECTIONS.find(c => c.collection === selectedCollection);
    if (!colConfig) return;

    const rolePerm = colConfig.roles[selectedPersona.role][selectedAction];
    let granted = false;
    let reason = '';
    let statusCode = 200;
    let statusText = 'OK';
    let sql = 'SELECT * FROM "' + selectedCollection.toLowerCase() + '"';

    if (rolePerm.allowed === true) {
      granted = true;
      statusCode = selectedAction === 'create' ? 201 : (selectedAction === 'delete' ? 204 : 200);
      statusText = selectedAction === 'create' ? '201 Created' : (selectedAction === 'delete' ? '204 No Content' : '200 OK');
      reason = `Role "${selectedPersona.role}" has unconditional full "${selectedAction}" permissions on ${selectedCollection}.`;
      sql += '; -- Unrestricted query';
    } else if (rolePerm.allowed === false) {
      granted = false;
      statusCode = selectedPersona.role === 'guest' ? 401 : 403;
      statusText = selectedPersona.role === 'guest' ? '401 Unauthorized' : '403 Forbidden';
      reason = `Access Denied: Role "${selectedPersona.role}" has no "${selectedAction}" permission on ${selectedCollection}.`;
      sql = '-- Query not executed (Access Control returned false)';
    } else {
      // Conditional RLS
      if (selectedCollection === 'Posts') {
        if (selectedAction === 'read') {
          if (docStatus === 'published' || docOwnership === 'own') {
            granted = true;
            statusCode = 200;
            statusText = '200 OK';
            reason = docStatus === 'published'
              ? `Granted: Post is "published", readable by role "${selectedPersona.role}".`
              : `Granted: Post is owned by active user (${selectedPersona.id}).`;
          } else {
            granted = false;
            statusCode = 404; // Payload returns 404 for unreadable docs rather than leaking existence
            statusText = '404 Not Found (RLS Filtered)';
            reason = `Filtered Out: Post is "draft" and owned by another user.`;
          }
          sql += ` WHERE ("status" = 'published' OR "author_id" = '${selectedPersona.id || 'NULL'}');`;
        } else if (selectedAction === 'update' || selectedAction === 'delete') {
          if (docOwnership === 'own') {
            if (selectedAction === 'delete' && docStatus === 'published' && selectedPersona.role === 'author') {
              granted = false;
              statusCode = 403;
              statusText = '403 Forbidden';
              reason = 'Authors cannot delete published posts (must be unpublished first).';
              sql += ` WHERE "author_id" = '${selectedPersona.id}' AND "status" != 'published';`;
            } else {
              granted = true;
              statusCode = 200;
              statusText = '200 OK';
              reason = `Granted: Document matches ownership constraint ({ author: '${selectedPersona.id}' }).`;
              sql += ` WHERE "author_id" = '${selectedPersona.id}';`;
            }
          } else {
            granted = false;
            statusCode = 403;
            statusText = '403 Forbidden (Row-Level Security)';
            reason = `Denied: You do not have ownership rights to modify document owned by someone else.`;
            sql += ` WHERE "author_id" = '${selectedPersona.id}'; -- Yielded 0 matching rows`;
          }
        }
      } else if (selectedCollection === 'Users') {
        if (docOwnership === 'own') {
          granted = true;
          statusCode = 200;
          statusText = '200 OK';
          reason = `Granted: User is requesting their own profile record (${selectedPersona.id}).`;
          sql += ` WHERE "id" = '${selectedPersona.id}';`;
        } else {
          granted = false;
          statusCode = 403;
          statusText = '403 Forbidden';
          reason = `Denied: Non-admin users cannot access other users' accounts.`;
          sql += ` WHERE "id" = '${selectedPersona.id}';`;
        }
      } else if (selectedCollection === 'Orders') {
        if (docOwnership === 'own') {
          granted = true;
          statusCode = 200;
          statusText = '200 OK';
          reason = `Granted: Order belongs to customer ID (${selectedPersona.id}).`;
          sql += ` WHERE "customer_id" = '${selectedPersona.id}';`;
        } else {
          granted = false;
          statusCode = 403;
          statusText = '403 Forbidden';
          reason = `Denied: Order belongs to another customer account.`;
          sql += ` WHERE "customer_id" = '${selectedPersona.id}';`;
        }
      } else {
        granted = true;
        statusCode = 200;
        statusText = '200 OK';
        reason = 'Condition passed.';
      }
    }

    const mockPayloadData = granted ? {
      id: docOwnership === 'own' ? (selectedPersona.id ? `doc_owned_by_${selectedPersona.id}` : 'doc_public_99') : 'doc_other_user_44',
      collection: selectedCollection.toLowerCase(),
      status: docStatus,
      author: docOwnership === 'own' ? (selectedPersona.id || 'anonymous') : 'user_other_999',
      title: `${selectedCollection} Sample Resource #101`,
      updatedAt: new Date().toISOString(),
      simulatedUser: selectedPersona.name,
      evaluatedRole: selectedPersona.role,
    } : {
      errors: [
        {
          message: reason,
          name: statusCode === 401 ? 'AuthenticationError' : 'ForbiddenError',
        }
      ]
    };

    const fnCode = rolePerm.conditionCode || (
      rolePerm.allowed === true
        ? `// Access Control function: Unrestricted\nexport const can${selectedAction.toUpperCase()}: Access = () => true;`
        : `// Access Control function: Denied\nexport const can${selectedAction.toUpperCase()}: Access = () => false;`
    );

    setSimulationResult({
      timestamp: new Date().toLocaleTimeString(),
      statusCode,
      statusText,
      granted,
      reason,
      sqlQuery: sql,
      fnCode,
      mockPayload: JSON.stringify(mockPayloadData, null, 2),
    });
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentCollectionConfig = useMemo(() => {
    return MATRIX_COLLECTIONS.find(c => c.collection === selectedCollection) || MATRIX_COLLECTIONS[0];
  }, [selectedCollection]);

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>🛡️</i>
            <span>Visual RBAC &amp; Access Control Matrix</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/dashboard" className="t">📊 Dashboard</Link>
            <Link href="/schema-builder" className="t">⚙️ Schema Studio</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1200 }}>
          {/* Hero Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <div className="kick">Security &amp; Row-Level Security (RLS)</div>
              <h1 style={{ margin: '4px 0 8px' }}>Visual RBAC Matrix &amp; Simulator</h1>
              <p className="lead" style={{ margin: 0, maxWidth: 820 }}>
                Explore role-based access control, test query filters against simulated user sessions, and generate zero-trust TypeScript access functions for Payload 3.x.
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div style={{ display: 'flex', background: 'var(--card)', padding: 4, borderRadius: 8, border: '1px solid var(--border)', gap: 4 }}>
              <button
                onClick={() => setActiveTab('matrix')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === 'matrix' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'matrix' ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                📊 Permission Matrix
              </button>
              <button
                onClick={() => setActiveTab('tester')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === 'tester' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'tester' ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ⚡ Live Persona Tester
              </button>
              <button
                onClick={() => setActiveTab('snippets')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === 'snippets' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'snippets' ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                📜 TypeScript Access Snippets
              </button>
            </div>
          </div>

          {/* ═══════════ TAB 1: PERMISSION MATRIX ═══════════ */}
          {activeTab === 'matrix' && (
            <div>
              {/* Role Filter Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginRight: 4 }}>Filter by Role:</span>
                {(['all', 'admin', 'editor', 'author', 'customer', 'guest'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveRoleFilter(role)}
                    className="chip"
                    style={{
                      textTransform: 'capitalize',
                      background: activeRoleFilter === role ? 'var(--accent)' : 'var(--card)',
                      color: activeRoleFilter === role ? '#fff' : 'var(--text)',
                      borderColor: activeRoleFilter === role ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    {role === 'all' ? '🌐 All Roles' : `${role === 'admin' ? '👑' : role === 'editor' ? '✍️' : role === 'author' ? '✒️' : role === 'customer' ? '🛍️' : '👤'} ${role}`}
                  </button>
                ))}
              </div>

              {/* Matrix Table by Collection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {MATRIX_COLLECTIONS.map(col => (
                  <div key={col.collection} className="dash-section-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{col.icon}</span>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                            Collection: <code>{col.collection}</code>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{col.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedCollection(col.collection); setActiveTab('tester'); }}
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'var(--accent)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ⚡ Test In Simulator →
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)', width: 140 }}>Role</th>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)' }}>Read (find)</th>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)' }}>Create</th>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)' }}>Update</th>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)' }}>Delete</th>
                            <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--muted)' }}>Admin UI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Object.keys(col.roles) as UserRole[])
                            .filter(r => activeRoleFilter === 'all' || activeRoleFilter === r)
                            .map((role, idx) => {
                              const perms = col.roles[role];
                              return (
                                <tr key={role} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                  <td style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span>{role === 'admin' ? '👑' : role === 'editor' ? '✍️' : role === 'author' ? '✒️' : role === 'customer' ? '🛍️' : '👤'}</span>
                                      <span>{role}</span>
                                    </div>
                                  </td>
                                  {(['read', 'create', 'update', 'delete', 'admin'] as CrudAction[]).map(act => {
                                    const p = perms[act];
                                    const isAllowed = p.allowed === true;
                                    const isDenied = p.allowed === false;
                                    const isCond = p.allowed === 'conditional';

                                    return (
                                      <td key={act} style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                          <span
                                            style={{
                                              padding: '2px 8px',
                                              borderRadius: 4,
                                              fontSize: 11,
                                              fontWeight: 700,
                                              background: isAllowed ? 'rgba(16, 185, 129, 0.15)' : isDenied ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                              color: isAllowed ? '#10b981' : isDenied ? '#ef4444' : '#f59e0b',
                                              border: `1px solid ${isAllowed ? 'rgba(16, 185, 129, 0.3)' : isDenied ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                            }}
                                          >
                                            {isAllowed ? '✓ ALLOWED' : isDenied ? '✕ DENIED' : '⚖ RLS QUERY'}
                                          </span>
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
                                          {p.description}
                                        </div>
                                        {p.sqlFilter && (
                                          <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>
                                            {p.sqlFilter}
                                          </div>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TAB 2: LIVE PERSONA TESTER ═══════════ */}
          {activeTab === 'tester' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 20, alignItems: 'start' }}>
              {/* Simulator Controls */}
              <div className="dash-section-card">
                <h2 className="dash-section-title" style={{ marginBottom: 14 }}>⚡ Simulation Parameters</h2>

                {/* 1. Impersonated Persona */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                    1. IMPERSONATE USER PERSONA
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {PERSONAS.map(p => (
                      <div
                        key={p.role}
                        onClick={() => setSelectedPersona(p)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: `1px solid ${selectedPersona.role === p.role ? 'var(--accent)' : 'var(--border)'}`,
                          background: selectedPersona.role === p.role ? 'rgba(59, 130, 246, 0.1)' : 'var(--card)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{p.avatar}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            Role: <code style={{ color: 'var(--accent)' }}>{p.role}</code> {p.id ? `• ID: ${p.id}` : '• No session'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Target Collection */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                    2. TARGET COLLECTION
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {MATRIX_COLLECTIONS.map(col => (
                      <button
                        key={col.collection}
                        onClick={() => setSelectedCollection(col.collection)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 6,
                          border: `1px solid ${selectedCollection === col.collection ? 'var(--accent)' : 'var(--border)'}`,
                          background: selectedCollection === col.collection ? 'rgba(59, 130, 246, 0.1)' : 'var(--card)',
                          color: 'var(--text)',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>{col.icon}</span>
                        <span>{col.collection}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. CRUD Action */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                    3. OPERATION / ACTION
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['read', 'create', 'update', 'delete', 'admin'] as CrudAction[]).map(action => (
                      <button
                        key={action}
                        onClick={() => setSelectedAction(action)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: `1px solid ${selectedAction === action ? 'var(--accent)' : 'var(--border)'}`,
                          background: selectedAction === action ? 'var(--accent)' : 'var(--card)',
                          color: selectedAction === action ? '#fff' : 'var(--text)',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Document Context Variables */}
                <div style={{ marginBottom: 20, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
                    4. TARGET DOCUMENT STATE
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12 }}>Ownership:</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => setDocOwnership('own')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid var(--border)',
                            fontSize: 11,
                            fontWeight: 600,
                            background: docOwnership === 'own' ? 'var(--accent)' : 'transparent',
                            color: docOwnership === 'own' ? '#fff' : 'var(--muted)',
                            cursor: 'pointer',
                          }}
                        >
                          User&apos;s Own Doc
                        </button>
                        <button
                          onClick={() => setDocOwnership('other')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid var(--border)',
                            fontSize: 11,
                            fontWeight: 600,
                            background: docOwnership === 'other' ? 'var(--accent)' : 'transparent',
                            color: docOwnership === 'other' ? '#fff' : 'var(--muted)',
                            cursor: 'pointer',
                          }}
                        >
                          Other User&apos;s Doc
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12 }}>Post Status:</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => setDocStatus('published')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid var(--border)',
                            fontSize: 11,
                            fontWeight: 600,
                            background: docStatus === 'published' ? '#10b981' : 'transparent',
                            color: docStatus === 'published' ? '#fff' : 'var(--muted)',
                            cursor: 'pointer',
                          }}
                        >
                          Published
                        </button>
                        <button
                          onClick={() => setDocStatus('draft')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid var(--border)',
                            fontSize: 11,
                            fontWeight: 600,
                            background: docStatus === 'draft' ? '#f59e0b' : 'transparent',
                            color: docStatus === 'draft' ? '#fff' : 'var(--muted)',
                            cursor: 'pointer',
                          }}
                        >
                          Draft
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  onClick={runSimulation}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  🚀 Evaluate Simulated Request
                </button>
              </div>

              {/* Simulation Output Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!simulationResult ? (
                  <div className="dash-section-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>No Request Evaluated Yet</div>
                    <p style={{ fontSize: 13, maxWidth: 360, margin: '8px auto 0' }}>
                      Configure the persona and target operation on the left, then click &quot;Evaluate Simulated Request&quot; to inspect access control resolution.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Status Banner */}
                    <div
                      style={{
                        padding: '16px 20px',
                        borderRadius: 10,
                        border: `1px solid ${simulationResult.granted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        background: simulationResult.granted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            fontWeight: 900,
                            background: simulationResult.granted ? '#10b981' : '#ef4444',
                            color: '#fff',
                          }}
                        >
                          {simulationResult.granted ? '✓' : '✕'}
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: simulationResult.granted ? '#10b981' : '#ef4444' }}>
                            {simulationResult.statusText}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 2 }}>
                            {simulationResult.reason}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
                        Evaluated at {simulationResult.timestamp}
                      </span>
                    </div>

                    {/* SQL Where Clause Card */}
                    <div className="dash-section-card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                          🗄️ DRIZZLE SQL WHERE CLAUSE GENERATED
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Database Query Level RLS</span>
                      </div>
                      <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
                        {simulationResult.sqlQuery}
                      </pre>
                    </div>

                    {/* Evaluated Access Function */}
                    <div className="dash-section-card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                          ⚡ EXECUTED ACCESS CONTROL LOGIC
                        </span>
                        <button
                          onClick={() => copyCodeToClipboard(simulationResult.fnCode)}
                          style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
                        >
                          {copiedCode ? '✓ Copied' : 'Copy Code'}
                        </button>
                      </div>
                      <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#a78bfa', overflowX: 'auto' }}>
                        {simulationResult.fnCode}
                      </pre>
                    </div>

                    {/* Response Payload */}
                    <div className="dash-section-card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                          📦 REST / LOCAL API RESPONSE OBJECT
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>HTTP {simulationResult.statusCode}</span>
                      </div>
                      <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: simulationResult.granted ? '#34d399' : '#f87171', overflowX: 'auto' }}>
                        {simulationResult.mockPayload}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ TAB 3: TYPESCRIPT ACCESS SNIPPETS ═══════════ */}
          {activeTab === 'snippets' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
              {/* Snippet 1: isAdminOrSelf */}
              <div className="dash-section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>1. isAdminOrSelf (Account Security)</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                      Ensures users can only read/edit their own profile unless they have the &apos;admin&apos; role.
                    </p>
                  </div>
                  <button
                    onClick={() => copyCodeToClipboard(`import type { Access } from 'payload'\n\nexport const isAdminOrSelf: Access = ({ req: { user } }) => {\n  if (!user) return false\n  if (user.roles?.includes('admin')) return true\n  return { id: { equals: user.id } }\n}`)}
                    className="chip"
                    style={{ fontSize: 11 }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
{`import type { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (!user) return false

  // Admins get unrestricted access
  if (user.roles?.includes('admin')) return true

  // Regular users can only query/mutate own ID
  return {
    id: {
      equals: user.id,
    },
  }
}`}
                </pre>
              </div>

              {/* Snippet 2: isPublishedOrAuthor */}
              <div className="dash-section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>2. isPublishedOrAuthor (Content RLS)</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                      Allows public to see published posts while authors can preview their own drafts.
                    </p>
                  </div>
                  <button
                    onClick={() => copyCodeToClipboard(`import type { Access } from 'payload'\n\nexport const isPublishedOrAuthor: Access = ({ req: { user } }) => {\n  if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) return true\n  if (user) {\n    return {\n      or: [\n        { status: { equals: 'published' } },\n        { author: { equals: user.id } },\n      ],\n    }\n  }\n  return { status: { equals: 'published' } }\n}`)}
                    className="chip"
                    style={{ fontSize: 11 }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
{`import type { Access } from 'payload'

export const isPublishedOrAuthor: Access = ({ req: { user } }) => {
  // Admins & Editors can read everything
  if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) {
    return true
  }

  // Logged-in authors can see published OR own drafts
  if (user) {
    return {
      or: [
        { status: { equals: 'published' } },
        { author: { equals: user.id } },
      ],
    }
  }

  // Public / Anonymous visitors only see published
  return {
    status: {
      equals: 'published',
    },
  }
}`}
                </pre>
              </div>

              {/* Snippet 3: Field-Level Access Control */}
              <div className="dash-section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>3. Field-Level Access (Protect Sensitive Fields)</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                      Hide internal notes or stripe customer IDs from client responses.
                    </p>
                  </div>
                  <button
                    onClick={() => copyCodeToClipboard(`import type { FieldAccess } from 'payload'\n\nexport const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {\n  return Boolean(user?.roles?.includes('admin'))\n}`)}
                    className="chip"
                    style={{ fontSize: 11 }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
{`import type { FieldAccess } from 'payload'

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}

// In your field schema:
export const InternalNotesField = {
  name: 'internalStaffNotes',
  type: 'textarea',
  access: {
    read: isAdminFieldLevel,
    update: isAdminFieldLevel,
  },
}`}
                </pre>
              </div>

              {/* Snippet 4: Tenant & Multi-Organization Isolation */}
              <div className="dash-section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>4. Multi-Tenant Organization Isolation</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                      Automatically scope all queries to the user&apos;s active workspace/tenant.
                    </p>
                  </div>
                  <button
                    onClick={() => copyCodeToClipboard(`import type { Access } from 'payload'\n\nexport const isTenantMember: Access = ({ req: { user } }) => {\n  if (!user) return false\n  if (user.roles?.includes('superadmin')) return true\n  return { tenant: { equals: user.tenant?.id } }\n}`)}
                    className="chip"
                    style={{ fontSize: 11 }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#38bdf8', overflowX: 'auto' }}>
{`import type { Access } from 'payload'

export const isTenantMember: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('superadmin')) return true

  // SQL WHERE "tenant_id" = :userTenantId
  return {
    tenant: {
      equals: user.tenant?.id,
    },
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
