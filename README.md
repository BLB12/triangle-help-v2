# Triangle Help

A local services marketplace for the Raleigh-Durham-Chapel Hill Triangle area. Built with Next.js 15, deployed on Vercel, with Stripe payments and full messaging.

## Features

- 🔍 **Search & Filter** — by category, city, price range, and minimum star rating
- 💳 **Stripe Payments** — $9.99 one-time listing fee, activated via webhook
- 💬 **Messaging** — real-time-style chat between users and service providers
- 🔐 **Auth** — email/password sign up & login via NextAuth v5
- ⭐ **Reviews** — star ratings on listings
- 📊 **Dashboard** — manage your listings, see messages and stats

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth v5 |
| Payments | Stripe Checkout |
| Hosting | Vercel |
| DB Hosting | Neon.tech (recommended, free tier) |

---

## Setup (Local)

### 1. Clone and install
```bash
git clone <your-repo>
cd triangle-help
npm install
```

### 2. Set up your database
Create a free Postgres DB at **[neon.tech](https://neon.tech)** — takes 2 minutes.

Copy the connection string and add to `.env.local`:
```
DATABASE_URL="postgresql://..."
```

### 3. Set up Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys**
3. Copy your test keys into `.env.local`
4. For webhooks locally, install [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook signing secret into `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 4. Fill out `.env.local`
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

Generate your NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Initialize the database
```bash
npx prisma db push
npx prisma generate
```

### 6. Run locally
```bash
npm run dev
```

---

## Deploy to Vercel

### Option A: Vercel Dashboard (easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all env variables from `.env.example` in the Vercel dashboard
4. Deploy!

### Option B: Vercel CLI (VS Code terminal)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### After deploying:
1. Update `NEXTAUTH_URL` to your production URL (e.g. `https://triangle-help.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` to the same
3. Add your production Stripe webhook:
   - Go to Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Project Structure

```
triangle-help/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── search/page.tsx           # Search with filters
│   ├── login/page.tsx            # Sign in
│   ├── signup/page.tsx           # Create account
│   ├── dashboard/page.tsx        # User dashboard
│   ├── listings/
│   │   ├── new/page.tsx          # Create listing
│   │   └── [id]/page.tsx         # Listing detail
│   ├── messages/
│   │   ├── page.tsx              # All conversations
│   │   └── [id]/page.tsx         # Individual chat
│   └── api/
│       ├── auth/                 # NextAuth + signup
│       ├── listings/             # CRUD for listings
│       ├── messages/             # Send + start conversations
│       └── stripe/               # Checkout + webhook
├── components/
│   ├── layout/                   # Navbar, SessionProvider
│   ├── listings/                 # ListingCard, ContactButton
│   ├── filters/                  # SearchFilters
│   └── messaging/                # ChatWindow, ConversationList
├── lib/
│   ├── prisma.ts                 # DB client
│   ├── stripe.ts                 # Stripe client
│   └── utils.ts                  # Helpers, categories
├── prisma/
│   └── schema.prisma             # Full data model
└── vercel.json                   # Vercel config
```

---

## Customization

**Change the listing fee:** Edit `LISTING_FEE` in `lib/stripe.ts`

**Add categories:** Edit the `ServiceCategory` enum in `prisma/schema.prisma` and the `CATEGORIES` array in `lib/utils.ts`

**Change branding/colors:** Edit `tailwind.config.ts` — the `brand` color is the main green

**Change location copy:** Search for "Triangle" / "Raleigh" in the codebase

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `NEXTAUTH_URL` | Your app URL (http://localhost:3000 locally) |
| `NEXTAUTH_SECRET` | Random secret (run: `openssl rand -base64 32`) |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → API Keys |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | From Stripe CLI or Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_APP_URL` | Your app URL (same as NEXTAUTH_URL) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same as STRIPE_PUBLISHABLE_KEY |
