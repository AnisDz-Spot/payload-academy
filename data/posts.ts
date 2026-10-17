// Long-form articles. Content is authored as HTML strings (same convention as
// lesson bodies) so it can be rendered directly and styled by the shared
// `.lesson-content-body` prose rules.

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingMins: number;
  content: string;
  featured?: boolean;
  relatedLessons?: string[];
}

export const POSTS: Post[] = [
  {
    slug: 'payload-3-is-a-nextjs-app',
    title: "Payload 3.x is not a headless CMS — it's a Next.js app with a database",
    description:
      'The mental model that makes Payload 3.x click: it runs inside your Next.js app, ships its own admin UI and API, and treats your config as the single source of truth.',
    date: '2026-01-14',
    author: 'Payload Academy',
    tags: ['Payload CMS', 'Next.js', 'Architecture'],
    readingMins: 7,
    featured: true,
    relatedLessons: ['intro', 'install', 'structure', 'config', 'frontend'],
    content: `
<h2>Why the old headless model feels wrong in 2026</h2>
<p>For about a decade, "use a headless CMS" meant the same recipe: run the CMS as its own service, run a separate admin single-page app, host the frontend somewhere else, and stitch the whole thing together with webhooks and a REST client. It worked, but it left you maintaining two applications, two build pipelines, and a synchronization problem you never fully solved.</p>
<p>The friction shows up in the small places. You add a field and now three things need to agree: the CMS config, the admin UI's expectations, and the TypeScript types your frontend actually consumes. Every webhook is a chance for the frontend and the database to drift apart. Debugging means reading logs from two different dashboards.</p>

<h2>What Payload 3.x actually is</h2>
<p>Payload 3.x flipped the model. Instead of being a service your app talks to, Payload is a package you mount <em>inside</em> a Next.js App Router application. You keep one repository and one deployable. The file <code>payload.config.ts</code> is the source of truth: your collections, globals, fields, access control, hooks, and admin customizations all live there.</p>
<p>From that single config, Payload generates two things for you:</p>
<ul>
  <li>an <strong>admin UI</strong> mounted at <code>/admin</code>, built from your collections and fields;</li>
  <li>an <strong>API</strong> at <code>/api</code> — REST endpoints, plus GraphQL when you enable it.</li>
</ul>
<p>Your Payload config is TypeScript, and so is everything around it. That is the whole trick: the CMS, the admin, the API, and the frontend are edited in the same language, in the same repo, by the same tooling.</p>

<h2>Three consequences you feel on day one</h2>
<ul>
  <li><strong>No cross-app auth dance.</strong> The admin session and your frontend live in one Next.js app, so you are not building a two-hop token exchange just to render a draft.</li>
  <li><strong>Types fall out of the config.</strong> Because collections are declared in code, the Payload CLI can generate matching TypeScript types, so the frontend and the database stop disagreeing about shape.</li>
  <li><strong>The database is one function call away.</strong> The Local API lets server components read and write documents directly, without leaving the process or making an HTTP round-trip back to yourself.</li>
</ul>

<h2>What this does <em>not</em> mean</h2>
<p>Payload being "code-first" does not mean the hard parts disappear. You still choose and operate a database. You still write migrations. You still own access control — and Payload's default is permissive, so an unconfigured collection is a public collection. You still think about caching and invalidation.</p>
<p>"No separate backend" is also misleading. There <em>is</em> a backend: it is your Next.js server, and it now carries the responsibilities that used to live in a dedicated CMS process. The difference is that those responsibilities live in the same codebase as the UI.</p>

<h2>Where to start</h2>
<p>The fastest way to internalize this is to build the smallest possible thing and watch the pieces connect. Start with <a href="/lessons/intro">What is Payload?</a> and <a href="/lessons/install">Installation &amp; first run</a>, then read <a href="/lessons/structure">Project structure</a> so the folder layout stops feeling arbitrary. Once the config clicks in <a href="/lessons/config">The Payload Config</a>, rendering real data in a server component in <a href="/lessons/frontend">Rendering in Next.js Server Components</a> will feel obvious rather than magical.</p>
`,
  },
  {
    slug: 'payload-access-control-mistakes',
    title: 'Five Payload access-control mistakes that quietly leak data',
    description:
      'Payload lets everything through by default and its Local API skips access control unless you ask it not to. Here are the five gaps that show up in real projects — and how to close them.',
    date: '2026-01-28',
    author: 'Payload Academy',
    tags: ['Payload CMS', 'Security', 'Access Control'],
    readingMins: 8,
    relatedLessons: ['access', 'auth', 'apikeys', 'secprod', 'hooks'],
    content: `
<p>Access control is where a code-first CMS rewards discipline and punishes optimism. Payload gives you fine-grained tools, but the defaults are forgiving, and that is exactly why the same handful of mistakes appear in project after project. None of them are exotic. All of them leak.</p>

<h2>1. Assuming Payload denies by default</h2>
<p>It does not. If you do not define access control for a collection, the operation is allowed. A collection you created "just to get something on screen" is publicly readable and, depending on your setup, publicly writable. Before you ship, treat every collection as public until you have proven otherwise: open <code>/api</code>, list your collections, and confirm the read, create, update, and delete rules you actually intend.</p>

<h2>2. Trusting the Local API to enforce access</h2>
<p>The Local API is deliberately powerful, and by default it runs with <code>overrideAccess</code> enabled — meaning it bypasses your access-control functions. That is a feature: server code that legitimately needs full access should not fight your own rules. The mistake is using the Local API on behalf of a user and assuming their permissions apply. When a request is acting as a specific user, pass <code>overrideAccess: false</code> together with that user, so the same rules that guard the REST API also guard your server components and server actions.</p>

<h2>3. Locking the collection but not the field</h2>
<p>Collection-level access decides who can read a <em>document</em>. It says nothing about the sensitive fields inside it. Internal notes, cost prices, integration keys, and role flags all tend to live on otherwise-public collections. Field-level access is how you keep an editor from reading or writing a field they have no business touching, even when they legitimately can open the document. If a field would be embarrassing in a JSON dump, give it its own rule.</p>

<h2>4. Filtering in the frontend instead of the query</h2>
<p>Fetching every document and hiding the ones the user should not see in React is not access control — it is a data leak with extra steps. Row-level access belongs in the query, using the authenticated user from the request to build a <code>where</code> clause. When you constrain at the query layer, a forgotten UI branch can never expose a row that should never have been returned.</p>

<h2>5. Forgetting the edges: drafts, preview, and the admin itself</h2>
<p>The public read rule is the one everyone remembers. The overlooked ones are the draft and preview surfaces, which by design expose unpublished content to whoever holds a preview link, and the admin panel itself, which should be reachable only by the roles you intend. Close these deliberately: restrict draft access, scope preview to authenticated editors, and decide explicitly who can reach <code>/admin</code>.</p>

<h2>A short checklist before you ship</h2>
<ul>
  <li>Every collection has explicit read, create, update, and delete rules.</li>
  <li>Server-side reads that act as a user pass <code>overrideAccess: false</code>.</li>
  <li>Sensitive fields have field-level access, not just the collection.</li>
  <li>Row-level visibility is enforced in the query, not the component.</li>
  <li>Drafts, preview, and <code>/admin</code> have their own rules.</li>
</ul>

<h2>Practice it under test</h2>
<p>Reading about access control is easy; getting it right is a matter of reps. Work through <a href="/lessons/access">Access Control</a> and <a href="/lessons/auth">Authentication &amp; users</a>, then harden the edges with <a href="/lessons/apikeys">API Keys &amp; machine auth</a> and <a href="/lessons/secprod">Hardening &amp; production security</a>. The <a href="/lessons/hooks">Hooks</a> lesson shows where logic that must always run — regardless of who is asking — actually belongs.</p>
`,
  },
  {
    slug: 'local-api-vs-rest-vs-graphql',
    title: 'Local API vs. REST vs. GraphQL: how to choose in Payload 3.x',
    description:
      'Payload gives you three ways to read the same data. Picking the right one per context is the difference between a fast app and a slow, over-fetched one.',
    date: '2026-02-11',
    author: 'Payload Academy',
    tags: ['Payload CMS', 'API', 'Next.js'],
    readingMins: 6,
    relatedLessons: ['api', 'queries', 'frontend', 'actions', 'caching'],
    content: `
<p>One of the first things that surprises people new to Payload 3.x is that there is no single "correct" way to fetch data. There are three, and they are not competitors — they are tools for different jobs. Choosing well is most of what separates a snappy app from one that round-trips to itself for no reason.</p>

<h2>The Local API: the default inside your app</h2>
<p>When you are in a server component, a server action, a hook, or a script, the Local API is the natural choice. It calls into Payload directly in the same process — no HTTP, no serialization round-trip, no network hop to your own server. For rendering a page from the database, this is almost always what you want.</p>
<p>Two things to keep in mind. First, remember the default: the Local API bypasses access control unless you pass <code>overrideAccess: false</code> with a user, so "it worked in the server component" is not proof the same read is safe for an end user. Second, the Local API is server-only. It cannot run in the browser, which is a feature — it keeps your database credentials and logic off the client.</p>

<h2>REST: the interface for everyone else</h2>
<p>The REST API at <code>/api</code> is what external clients, mobile apps, third-party services, and the admin use. It speaks HTTP, it respects access control on every request, and it is the right surface when the caller is not your Next.js server. Its predictable resource shape (<code>/api/&lt;collection&gt;</code> with query parameters for filtering and pagination) makes it easy to document and cache at the edge.</p>
<p>Use REST when the request originates outside your app, when you need a stable contract for another team, or when HTTP-level caching and CDN behavior matter more than in-process speed.</p>

<h2>GraphQL: when the shape of the response is the problem</h2>
<p>Payload can expose a GraphQL endpoint alongside REST. Its value is precise, nested selection: one query returns exactly the fields and relationships a screen needs, without over-fetching. When a frontend would otherwise make several REST calls and join the results by hand, GraphQL earns its keep. When you are fetching a single collection list, it usually just adds ceremony.</p>

<h2>A simple decision guide</h2>
<ul>
  <li><strong>Server component, server action, hook, or script?</strong> Local API.</li>
  <li><strong>Browser or external client?</strong> REST (or GraphQL for complex nested reads).</li>
  <li><strong>Mobile or third-party integration that needs many linked resources in one shot?</strong> GraphQL.</li>
  <li><strong>Serving the same public page to lots of people?</strong> Fetch once with the Local API and let Next.js cache the result, rather than hitting REST on every request.</li>
</ul>

<h2>The anti-pattern to avoid</h2>
<p>The most common mistake is a Next.js server component that calls its own REST API over HTTP. You pay for a network round-trip and lose the direct typing the Local API gives you, all to talk to a server that is already running the exact code you are calling. If you catch yourself constructing a fetch URL that points back at your own deployment, stop and reach for the Local API instead.</p>

<h2>Practice it</h2>
<p><a href="/lessons/api">Local API, REST &amp; GraphQL</a> walks the three surfaces side by side. Go deeper on filtering at the query layer in <a href="/lessons/queries">Query operators &amp; pagination</a>, put the Local API to work in <a href="/lessons/frontend">Rendering in Next.js Server Components</a> and <a href="/lessons/actions">Server Actions &amp; mutations</a>, then make it cheap to repeat in <a href="/lessons/caching">Next.js Cache, ISR &amp; Tags</a>.</p>
`,
  },
];

export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
