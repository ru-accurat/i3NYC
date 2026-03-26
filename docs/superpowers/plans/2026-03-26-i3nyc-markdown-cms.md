# I3NYC Markdown-Based CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate www.i3nyc.org as a Next.js site with inline markdown editing, Vercel Blob media storage, and simple admin auth.

**Architecture:** Next.js 16 App Router with Server Components for public pages. Content stored as markdown files in Vercel Blob (read at request time, no redeploy needed for edits). TipTap editor provides inline WYSIWYG editing that serializes to/from markdown. Simple env-based password auth with HTTP-only session cookie. Images served from Vercel Blob.

**Tech Stack:** Next.js 16, React 19, shadcn/ui (new-york, dark mode), TipTap editor, Vercel Blob, `gray-matter` (frontmatter), `react-markdown` + `remark-gfm` (rendering), Geist fonts, Tailwind CSS 4.

---

## Content Architecture

Each page's content is a markdown file with YAML frontmatter, stored in Vercel Blob under a `content/` prefix. Example:

```markdown
---
title: About Us
description: Learn about I3/NYC
sections:
  - id: mission
    type: text
  - id: leadership
    type: team
---

## Our Mission & Vision

**Mission:** To foster a thriving ecosystem...
```

Images are stored in Vercel Blob under an `images/` prefix. Image references in markdown use Blob URLs directly.

### Content files (seeded from scraped data):

| Blob key | Page |
|----------|------|
| `content/home.md` | Homepage — hero, stats, mission, partners CTA |
| `content/about-us.md` | About — mission/vision, why NYC, leadership, team, partners |
| `content/what-we-do.md` | What We Do — 5 initiative descriptions, partner logos |
| `content/membership.md` | Membership — benefits, tiers, partnership CTA |
| `content/events.md` | Events — upcoming section, past events list |
| `content/contact-us.md` | Join Us — contact form / CTA |

### Structured data (JSON in frontmatter):

Some pages have structured data that doesn't map well to pure prose markdown (team members, event cards, membership tiers). These live in frontmatter arrays and are rendered by dedicated React components. The inline editor handles them via custom TipTap nodes.

---

## File Structure

```
i3nyc/
├── app/
│   ├── layout.tsx                  # Root layout: Geist fonts, nav, footer, auth provider
│   ├── page.tsx                    # Homepage (Server Component, reads content/home.md)
│   ├── about-us/page.tsx           # About page
│   ├── what-we-do/page.tsx         # What We Do page
│   ├── membership/page.tsx         # Membership page
│   ├── events/page.tsx             # Events page
│   ├── contact-us/page.tsx         # Contact/Join Us page
│   ├── admin/
│   │   ├── login/page.tsx          # Login form (Client Component)
│   │   └── actions.ts              # Server Actions: login, logout
│   └── api/
│       ├── content/[slug]/route.ts # GET/PUT markdown content from/to Blob
│       └── upload/route.ts         # POST image upload to Blob
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── site-header.tsx         # Nav bar with logo + links
│   │   ├── site-footer.tsx         # Footer with links, copyright, social
│   │   └── mobile-nav.tsx          # Sheet-based mobile navigation
│   ├── sections/
│   │   ├── hero-section.tsx        # Hero with tagline
│   │   ├── stats-section.tsx       # Statistics grid (5 cards)
│   │   ├── mission-section.tsx     # Mission statement block
│   │   ├── partners-carousel.tsx   # Partner logos carousel/grid
│   │   ├── cta-section.tsx         # Call-to-action banner
│   │   ├── team-grid.tsx           # Leadership/team member cards
│   │   ├── initiative-card.tsx     # What We Do initiative card
│   │   ├── membership-tier.tsx     # Membership tier card
│   │   ├── event-card.tsx          # Past/upcoming event card
│   │   └── benefits-grid.tsx       # Membership benefits grid
│   ├── content-renderer.tsx        # Renders markdown + frontmatter sections
│   └── editor/
│       ├── edit-button.tsx         # Floating "Edit" button (admin only)
│       ├── inline-editor.tsx       # TipTap editor wrapper (Client Component)
│       ├── editor-toolbar.tsx      # Formatting toolbar (bold, italic, headings, etc.)
│       ├── image-upload.tsx        # Image upload within editor
│       └── editor-provider.tsx     # Editor state context (edit mode, saving, etc.)
├── lib/
│   ├── content.ts                  # Read/write markdown from Vercel Blob
│   ├── auth.ts                     # Session cookie helpers (sign, verify)
│   ├── blob.ts                     # Vercel Blob helpers (upload, list, delete)
│   └── utils.ts                    # cn() utility
├── content/                        # Local seed content (used for initial Blob upload)
│   ├── home.md
│   ├── about-us.md
│   ├── what-we-do.md
│   ├── membership.md
│   ├── events.md
│   └── contact-us.md
├── scripts/
│   ├── scrape-content.ts           # Fetch all content + images from i3nyc.org
│   └── seed-blob.ts                # Upload local content/ + images/ to Vercel Blob
├── public/
│   └── i3nyc-logo.svg             # Logo (downloaded from current site)
├── next.config.ts
├── tailwind.config.ts
├── components.json                 # shadcn config
├── package.json
└── .env.local                      # ADMIN_PASSWORD, BLOB_READ_WRITE_TOKEN, SESSION_SECRET
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `tailwind.config.ts`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/gabrielerossi/Desktop/Claude/Claude_Projects/I3NYC
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

- [ ] **Step 2: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

Then fix the Geist font issue in `globals.css` — replace circular `--font-sans: var(--font-sans)` with literal font names:
```css
--font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace;
```

Move font variable classNames from `<body>` to `<html>` in `layout.tsx`.

- [ ] **Step 3: Add shadcn components we'll need**

```bash
npx shadcn@latest add button card badge separator sheet navigation-menu avatar scroll-area skeleton tabs dialog alert-dialog input label tooltip dropdown-menu
```

- [ ] **Step 4: Install content + editor dependencies**

```bash
npm install gray-matter react-markdown remark-gfm @vercel/blob
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-heading @tiptap/pm turndown
npm install -D @types/turndown
```

- [ ] **Step 5: Configure `next.config.ts` for remote images**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 6: Set up `.env.local` template**

Create `.env.example`:
```
ADMIN_PASSWORD=changeme
SESSION_SECRET=generate-a-random-32-char-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Add `.env*.local` to `.gitignore`.

- [ ] **Step 7: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with shadcn/ui and dependencies"
```

---

## Task 2: Content Library — Read/Write Markdown from Vercel Blob

**Files:**
- Create: `lib/content.ts`, `lib/blob.ts`

- [ ] **Step 1: Create `lib/blob.ts` — Vercel Blob helpers**

```ts
import { put, list, del } from '@vercel/blob'

export async function uploadToBlob(pathname: string, body: string | Buffer | ReadableStream, contentType?: string) {
  const blob = await put(pathname, body, {
    access: 'public',
    contentType: contentType ?? 'text/plain',
    addRandomSuffix: false,
  })
  return blob.url
}

export async function readFromBlob(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, limit: 1 })
  const match = blobs.find(b => b.pathname === pathname)
  if (!match) return null
  const res = await fetch(match.url, { next: { revalidate: 0 } })
  return res.text()
}
```

- [ ] **Step 2: Create `lib/content.ts` — markdown content layer**

```ts
import matter from 'gray-matter'
import { readFromBlob, uploadToBlob } from './blob'

export interface PageContent {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
  raw: string
}

const CONTENT_PREFIX = 'content/'

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const raw = await readFromBlob(`${CONTENT_PREFIX}${slug}.md`)
  if (!raw) return null
  const { data, content } = matter(raw)
  return { slug, frontmatter: data, body: content, raw }
}

export async function savePageContent(slug: string, raw: string): Promise<void> {
  await uploadToBlob(`${CONTENT_PREFIX}${slug}.md`, raw, 'text/markdown')
}

export function serializeContent(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify(body, frontmatter)
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts lib/blob.ts && git commit -m "feat: content library for reading/writing markdown from Vercel Blob"
```

---

## Task 3: Auth System — Simple Password Login

**Files:**
- Create: `lib/auth.ts`, `app/admin/login/page.tsx`, `app/admin/actions.ts`

- [ ] **Step 1: Create `lib/auth.ts` — session cookie helpers**

Uses Web Crypto API to sign/verify a session token stored in an HTTP-only cookie. No external auth library needed.

```ts
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'i3nyc_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days

async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return `${payload}.${Buffer.from(sig).toString('base64url')}`
}

async function verify(token: string, secret: string): Promise<string | null> {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = await sign(payload, secret)
  return expected === token ? payload : null
}

export async function createSession(): Promise<void> {
  const secret = process.env.SESSION_SECRET!
  const token = await sign(`admin:${Date.now()}`, secret)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: SESSION_DURATION, path: '/',
  })
}

export async function isAdmin(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET
  if (!secret) return false
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return (await verify(token, secret)) !== null
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
```

- [ ] **Step 2: Create `app/admin/actions.ts` — login/logout Server Actions**

```ts
'use server'

import { redirect } from 'next/navigation'
import { createSession, destroySession } from '@/lib/auth'

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = formData.get('password') as string
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Invalid password' }
  }
  await createSession()
  redirect('/')
}

export async function logoutAction() {
  await destroySession()
  redirect('/')
}
```

- [ ] **Step 3: Create `app/admin/login/page.tsx` — login form**

Simple Card + Input + Button form using shadcn/ui. Uses `useActionState` to handle the Server Action.

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts app/admin/ && git commit -m "feat: simple password-based admin auth with session cookies"
```

---

## Task 4: Site Layout — Header, Footer, Navigation

**Files:**
- Create: `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `components/layout/mobile-nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Download the I3NYC logo**

```bash
curl -o public/i3nyc-logo.svg "https://cdn.prod.website-files.com/671a70dd9361a2b56f6aca48/671a72ebea8e49fc798e89fa_i3nyc-logo-w.svg"
curl -o public/i3nyc-expanded.svg "https://cdn.prod.website-files.com/671a70dd9361a2b56f6aca48/67f93ea2401c84b297cfef1a_i3nyc-expanded.svg"
```

- [ ] **Step 2: Create `site-header.tsx`**

Dark header with logo left, nav links center/right, mobile hamburger. Links: About Us, What We Do, Membership, Events, Join Us. Admin: show subtle "Admin" link if logged in + logout button.

Design notes:
- `bg-background/80 backdrop-blur-sm` sticky header
- Geist Sans, `text-sm font-medium` for nav links
- `text-muted-foreground hover:text-foreground` transitions
- Logo uses `next/image` with the SVG

- [ ] **Step 3: Create `mobile-nav.tsx`**

shadcn `Sheet` (side="left") with nav links, triggered by hamburger button in header on `md:hidden`.

- [ ] **Step 4: Create `site-footer.tsx`**

Footer with: I3NYC logo, tagline "Empowering Italian Innovation on a Global Scale", nav links, LinkedIn icon, copyright, privacy/cookie links.

Design: `bg-card border-t border-border`, compact `text-xs text-muted-foreground`.

- [ ] **Step 5: Update `app/layout.tsx`**

Wire up: Geist fonts, TooltipProvider, SiteHeader, SiteFooter, dark mode class on `<html>`. Pass `isAdmin` status down via a context or prop.

- [ ] **Step 6: Commit**

```bash
git add components/layout/ app/layout.tsx public/ && git commit -m "feat: site layout with header, footer, and mobile navigation"
```

---

## Task 5: Content Renderer — Markdown to React

**Files:**
- Create: `components/content-renderer.tsx`

- [ ] **Step 1: Create content renderer**

Server Component that takes a `PageContent` object and renders:
1. Frontmatter-driven structured sections (team grid, stats, event cards) via dedicated components
2. Prose markdown body via `react-markdown` + `remark-gfm`

Styled with Tailwind typography classes (not `@tailwindcss/typography` plugin — manual styling to match our design system):
- `prose prose-invert` base
- Headings: Geist Sans, `text-foreground`
- Body: `text-muted-foreground`
- Links: `text-primary hover:underline`
- Images: `rounded-lg` via `next/image`

- [ ] **Step 2: Commit**

```bash
git add components/content-renderer.tsx && git commit -m "feat: markdown content renderer with frontmatter section support"
```

---

## Task 6: Section Components — Design System Building Blocks

**Files:**
- Create: all files under `components/sections/`

These are the reusable section components that render structured frontmatter data. Each is a Server Component.

- [ ] **Step 1: Create `hero-section.tsx`**

Full-width section with large heading, optional subtext. Dark gradient background or subtle pattern. Clean, modern — large Geist Sans heading, `text-4xl md:text-6xl font-bold tracking-tight`.

- [ ] **Step 2: Create `stats-section.tsx`**

Grid of 5 stat cards. Each card: large number (`text-3xl font-bold text-primary`), label below (`text-sm text-muted-foreground`). Uses shadcn `Card` with `bg-card`.

- [ ] **Step 3: Create `mission-section.tsx`**

Text block with mission statement. Clean layout, maybe with a left accent border (`border-l-2 border-primary pl-6`).

- [ ] **Step 4: Create `partners-carousel.tsx`**

Grid of partner logos (responsive: 2 cols mobile, 5 cols desktop). Logos use `next/image`, grayscale filter with hover color reveal. Links to partner sites if available.

- [ ] **Step 5: Create `cta-section.tsx`**

Full-width CTA banner: heading + subtext + button. `bg-primary/10` background, centered text.

- [ ] **Step 6: Create `team-grid.tsx`**

Grid of team member cards. Each: avatar (shadcn `Avatar`), name, role. Responsive: 2 cols → 4 cols.

- [ ] **Step 7: Create `initiative-card.tsx`**

Numbered card for What We Do initiatives. Number badge + title + description. Uses `Card` component.

- [ ] **Step 8: Create `membership-tier.tsx`**

Pricing-style card: tier name, price/invite-only badge, feature list, CTA. Highlighted tier gets `border-primary`.

- [ ] **Step 9: Create `benefits-grid.tsx`**

4-column grid of benefit cards with icon + title + description.

- [ ] **Step 10: Create `event-card.tsx`**

Card with optional image, event title, date, description, attendee count. Past events show dimmer styling.

- [ ] **Step 11: Commit**

```bash
git add components/sections/ && git commit -m "feat: section components for homepage, about, membership, events"
```

---

## Task 7: Content API Routes

**Files:**
- Create: `app/api/content/[slug]/route.ts`, `app/api/upload/route.ts`

- [ ] **Step 1: Create `app/api/content/[slug]/route.ts`**

- `GET` — returns the raw markdown for a given slug (public, used by editor)
- `PUT` — saves updated markdown (admin only, checks session cookie)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPageContent, savePageContent } from '@/lib/content'
import { isAdmin } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = await getPageContent(slug)
  if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ raw: content.raw, frontmatter: content.frontmatter, body: content.body })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const { raw } = await req.json()
  await savePageContent(slug, raw)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Create `app/api/upload/route.ts`**

Handles image upload to Vercel Blob. Admin only. Returns the public URL.

```ts
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { isAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const blob = await put(`images/${file.name}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/ && git commit -m "feat: content read/write and image upload API routes"
```

---

## Task 8: Page Implementations — All 6 Pages

**Files:**
- Modify: `app/page.tsx`
- Create: `app/about-us/page.tsx`, `app/what-we-do/page.tsx`, `app/membership/page.tsx`, `app/events/page.tsx`, `app/contact-us/page.tsx`

Each page is a Server Component that:
1. Calls `getPageContent(slug)` to load markdown + frontmatter
2. Renders structured sections from frontmatter
3. Renders prose markdown via `ContentRenderer`
4. Includes `<EditButton slug={slug} />` for admin users

- [ ] **Step 1: Implement `app/page.tsx` (Homepage)**

Sections: HeroSection → StatsSection → MissionSection → PartnersCarousel → CTASection

- [ ] **Step 2: Implement `app/about-us/page.tsx`**

Sections: Hero → MissionVision (prose) → WhyNYC (prose + stats) → TeamGrid (leadership) → TeamGrid (full team) → PartnersCarousel

- [ ] **Step 3: Implement `app/what-we-do/page.tsx`**

Sections: Hero → InitiativeCards (5 numbered cards) → PartnersCarousel

- [ ] **Step 4: Implement `app/membership/page.tsx`**

Sections: Hero → BenefitsGrid → MembershipTiers → Partnership CTA

- [ ] **Step 5: Implement `app/events/page.tsx`**

Sections: Hero → Upcoming Events (or "Stay tuned" placeholder) → Past Events (EventCard grid, reverse chronological)

- [ ] **Step 6: Implement `app/contact-us/page.tsx`**

Sections: Hero → Contact CTA / info (simple — mirrors current site's minimal contact page)

- [ ] **Step 7: Commit**

```bash
git add app/ && git commit -m "feat: implement all 6 pages with content from Vercel Blob"
```

---

## Task 9: Inline Editor — TipTap WYSIWYG

**Files:**
- Create: `components/editor/edit-button.tsx`, `components/editor/inline-editor.tsx`, `components/editor/editor-toolbar.tsx`, `components/editor/image-upload.tsx`, `components/editor/editor-provider.tsx`

This is the core CMS feature. When admin clicks "Edit", the page's rendered content is replaced with a TipTap editor pre-loaded with the markdown content.

- [ ] **Step 1: Create `editor-provider.tsx` — editor state context**

Client Component. Manages: `isEditing`, `isSaving`, `content`, `slug`. Provides `startEditing()`, `save()`, `cancel()`.

- [ ] **Step 2: Create `edit-button.tsx` — floating edit toggle**

Client Component. Fixed-position button (bottom-right). Shows "Edit" pencil icon when not editing, "Save" + "Cancel" when editing. Only rendered when admin is logged in (passed as prop from Server Component).

- [ ] **Step 3: Create `editor-toolbar.tsx` — formatting toolbar**

Sticky toolbar above editor with buttons: Bold, Italic, H1-H3, Bullet List, Ordered List, Link, Image Upload, Code, Quote, Separator. Uses shadcn `Button` + `Tooltip` + `Separator`.

- [ ] **Step 4: Create `image-upload.tsx` — upload within editor**

Handles: click to upload or drag-and-drop. Calls `POST /api/upload`, inserts returned Blob URL as image node in TipTap.

- [ ] **Step 5: Create `inline-editor.tsx` — TipTap wrapper**

Client Component. Initializes TipTap with:
- `StarterKit` (bold, italic, headings, lists, code, blockquote)
- `Image` extension (for uploaded images)
- `Link` extension
- `Placeholder` extension

On mount: converts markdown → HTML (for TipTap input). On save: converts HTML → markdown via `turndown` library, calls `PUT /api/content/[slug]`.

Key UX: editor appears inline where the content was, same width/padding, so it feels like editing the actual page.

- [ ] **Step 6: Wire editor into page layout**

Each page conditionally renders either `<ContentRenderer>` or `<InlineEditor>` based on `isEditing` state from `EditorProvider`.

- [ ] **Step 7: Commit**

```bash
git add components/editor/ && git commit -m "feat: inline TipTap editor with markdown serialization and image upload"
```

---

## Task 10: Content Scraping & Seeding

**Files:**
- Create: `scripts/scrape-content.ts`, `scripts/seed-blob.ts`, `content/*.md`

- [ ] **Step 1: Create `scripts/scrape-content.ts`**

Node script that:
1. Fetches each page of i3nyc.org
2. Extracts text content, structured data (team, events, tiers), and image URLs
3. Downloads all images to `content/images/`
4. Writes markdown files with frontmatter to `content/`

Run: `npx tsx scripts/scrape-content.ts`

- [ ] **Step 2: Review and edit scraped content**

Manually verify each `content/*.md` file. Fix formatting, structure frontmatter arrays (team members, events, tiers) correctly.

- [ ] **Step 3: Create `scripts/seed-blob.ts`**

Node script that uploads everything in `content/` and `content/images/` to Vercel Blob.

```bash
BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/seed-blob.ts
```

- [ ] **Step 4: Commit**

```bash
git add scripts/ content/ && git commit -m "feat: content scraping and Blob seeding scripts"
```

---

## Task 11: Design Polish — Modern Redesign

**Files:**
- Modify: `app/globals.css`, various section components

- [ ] **Step 1: Define color palette in `globals.css`**

Keep zinc base. Accent color derived from I3NYC branding (the blue from their logo). Add custom CSS variables:

```css
--color-primary: oklch(0.55 0.2 250);         /* I3NYC blue accent */
--color-primary-foreground: oklch(0.985 0 0);
```

- [ ] **Step 2: Typography hierarchy**

- Hero: `text-5xl md:text-7xl font-bold tracking-tighter`
- Section headings: `text-3xl font-semibold tracking-tight`
- Body: `text-base text-muted-foreground leading-relaxed`
- Stats numbers: `text-4xl font-bold text-primary tabular-nums` (Geist Mono)
- Labels: `text-xs uppercase tracking-widest text-muted-foreground`

- [ ] **Step 3: Subtle animations**

Add `motion-safe:` transitions: fade-in on scroll for sections, hover scale on cards, smooth background transitions on nav.

- [ ] **Step 4: Responsive audit**

Test all pages at `sm`, `md`, `lg`, `xl`. Ensure grids collapse properly, hero text scales, nav switches to Sheet.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "style: design polish — colors, typography, animations, responsive"
```

---

## Task 12: Deploy to Vercel

**Files:**
- No new files (Vercel auto-detects Next.js)

- [ ] **Step 1: Initialize git repo and push to GitHub**

```bash
git remote add origin git@github.com:<user>/i3nyc.git
git push -u origin main
```

- [ ] **Step 2: Link to Vercel**

```bash
npm i -g vercel
vercel link
```

- [ ] **Step 3: Add Vercel Blob storage**

```bash
vercel integration add blob
vercel env pull
```

- [ ] **Step 4: Set environment variables**

```bash
vercel env add ADMIN_PASSWORD production
vercel env add SESSION_SECRET production
```

- [ ] **Step 5: Run seed script against production Blob**

```bash
BLOB_READ_WRITE_TOKEN=<from .env.local> npx tsx scripts/seed-blob.ts
```

- [ ] **Step 6: Deploy**

```bash
vercel --prod
```

- [ ] **Step 7: Verify**

- All 6 pages render content from Blob
- Admin login works at `/admin/login`
- Inline editing works: edit → save → refresh shows changes
- Image upload works within editor
- Mobile responsive

---

## Design Options to Present

Before building, we should align on the visual direction. Three options:

### Option A: "Minimal Dark" (Recommended)
- Pure dark zinc background, no gradients
- Content-forward with generous whitespace
- Accent: single blue from I3NYC logo
- Cards with subtle `border-border`, no shadows
- Stats in Geist Mono, large and bold
- Partner logos in grayscale, color on hover

### Option B: "Gradient Accent"
- Dark base with subtle gradient accents on hero/CTA sections
- Cards with soft glow borders (`shadow-primary/10`)
- More visual energy, slightly more colorful
- Good for attracting startup audience

### Option C: "Corporate Clean"
- Lighter dark (zinc-900 instead of zinc-950)
- More traditional layout with clear section separators
- Conservative, institutional feel
- Better alignment with consulate/government partners

**Recommendation:** Option A — it's the most timeless and lets the content speak. The I3NYC brand is about credibility and connections, not flash.
