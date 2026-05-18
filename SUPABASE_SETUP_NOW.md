# 🚀 Setup Supabase Database - DO THIS NOW!

Your app is deployed and loading, but the database isn't set up yet!

## ✅ Step-by-Step Setup

### Step 1: Go to Supabase Dashboard

```
https://supabase.com
Sign in with your account
```

### Step 2: Open Your Project

- Click on: **rrtjkyyqdpacigerkfln** (your project)

### Step 3: Create the `books` Table

Go to **SQL Editor** and run this:

```sql
-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT,
  status TEXT DEFAULT 'Want to Read',
  rating INTEGER,
  review TEXT,
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (for now)
CREATE POLICY "Enable read access for all users" ON books
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON books
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON books
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON books
  FOR DELETE USING (true);
```

**Steps:**

1. Open SQL Editor in Supabase
2. Create New Query
3. **Copy the entire SQL above**
4. **Paste** into the editor
5. Click **Run** (green button)
6. You should see ✅ "Success"

### Step 4: Create Storage Bucket

1. In Supabase, click **Storage** (left sidebar)
2. Click **Create New Bucket**
3. Name: `covers`
4. **CHECK:** "Public Bucket" ✓
5. Click **Create**

### Step 5: Refresh Your App

Go back to: https://my-bookshelf2.vercel.app

**You should now see:**

- ✅ "MyShelf" title
- ✅ "Add Book" button
- ✅ Books grid
- ✅ Everything working!

---

## 🎯 Quick Checklist

- [ ] Logged into Supabase
- [ ] Ran the SQL to create `books` table
- [ ] Created `covers` storage bucket (public)
- [ ] Refreshed the deployed app
- [ ] See books and can add new ones! 🎉

---

## ❌ If Still Not Working

**Check browser console (F12 → Console):**

- Any red errors?
- Screenshot them!

**Check Supabase:**

- Go to Table Editor
- Do you see `books` table? ✓
- Does it have any test data?

**Check environment variables in Vercel:**

- Settings → Environment Variables
- Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set? ✓

---

**Do this SQL setup RIGHT NOW and your app will work! 🚀**
