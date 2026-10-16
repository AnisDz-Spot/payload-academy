import { Quiz } from './types';

export const QUIZZES: Record<string, Quiz> = {
  "intro": {
    "question": "Which APIs does Payload automatically generate from your config?",
    "options": [
      "Local, REST and GraphQL",
      "Only REST",
      "Only GraphQL"
    ],
    "correct": 0,
    "explanation": "All three are generated from the same TypeScript config with zero extra setup."
  },
  "install": {
    "question": "Which command scaffolds a new Payload 3.x project?",
    "options": [
      "npm init payload",
      "npx create-payload-app@latest",
      "pnpm add payload-cli"
    ],
    "correct": 1,
    "explanation": "create-payload-app is the official modern scaffolder for Payload."
  },
  "structure": {
    "question": "Which auto-generated files should always be committed to Git?",
    "options": [
      "payload-types.ts and importMap.js",
      "node_modules",
      ".env"
    ],
    "correct": 0,
    "explanation": "payload-types.ts and importMap.js are required by TypeScript and the compiler."
  },
  "cli": {
    "question": "Which CLI command produces Drizzle SQL migration files?",
    "options": [
      "payload generate:schema",
      "payload migrate:create",
      "payload db:push"
    ],
    "correct": 1,
    "explanation": "payload migrate:create creates a timestamped SQL migration file."
  },
  "config": {
    "question": "Which config key signs authentication tokens & JWT cookies?",
    "options": [
      "secret",
      "db",
      "editor"
    ],
    "correct": 0,
    "explanation": "The secret property (PAYLOAD_SECRET) signs JWT tokens."
  },
  "collections": {
    "question": "What is a Payload Collection?",
    "options": [
      "A group of documents sharing a schema",
      "A single global document",
      "A database connection"
    ],
    "correct": 0,
    "explanation": "A Collection defines a repeatable document schema with full CRUD."
  },
  "fields": {
    "question": "Which field type is best suited for visual page builder layouts?",
    "options": [
      "blocks",
      "group",
      "point"
    ],
    "correct": 0,
    "explanation": "The blocks field lets editors compose pages from customizable block types."
  },
  "layout": {
    "question": "What is the difference between Named Tabs and Unnamed Tabs?",
    "options": [
      "Named tabs nest data in an object; unnamed tabs flatten into root doc",
      "Named tabs cannot have validation",
      "Unnamed tabs create separate tables"
    ],
    "correct": 0,
    "explanation": "Unnamed tabs organize UI layout without altering the underlying data shape."
  },
  "relationships": {
    "question": "Which option specifies default populated fields to prevent over-fetching?",
    "options": [
      "defaultPopulate",
      "depth: 10",
      "select: \"*\""
    ],
    "correct": 0,
    "explanation": "defaultPopulate controls which fields are returned when populated as a relation."
  },
  "globals": {
    "question": "What is the purpose of a Global in Payload?",
    "options": [
      "Singleton document for site-wide settings and menus",
      "A user role",
      "A global CSS style"
    ],
    "correct": 0,
    "explanation": "Globals represent unique single documents like Headers and Footers."
  },
  "join": {
    "question": "What database columns does a join field add to its collection?",
    "options": [
      "Zero columns (it is a virtual query shortcut)",
      "A foreign key column",
      "A junction table"
    ],
    "correct": 0,
    "explanation": "Join fields are virtual bi-directional lookups that add zero database columns."
  },
  "access": {
    "question": "When does the Local API enforce access control rules?",
    "options": [
      "Only when overrideAccess: false is passed",
      "Always by default",
      "Never"
    ],
    "correct": 0,
    "explanation": "The Local API bypasses access by default for server-side speed; pass overrideAccess: false to enforce it."
  },
  "hooks": {
    "question": "Which hook can mutate data right before it is written to the database?",
    "options": [
      "beforeChange",
      "afterRead",
      "afterChange"
    ],
    "correct": 0,
    "explanation": "beforeChange runs right before writing to the database and can mutate the data payload."
  },
  "auth": {
    "question": "How do you turn a collection into an authenticated user collection?",
    "options": [
      "auth: true",
      "login: true",
      "users: true"
    ],
    "correct": 0,
    "explanation": "Adding auth: true configures password hashing, JWT sessions, and login endpoints."
  },
  "customauth": {
    "question": "How can you sign in a user programmatically in an OAuth callback?",
    "options": [
      "payload.login({ collection, data })",
      "payload.verify()",
      "payload.cookie()"
    ],
    "correct": 0,
    "explanation": "payload.login verifies or creates a session token for the user."
  },
  "apikeys": {
    "question": "What Authorization header scheme is used for API key requests?",
    "options": [
      "<collection-slug> API-Key <key>",
      "Bearer <key>",
      "Basic <key>"
    ],
    "correct": 0,
    "explanation": "Payload uses the format: users API-Key <key>."
  },
  "secprod": {
    "question": "What should be configured in production to block unauthorized cross-origin requests?",
    "options": [
      "cors and csrf whitelists",
      "disableCORS: true",
      "openAccess: true"
    ],
    "correct": 0,
    "explanation": "Setting cors and csrf limits allowed browser origins strictly."
  },
  "uploads": {
    "question": "Which package provides server-side image resizing and focal point crops?",
    "options": [
      "sharp",
      "graphql",
      "lexical"
    ],
    "correct": 0,
    "explanation": "sharp handles fast image resizing and responsive crops."
  },
  "drafts": {
    "question": "How does Live Preview update frontend previews in real time?",
    "options": [
      "iframe with window.postMessage",
      "Polling every second",
      "Full page reloads"
    ],
    "correct": 0,
    "explanation": "Live Preview communicates real-time draft state changes via window.postMessage."
  },
  "api": {
    "question": "Why is the Local API preferred inside Next.js Server Components?",
    "options": [
      "Zero HTTP overhead, runs in-process with full TypeScript types",
      "It is required by Next.js",
      "It only works with MongoDB"
    ],
    "correct": 0,
    "explanation": "The Local API avoids network latency and shares memory in the same Node process."
  },
  "queries": {
    "question": "Which parameter skips the COUNT query for faster list performance?",
    "options": [
      "pagination: false",
      "limit: -1",
      "skipCount: true"
    ],
    "correct": 0,
    "explanation": "Setting pagination: false skips the expensive totalDocs COUNT query."
  },
  "actions": {
    "question": "How do Next.js 16 Server Actions interact with Payload?",
    "options": [
      "Directly call getPayload({ config }) and Local API methods",
      "Make REST fetch calls to localhost",
      "They cannot interact"
    ],
    "correct": 0,
    "explanation": "Server Actions invoke the Local API directly with strong type safety."
  },
  "frontend": {
    "question": "Which component renders Lexical rich text JSON in React?",
    "options": [
      "<RichText data={...} /> from @payloadcms/richtext-lexical/react",
      "dangerouslySetInnerHTML",
      "<Markdown />"
    ],
    "correct": 0,
    "explanation": "The official RichText component maps Lexical JSON AST nodes to React elements."
  },
  "seeding": {
    "question": "Why should seed scripts be written idempotently?",
    "options": [
      "So running them multiple times does not create duplicate records",
      "Because SQLite requires it",
      "To speed up TypeScript compilation"
    ],
    "correct": 0,
    "explanation": "Idempotent scripts check for existing records before creating new ones."
  },
  "admin": {
    "question": "Are custom Admin views protected by default?",
    "options": [
      "No, you must check req.user and role permissions yourself",
      "Yes, only admins can view them",
      "They cannot be accessed"
    ],
    "correct": 0,
    "explanation": "Custom admin views are public by default; always verify user credentials."
  },
  "customui": {
    "question": "How are custom React components registered in collection configs?",
    "options": [
      "Path strings resolved via generate:importmap",
      "Inline JSX functions",
      "Direct npm package names"
    ],
    "correct": 0,
    "explanation": "Component path strings (e.g. /fields/ColorPicker#ColorPicker) are resolved via the import map."
  },
  "theming": {
    "question": "Where do you inject custom CSS variables into the admin?",
    "options": [
      "admin.css in payload.config.ts",
      "globals.css in Next.js",
      "inline HTML style tag"
    ],
    "correct": 0,
    "explanation": "The admin.css property loads custom stylesheets into the admin panel."
  },
  "whitelabel": {
    "question": "Which admin component slot replaces the default login page?",
    "options": [
      "admin.components.views.Login",
      "admin.loginView",
      "admin.header"
    ],
    "correct": 0,
    "explanation": "admin.components.views.Login allows complete replacement of the login interface."
  },
  "richtext": {
    "question": "In what format does Lexical store rich text content?",
    "options": [
      "Structured JSON AST",
      "Raw HTML",
      "Markdown text"
    ],
    "correct": 0,
    "explanation": "Lexical stores structured JSON, making content portable across web, mobile, and RSS."
  },
  "nesteddocs": {
    "question": "What does the @payloadcms/plugin-nested-docs plugin generate automatically?",
    "options": [
      "Breadcrumbs array with labels and full nested URLs",
      "SQL tables for each child",
      "Static HTML files"
    ],
    "correct": 0,
    "explanation": "The plugin auto-calculates breadcrumbs and nested URLs based on parent relationships."
  },
  "webhooks": {
    "question": "How do you verify the authenticity of an outgoing webhook payload?",
    "options": [
      "Verify HMAC SHA-256 signature using a shared secret",
      "Check the IP address only",
      "Webhooks cannot be verified"
    ],
    "correct": 0,
    "explanation": "HMAC SHA-256 signatures generated with a shared secret prove payload authenticity."
  },
  "transactions": {
    "question": "What must be passed to Local API calls to keep them in the same transaction?",
    "options": [
      "req (which contains the transaction context)",
      "transaction: true",
      "db: \"postgres\""
    ],
    "correct": 0,
    "explanation": "Passing req ensures that all operations share the active database transaction."
  },
  "jobs": {
    "question": "How do you execute queued background jobs on serverless deployments?",
    "options": [
      "Hit the /api/payload-jobs/run endpoint via a scheduled cron or webhook",
      "They run automatically in background workers",
      "Jobs cannot run on serverless"
    ],
    "correct": 0,
    "explanation": "Serverless architectures require triggering job execution via cron webhooks."
  },
  "storage": {
    "question": "Which storage adapter is native to Vercel deployments?",
    "options": [
      "@payloadcms/storage-vercel-blob",
      "@payloadcms/storage-s3",
      "@payloadcms/storage-azure"
    ],
    "correct": 0,
    "explanation": "Vercel Blob provides native, zero-configuration cloud storage on Vercel."
  },
  "email": {
    "question": "Which email adapter is optimized for serverless environments?",
    "options": [
      "@payloadcms/email-resend",
      "@payloadcms/email-nodemailer with SMTP",
      "Local sendmail"
    ],
    "correct": 0,
    "explanation": "Resend is API-driven and avoids persistent SMTP connection limitations in serverless."
  },
  "plugins": {
    "question": "What is the signature of a Payload plugin?",
    "options": [
      "(options) => (config) => modifiedConfig",
      "(req, res) => next()",
      "(schema) => tables"
    ],
    "correct": 0,
    "explanation": "Plugins are higher-order functions that transform the configuration object."
  },
  "i18n": {
    "question": "Which field property enables multi-language translations?",
    "options": [
      "localized: true",
      "i18n: true",
      "locale: true"
    ],
    "correct": 0,
    "explanation": "Setting localized: true stores separate translation values for each locale."
  },
  "tenants": {
    "question": "What does multi-tenancy provide in a single Payload instance?",
    "options": [
      "Isolated customer data via automated row-level security",
      "Faster page loads",
      "Free database hosting"
    ],
    "correct": 0,
    "explanation": "Multi-tenancy isolates data per tenant within a single unified codebase."
  },
  "ai": {
    "question": "Why is Payload uniquely suited for AI & RAG pipelines?",
    "options": [
      "Structured JSON content + afterChange hooks for automatic re-embedding",
      "It includes a built-in LLM",
      "It converts HTML to Markdown"
    ],
    "correct": 0,
    "explanation": "Clean JSON schemas and lifecycle hooks allow seamless automated vector embeddings."
  },
  "testing": {
    "question": "Why are Vitest integration tests fast with Payload?",
    "options": [
      "The Local API runs in-process without spinning up an HTTP server",
      "Vitest skips tests",
      "Payload mocks the database"
    ],
    "correct": 0,
    "explanation": "The Local API operates directly in TypeScript without network overhead."
  },
  "database": {
    "question": "Which command applies pending SQL migrations in production?",
    "options": [
      "payload migrate",
      "payload migrate:create",
      "payload db:push"
    ],
    "correct": 0,
    "explanation": "payload migrate runs all pending migrations in an atomic transaction."
  },
  "esm": {
    "question": "What Next.js flag activates Turbopack for ultra-fast dev compilation?",
    "options": [
      "next dev --turbopack",
      "next dev --fast",
      "next dev --turbo-mode"
    ],
    "correct": 0,
    "explanation": "Passing --turbopack enables Next.js Turbopack compiler support."
  },
  "caching": {
    "question": "How do you invalidate Next.js cached data when a document changes in Payload?",
    "options": [
      "Call revalidateTag() or revalidatePath() inside an afterChange hook",
      "Restart the server",
      "Set cache: \"no-store\" everywhere"
    ],
    "correct": 0,
    "explanation": "afterChange hooks trigger on-demand Next.js ISR tag revalidations."
  },
  "deploy": {
    "question": "What command should always run before next build in production CI/CD?",
    "options": [
      "pnpm payload migrate",
      "pnpm payload generate:types",
      "pnpm payload jobs:run"
    ],
    "correct": 0,
    "explanation": "Migrations must be applied to ensure the database matches the compiled code schema."
  },
  "next": {
    "question": "What is the recommended practice for relationship field queries?",
    "options": [
      "Keep depth minimal (0 or 1) and use select or defaultPopulate",
      "Always use depth: 10",
      "Never use relationships"
    ],
    "correct": 0,
    "explanation": "Minimal depth and column projection prevent severe N+1 performance bottlenecks."
  },
  "proj1": {
    "question": "Why use draft-aware read access control on Posts?",
    "options": [
      "To prevent unauthenticated public visitors from viewing unpublished drafts",
      "To speed up queries",
      "To enable file uploads"
    ],
    "correct": 0,
    "explanation": "Draft-aware rules restrict unpublished content to authenticated editors."
  },
  "proj2": {
    "question": "Which function generates static routes at build time in Next.js App Router?",
    "options": [
      "generateStaticParams",
      "getServerSideProps",
      "generateMetadata"
    ],
    "correct": 0,
    "explanation": "generateStaticParams pre-renders dynamic routes for ultra-fast static delivery."
  },
  "capstone": {
    "question": "How do you restrict authors to updating only their own articles?",
    "options": [
      "Return a query constraint { author: { equals: user.id } } from the update access function",
      "Set author field readOnly",
      "Use a beforeChange hook"
    ],
    "correct": 0,
    "explanation": "Returning a query constraint enforces row-level security so users only touch their own data."
  },
  "ecomm1": {
    "question": "Why should order totals and prices be computed on the server?",
    "options": [
      "Client-submitted prices cannot be trusted and could be manipulated",
      "It saves bandwidth",
      "Payload requires it"
    ],
    "correct": 0,
    "explanation": "Never trust client-submitted prices; always validate from database records."
  },
  "ecomm2": {
    "question": "How do you verify that an incoming Stripe webhook is authentic?",
    "options": [
      "Verify the stripe-signature header using your webhook secret",
      "Check request IP only",
      "Look at the payload JSON"
    ],
    "correct": 0,
    "explanation": "Verifying cryptographic signatures ensures webhooks originate from Stripe."
  }
};
