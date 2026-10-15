// scratch/builder_projects.js
module.exports = [
  {
    id: "proj1",
    m: "Project: Blog",
    t: "Blog part 1 – schema & backend",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["project", "blog", "schema", "categories", "backend"],
    c: `
<p class="lead">In this hands-on project, we will architect a production-grade publication platform with author profiles, nested categories, auto-slugification, draft/published workflows, and image optimization.</p>

<h2>Step 1: Categories Collection</h2>
<div class="cb"><div class="fn">src/collections/Categories.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'category',
      maxDepth: 1,
    },
  ],
}</code></pre></div>

<h2>Step 2: Posts Collection with Revalidation Hooks</h2>
<div class="cb"><div class="fn">src/collections/Posts.ts</div><pre><code>import type { CollectionConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
  },
  versions: {
    maxPerDoc: 25,
    drafts: { autosave: true, schedulePublish: true },
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (data?.title && (!data.slug || operation === 'create')) {
          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        if (doc._status === 'published') {
          revalidatePath('/blog')
          revalidatePath(\`/blog/\${doc.slug}\`)
          revalidateTag('posts')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
  ],
}</code></pre></div>
`
  },
  {
    id: "proj2",
    m: "Project: Blog",
    t: "Blog part 2 – frontend",
    r: ["all", "frontend"],
    difficulty: "intermediate",
    tags: ["project", "blog", "frontend", "ssg", "seo"],
    c: `
<p class="lead">Connect your Next.js App Router frontend to Payload's Local API with Static Site Generation (SSG), dynamic OpenGraph metadata, and Lexical rich text rendering.</p>

<h2>Dynamic Post Route with <code>generateStaticParams</code></h2>
<div class="cb"><div class="fn">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    select: { slug: true },
    pagination: false,
  })
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs: [post] } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
  })
  if (!post) return {}
  return {
    title: \`\${post.title} | Acme Engineering\`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs: [post] } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
  })

  if (!post) notFound()

  return (
    &lt;article className="max-w-4xl mx-auto py-12 px-4"&gt;
      &lt;h1 className="text-4xl font-extrabold mb-4"&gt;{post.title}&lt;/h1&gt;
      &lt;div className="prose lg:prose-xl mt-8"&gt;
        &lt;RichText data={post.content} /&gt;
      &lt;/div&gt;
    &lt;/article&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "capstone",
    m: "Project: Blog",
    t: "Blog capstone challenge",
    r: ["all"],
    difficulty: "advanced",
    tags: ["capstone", "challenge", "advanced", "fullstack"],
    c: `
<p class="lead">Consolidate your mastery by building an enterprise editorial publication system covering roles, dynamic block builders, live previews, and automated testing.</p>

<h2>Capstone Requirements Checklist</h2>
<div class="tbl"><table>
  <thead><tr><th>Module</th><th>Requirements</th><th>Verification</th></tr></thead>
  <tbody>
    <tr><td><b>Access Control</b></td><td>Implement <code>admin</code>, <code>editor</code>, and <code>author</code> roles. Authors can only edit their own drafts.</td><td>Run role-based Vitest unit tests.</td></tr>
    <tr><td><b>Page Builder</b></td><td>Build a polymorphic <code>layout</code> blocks field with Hero, Callout, and Code Snippet blocks.</td><td>Create dynamic multi-block landing page.</td></tr>
    <tr><td><b>Live Preview</b></td><td>Configure real-time iframe preview with desktop and mobile responsive viewport toggles.</td><td>Verify live edits sync via postMessage.</td></tr>
    <tr><td><b>Cloud Storage</b></td><td>Mount S3 or Cloudflare R2 adapter for media assets.</td><td>Upload high-res banner image to cloud bucket.</td></tr>
    <tr><td><b>SEO Plugin</b></td><td>Install <code>@payloadcms/plugin-seo</code> with auto-generated OG images.</td><td>Inspect <code>&lt;meta property="og:image"&gt;</code> in HTML head.</td></tr>
  </tbody>
</table></div>
`
  },
  {
    id: "ecomm1",
    m: "Project: E-commerce",
    t: "E-commerce part 1 – catalog & cart",
    r: ["all", "backend"],
    difficulty: "intermediate",
    badge: "new",
    tags: ["ecommerce", "products", "inventory", "orders", "cart"],
    c: `
<p class="lead">Build a scalable e-commerce catalog featuring product variants, dynamic pricing in cents, inventory stock tracking, and orders management.</p>

<h2>Products Collection with Inventory Tracking</h2>
<div class="cb"><div class="fn">src/collections/Products.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'priceInCents', type: 'number', required: true, min: 0 },
    { name: 'inventoryStock', type: 'number', defaultValue: 0, min: 0 },
    { name: 'sku', type: 'text', unique: true },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'active', 'archived'],
      admin: { position: 'sidebar' },
    },
  ],
}</code></pre></div>
`
  },
  {
    id: "ecomm2",
    m: "Project: E-commerce",
    t: "E-commerce part 2 – checkout API & webhooks",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["stripe", "checkout", "webhooks", "payments", "orders"],
    c: `
<p class="lead">Implement a secure checkout flow with server-side price validation, Stripe PaymentIntents, inventory deduction transactions, and Stripe webhook fulfillment.</p>

<h2>Custom Checkout Endpoint Handler</h2>
<div class="cb"><div class="fn">src/endpoints/createCheckoutSession.ts</div><pre><code>import Stripe from 'stripe'
import type { PayloadHandler } from 'payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export const createCheckoutSession: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { items } = (await req.json()) as {
    items: Array<{ productId: string; quantity: number }>
  }

  // 1. Always re-fetch prices from DB (NEVER trust client-sent amounts!)
  const validatedItems = await Promise.all(
    items.map(async ({ productId, quantity }) => {
      const product = await req.payload.findByID({ collection: 'products', id: productId })
      if (!product || product.inventoryStock < quantity) {
        throw new Error(\`Insufficient stock for product: \${product?.title}\`)
      }
      return { product, quantity, unitPrice: product.priceInCents }
    })
  )

  const total = validatedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

  // 2. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
    metadata: { userId: req.user.id },
  })

  // 3. Create pending Order in Payload
  const order = await req.payload.create({
    collection: 'orders',
    data: {
      orderNumber: 'ORD-' + Date.now(),
      customer: req.user.id,
      totalAmount: total,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      items: validatedItems.map((i) => ({
        product: i.product.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    },
  })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  })
}</code></pre></div>
`
  }
];
