import { Challenge } from './types';

export const CHALLENGES: Record<string, Challenge> = {
  "prereqs": {
    "docsPath": "",
    "challengeText": "Export a `prerequisites` object describing the runtime Payload 3.x expects (Node version, package manager, database)."
  },
  "quickstart": {
    "docsPath": "getting-started/installation",
    "challengeText": "Write a server helper that fetches the 10 newest posts from the `posts` collection with the Local API."
  },
  "admin-tour": {
    "docsPath": "admin/overview",
    "challengeText": "Configure a Posts collection's admin options: useAsTitle, three defaultColumns, and a sidebar group."
  },
  "dev-loop": {
    "docsPath": "getting-started/installation",
    "challengeText": "Define the `dev`, `build` and `generate:types` scripts in package.json."
  },
  "intro": {
    "docsPath": "",
    "challengeText": ""
  },
  "install": {
    "docsPath": "getting-started/installation",
    "challengeText": "Scaffold a blank project and verify logging into the /admin panel."
  },
  "structure": {
    "docsPath": "getting-started/installation",
    "challengeText": "Inspect payload-types.ts and importMap.js to understand generated files."
  },
  "cli": {
    "docsPath": "configuration/overview",
    "challengeText": "Execute `pnpm payload generate:types` and write a custom management script using tsx."
  },
  "config": {
    "docsPath": "configuration/overview",
    "challengeText": "Add custom CORS origins and live preview breakpoints to payload.config.ts."
  },
  "collections": {
    "docsPath": "configuration/collections",
    "challengeText": "Create a Products collection with draft support and sidebar status field."
  },
  "fields": {
    "docsPath": "fields/overview",
    "challengeText": "Build a PageBuilder blocks field with Hero and CallToAction blocks."
  },
  "layout": {
    "docsPath": "fields/overview",
    "challengeText": "Create a Tabs layout separating Main Content from an SEO Group in the admin."
  },
  "relationships": {
    "docsPath": "fields/relationship",
    "challengeText": "Configure defaultPopulate on Users to exclude private fields when populated."
  },
  "globals": {
    "docsPath": "configuration/globals",
    "challengeText": "Create a Navigation Header global with array of links and logo upload."
  },
  "join": {
    "docsPath": "fields/join",
    "challengeText": "Add a join field to Categories to view related Posts without database columns."
  },
  "access": {
    "docsPath": "access-control/overview",
    "challengeText": "Implement row-level access control so authors only see and update their own posts."
  },
  "hooks": {
    "docsPath": "hooks/overview",
    "challengeText": "Write an auto-slug beforeChange hook and an afterChange cache revalidation hook."
  },
  "auth": {
    "docsPath": "authentication/overview",
    "challengeText": "Configure maxLoginAttempts and secure cookie settings on the Users collection."
  },
  "customauth": {
    "docsPath": "authentication/overview",
    "challengeText": "Implement a GitHub OAuth callback route handler using the Local API."
  },
  "apikeys": {
    "docsPath": "authentication/api-keys",
    "challengeText": "Enable API keys, create a service-account user, and test a cURL request."
  },
  "secprod": {
    "docsPath": "access-control/overview",
    "challengeText": "Configure rate limiting on /api/users/login and enforce strict CORS origins."
  },
  "uploads": {
    "docsPath": "upload/overview",
    "challengeText": "Add responsive image sizes (thumbnail, card, hero) to a Media collection."
  },
  "drafts": {
    "docsPath": "versions/overview",
    "challengeText": "Configure Live Preview for posts with real-time responsive breakpoints."
  },
  "api": {
    "docsPath": "local-api/overview",
    "challengeText": "Execute the same filter query using both the Local API and the REST API."
  },
  "queries": {
    "docsPath": "queries/overview",
    "challengeText": "Construct a complex query using AND/OR logic and column projection with select."
  },
  "actions": {
    "docsPath": "local-api/overview",
    "challengeText": "Build a Next.js Server Action with Zod validation to create inquiry documents."
  },
  "frontend": {
    "docsPath": "local-api/overview",
    "challengeText": "Create a statically generated blog page in Next.js Server Components."
  },
  "seeding": {
    "docsPath": "configuration/overview",
    "challengeText": "Write an idempotent seed.ts script that provisions categories, admin, and mock posts."
  },
  "admin": {
    "docsPath": "admin/overview",
    "challengeText": "Add a custom Analytics dashboard view to the admin using Server Components."
  },
  "customui": {
    "docsPath": "custom-components/overview",
    "challengeText": "Build an interactive React color-picker field and link it via importMap."
  },
  "theming": {
    "docsPath": "admin/overview",
    "challengeText": "Create a custom CSS theme overriding admin brand colors and button gradients."
  },
  "whitelabel": {
    "docsPath": "admin/overview",
    "challengeText": "Replace the default admin login view with a branded enterprise portal screen."
  },
  "richtext": {
    "docsPath": "rich-text/overview",
    "challengeText": "Add a custom Callout block feature to the Lexical editor and render it in React."
  },
  "nesteddocs": {
    "docsPath": "plugins/nested-docs",
    "challengeText": "Install the nested docs plugin and build hierarchical doc breadcrumbs."
  },
  "webhooks": {
    "docsPath": "hooks/overview",
    "challengeText": "Implement an outgoing webhook afterChange hook with HMAC SHA-256 signatures."
  },
  "transactions": {
    "docsPath": "database/overview",
    "challengeText": "Wrap an inventory checkout mutation inside an atomic database transaction."
  },
  "jobs": {
    "docsPath": "jobs-queue/overview",
    "challengeText": "Queue a long-running email broadcast task and trigger it via payload jobs:run."
  },
  "storage": {
    "docsPath": "upload/overview",
    "challengeText": "Configure S3 or Vercel Blob cloud storage adapter for media uploads."
  },
  "email": {
    "docsPath": "email/overview",
    "challengeText": "Configure the Resend email adapter and test transactional email delivery."
  },
  "plugins": {
    "docsPath": "plugins/overview",
    "challengeText": "Write a custom plugin that adds reading time calculation to all article collections."
  },
  "i18n": {
    "docsPath": "configuration/localization",
    "challengeText": "Enable French and Arabic localization and query content by locale."
  },
  "tenants": {
    "docsPath": "plugins/multi-tenant",
    "challengeText": "Set up multi-tenancy to segregate customer data within a shared database."
  },
  "ai": {
    "docsPath": "hooks/overview",
    "challengeText": "Create an afterChange hook that generates vector embeddings with OpenAI on publish."
  },
  "testing": {
    "docsPath": "",
    "challengeText": "Write a Vitest integration test verifying draft access rules and slug hooks."
  },
  "database": {
    "docsPath": "database/migrations",
    "challengeText": "Generate a SQL migration with payload migrate:create and inspect the SQL."
  },
  "esm": {
    "docsPath": "",
    "challengeText": "Enable Next.js Turbopack and benchmark cold start dev server times."
  },
  "caching": {
    "docsPath": "database/overview",
    "challengeText": "Implement tag-based ISR revalidation and edge CDN cache purging."
  },
  "deploy": {
    "docsPath": "database/migrations",
    "challengeText": "Configure Vercel build commands with automated SQL migration execution."
  },
  "next": {
    "docsPath": "",
    "challengeText": "Review the production checklist and verify all security headers and indexes."
  },
  "proj1": {
    "docsPath": "",
    "challengeText": "Build the complete Blog backend with categories, drafts, auto-slugs, and media."
  },
  "proj2": {
    "docsPath": "",
    "challengeText": "Build the Blog frontend with static generation, rich text, and SEO metadata."
  },
  "capstone": {
    "docsPath": "",
    "challengeText": "Complete all 6 capstone challenges without copying code."
  },
  "ecomm1": {
    "docsPath": "",
    "challengeText": "Implement Products and Orders collections with stock tracking and variants."
  },
  "ecomm2": {
    "docsPath": "",
    "challengeText": "Build the checkout endpoint and Stripe webhook fulfillment handler."
  }
};
