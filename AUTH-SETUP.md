# Team login + Leads dashboard — setup

Phase 2 is built: a private area at **`/dashboard`** (Overview + Leads inbox),
protected by Supabase Auth with **Admin** and **Team Member** roles. Public
signup is intentionally off — you create team accounts in Supabase.

## 1. Create your login (2 min)

1. In Supabase → **Authentication → Users → Add user → Create new user**.
2. Enter your **email** + a **password**, and tick **"Auto Confirm User"** (so
   you can log in straight away without a confirmation email).
3. Click **Create user**. A matching row is auto-created in the `profiles`
   table with role `team_member`.

Now visit **`http://localhost:3035/dashboard`** → you'll be sent to `/login` →
sign in → you're in. Any leads in the `leads` table show up under **Leads**,
where you can search, filter, and change each lead's status (New → Contacted →
Quoted → Booked → Installed → Lost).

## 2. Make yourself an Admin (optional, 30 sec)

Everyone can view and work leads. "Admin" unlocks admin-only features later
(user management, editing experiments). To promote your account, run this in
Supabase → **SQL Editor** (change the email):

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@installpros.co.uk');
```

## 3. Make password-reset emails work (when you need them)

For the **Forgot password** flow, Supabase needs to allow your site's URLs:
- Supabase → **Authentication → URL Configuration**
  - **Site URL:** `http://localhost:3035` (local) — change to your live domain later.
  - **Redirect URLs:** add `http://localhost:3035/**` (and your live domain `/**`).

Supabase's built-in email works for testing (low limits). For production, add
your own SMTP under Authentication → Emails.

## What's in the dashboard

- **Overview** — KPI cards (total leads, new/unworked, last 7 days, conversion
  rate) + pipeline-by-status and top-traffic-source breakdowns.
- **Leads** — full table (desktop) / cards (mobile): name, contact, postcode,
  service, source, date, and an inline **status picker** that saves instantly.
- **Marketing** and **Experiments** are stubbed in the sidebar as the next
  phases.

Every screen has proper loading, empty, and error states, and is mobile-responsive.

## For production (Vercel)

The same env vars from `.env.local` must be set in Vercel. Also update the
Supabase **Site URL / Redirect URLs** to your live domain, and set
`NEXT_PUBLIC_SITE_URL` to `https://get.installpros.co.uk`.
