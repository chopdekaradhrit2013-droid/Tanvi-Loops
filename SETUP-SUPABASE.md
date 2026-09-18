# Set up Supabase for Tanvi Loops

Do this once. After this, admin uploads appear for every customer.

## 1. Create a free project

1. Open https://supabase.com and sign in (GitHub login is fine).
2. New project → name it `tanvi-loops`.
3. Set a database password. Wait until the project is ready.

## 2. Run the SQL

1. In the left sidebar open **SQL Editor**.
2. Click **New query**.
3. Paste everything from `supabase/setup.sql`.
4. Click **Run**.

## 3. Copy the two keys

1. Open **Project Settings → API**.
2. Copy **Project URL**.
3. Copy the **anon public** key.

## 4. Add keys on Vercel

In the Vercel project `tanvi-loops` add:

- `VITE_SUPABASE_URL` = the Project URL
- `VITE_SUPABASE_ANON_KEY` = the anon public key

Then redeploy.

Or send those two values here and they can be added for you.

## 5. Check it worked

Admin dashboard should say: **Supabase connected — uploads sync to every customer.**
Then upload the 3 homepage photos again.
