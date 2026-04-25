# 🚀 Hoorab's Collection — Complete Deployment Guide
## Go live in ~1 hour, zero cost to start

---

## STEP 1 — Create Your Supabase Database (10 min)

1. Go to **https://supabase.com** → click "Start your project" → sign up free
2. Click **"New Project"** → name it `hoorabscollection` → set a database password → click Create
3. Wait ~2 minutes for it to build
4. Go to **SQL Editor** (left sidebar) → click **"New Query"**
5. Open the file `supabase/migrations/001_schema.sql` from this project
6. Copy ALL the text → paste it into the SQL Editor → click **"Run"**
7. You should see "Success. No rows returned"

**Get your keys:**
- Go to **Settings → API** in Supabase
- Copy: `Project URL`, `anon public` key, `service_role` key (keep secret!)

**Set up Storage for product images:**
- Go to **Storage** → click **"New Bucket"** → name it `product-images`
- Click the bucket → **Policies** → Add policy → "Give anon users SELECT access"
- Add another policy → "Give authenticated users INSERT access"

---

## STEP 2 — Set Up Stripe Payments (10 min)

1. Go to **https://stripe.com** → sign up → complete business verification
2. Go to **Developers → API Keys**
3. Copy your **Publishable key** (pk_live_...) and **Secret key** (sk_live_...)

**Set up Webhook (so orders get created automatically):**
1. Go to **Developers → Webhooks** → click "Add endpoint"
2. URL: `https://hoorabscollection.com/api/stripe/webhook`
3. Events to listen for: select `checkout.session.completed`
4. Copy the **Signing secret** (whsec_...)

> 💡 Use test keys (pk_test_ / sk_test_) first to test, then switch to live

---

## STEP 3 — Set Up Resend Email (5 min)

1. Go to **https://resend.com** → sign up free
2. Go to **API Keys** → "Create API Key" → copy it
3. Go to **Domains** → add your domain (or use onboarding@resend.dev for testing)

---

## STEP 4 — Deploy to Vercel (10 min)

1. Go to **https://github.com** → sign up → click **"New Repository"**
2. Name it `hoorabscollection` → create it

3. Install Git on your computer if needed (https://git-scm.com)
4. Open Terminal / Command Prompt in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Hoorab's Collection"
git remote add origin https://github.com/YOUR-USERNAME/hoorabscollection.git
git push -u origin main
```

5. Go to **https://vercel.com** → sign up with GitHub → click "New Project"
6. Import your `hoorabscollection` repository
7. Click **"Environment Variables"** and add these one by one:

```
NEXT_PUBLIC_SUPABASE_URL          = (from Supabase Step 1)
NEXT_PUBLIC_SUPABASE_ANON_KEY     = (from Supabase Step 1)
SUPABASE_SERVICE_ROLE_KEY         = (from Supabase Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = (from Stripe Step 2)
STRIPE_SECRET_KEY                  = (from Stripe Step 2)
STRIPE_WEBHOOK_SECRET              = (from Stripe Step 2)
RESEND_API_KEY                     = (from Resend Step 3)
EMAIL_FROM                         = orders@hoorabscollection.com
ADMIN_EMAIL                        = your-email@gmail.com
NEXT_PUBLIC_SITE_URL               = https://hoorabscollection.com
NEXT_PUBLIC_WHATSAPP_NUMBER        = 4487662193
```

8. Click **Deploy** → wait ~3 minutes
9. Your site is LIVE! 🎉

---

## STEP 5 — Update Stripe Webhook URL (2 min)

1. Go back to Stripe → Developers → Webhooks
2. Edit your webhook endpoint URL to your actual Vercel URL:
   `https://hoorabscollection.com/api/stripe/webhook`

---

## STEP 6 — Add Your First Product (5 min)

1. Visit `https://your-site.vercel.app/admin` → log in with your ADMIN_EMAIL
2. Click **+ Add Product**
3. Fill in name, price, category, upload photos, select colours and sizes
4. Toggle **Featured** on → click **Create Product**
5. Visit your shop — your product is live!

---

## STEP 7 — Get a Custom Domain (optional, £10/year)

1. Buy a domain at **https://namecheap.com** (e.g. hoorabscollection.co.uk)
2. In Vercel → your project → **Settings → Domains** → add your domain
3. Follow the DNS instructions Vercel gives you
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to your new domain
5. Update the Stripe webhook URL too

---

## DAILY USE — How to Manage Your Shop

### Adding products:
→ Visit `/admin` → Products → Add Product

### Processing orders:
→ Visit `/admin` → Orders → change status to Confirmed/Shipped/Delivered
→ Customer gets an automatic email at each step

### Running a promotion:
→ Visit `/admin` → Promotions → Create Promo → set code like `EID25` for 25% off

### Emailing all members:
→ Visit `/admin` → Members → Email Members → write your message → Send

### Seeing new enquiries:
→ Visit `/admin` → Enquiries → reply via WhatsApp or email directly

---

## HELP & SUPPORT

- **Supabase docs:** https://supabase.com/docs
- **Vercel docs:** https://vercel.com/docs
- **Stripe docs:** https://stripe.com/docs
- **Resend docs:** https://resend.com/docs

---

## Your Costs Once Live

| Service | Free Tier | When You Pay |
|---------|-----------|-------------|
| Vercel | 100GB bandwidth/month free | >100GB |
| Supabase | 500MB database, 1GB storage free | >500MB |
| Resend | 3,000 emails/month free | >3,000 |
| Stripe | No monthly fee | 1.4% + 20p per transaction |
| Domain | N/A | ~£10/year |

**Bottom line: You pay nothing until you start getting orders. Then Stripe takes 1.4% + 20p per sale — that's it.**
