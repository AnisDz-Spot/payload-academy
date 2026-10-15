import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_SYSTEM_PROMPT = `You are the official Payload 3.x Senior AI Architect and Instructor for Payload Academy.
You specialize exclusively in:
1. Payload CMS 3.x with Next.js 15 (App Router, React Server Components, Server Actions).
2. Database Adapters: Drizzle ORM (@payloadcms/db-postgres, @payloadcms/db-sqlite) and MongoDB (@payloadcms/db-mongodb).
3. RichText: Lexical editor (@payloadcms/richtext-lexical) with custom blocks and headless AST output.
4. Access Control: Collection and Field-level row filtering and boolean permissions.
5. Hooks: beforeValidate, beforeChange, afterChange, beforeRead, afterRead, afterDelete.
6. Relationships & Virtual Join Fields (type: 'join').
7. Authentication, Multi-tenancy, Live Preview, and custom REST / GraphQL endpoints.

Always provide concise, accurate, production-ready TypeScript code examples targeting Payload 3.x (never Payload 2.x Express patterns). Format code cleanly in markdown with triple backticks.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1]?.content || '';

    // Check for API Keys in environment variables
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // ── 1. Google Gemini API ──────────────────────────────────────
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${PAYLOAD_SYSTEM_PROMPT}\n\nUser Question:\n${latestMessage}` }],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1200,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ reply: text, provider: 'gemini' });
          }
        }
      } catch (err) {
        console.error('Gemini API error, falling back:', err);
      }
    }

    // ── 2. OpenAI API ─────────────────────────────────────────────
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: PAYLOAD_SYSTEM_PROMPT },
              ...messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            temperature: 0.3,
            max_tokens: 1200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return NextResponse.json({ reply: text, provider: 'openai' });
          }
        }
      } catch (err) {
        console.error('OpenAI API error, falling back:', err);
      }
    }

    // ── 3. Groq API ───────────────────────────────────────────────
    if (groqKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: PAYLOAD_SYSTEM_PROMPT },
              ...messages,
            ],
            temperature: 0.3,
            max_tokens: 1200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return NextResponse.json({ reply: text, provider: 'groq' });
          }
        }
      } catch (err) {
        console.error('Groq API error, falling back:', err);
      }
    }

    // ── 4. Intelligent Offline Knowledge Engine Fallback ──────────
    const fallbackAnswer = generateOfflinePayloadAnswer(latestMessage);
    return NextResponse.json({ reply: fallbackAnswer, provider: 'offline' });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateOfflinePayloadAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('server component') || q.includes('getpayload') || q.includes('fetch') || q.includes('next.js') || q.includes('page.tsx')) {
    return `In **Payload 3.x**, you execute queries directly inside Next.js React Server Components without HTTP overhead using \`getPayload\`:

\`\`\`typescript
// app/blog/page.tsx (Server Component)
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 10,
  })

  return (
    <main>
      <h1>Latest Posts</h1>
      {posts.docs.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </main>
  )
}
\`\`\`

⚡ **Tip:** Payload 3.x runs on the same Node/Edge runtime as your Next.js frontend, so queries hit the database connection pool directly.`;
  }

  if (q.includes('hook') || q.includes('afterchange') || q.includes('beforechange') || q.includes('webhook')) {
    return `Here is a production-grade **afterChange hook** with typed arguments that runs when documents are published:

\`\`\`typescript
import type { CollectionAfterChangeHook } from 'payload'

export const notifyOnPublish: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger on creation or status change to 'published'
  const isNowPublished = doc.status === 'published' && previousDoc?.status !== 'published'

  if (operation === 'create' || isNowPublished) {
    try {
      await fetch(process.env.WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'post.published',
          id: doc.id,
          title: doc.title,
          author: req.user?.email || 'System',
        }),
      })
    } catch (err) {
      req.payload.logger.error('Failed to trigger publish webhook', err)
    }
  }

  return doc
}
\`\`\`

Register this in your collection config:
\`\`\`typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    afterChange: [notifyOnPublish],
  },
  fields: [/* ... */],
}
\`\`\``;
  }

  if (q.includes('access control') || q.includes('rbac') || q.includes('permission') || q.includes('role')) {
    return `In Payload 3.x, **Access Control** functions return either a boolean (\`true\` / \`false\`) or a query constraint object for row-level security:

\`\`\`typescript
import type { Access, FieldAccess } from 'payload'

// Collection Access: Admins have full access, authors only see their own docs
export const canReadPosts: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  // Row-level filter constraint:
  return {
    author: {
      equals: user.id,
    },
  }
}

// Field-level Access: Only admins can view internal margin/cost data
export const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}
\`\`\``;
  }

  if (q.includes('join') || q.includes('relationship')) {
    return `Payload 3.x introduced **Virtual Join Fields** (\`type: 'join'\`), which link collections bidirectionally without database array denormalization:

\`\`\`typescript
import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts', // target collection
      on: 'author',        // relationship field in Posts that points to Author
      maxDepth: 1,
    },
  ],
}
\`\`\`

✨ **Benefit:** No duplicate IDs to sync on updates, resulting in faster writes and zero relation sync drift.`;
  }

  return `Here is the idiomatic **Payload CMS 3.x** configuration pattern for your request:

\`\`\`typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  collections: [
    // Your collections here
  ],
})
\`\`\`

💡 *Tip: You can ask specific questions about custom endpoints, live preview with Next.js App Router, SQLite migration, or Lexical block plugins!*`;
}
