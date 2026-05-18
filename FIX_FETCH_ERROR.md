# 🚀 MyShelf - Fix the "Failed to fetch" Error

## The Problem

You're getting **"TypeError: Failed to fetch"** when trying to add a book. This means your React app is working, but the backend (Supabase database) isn't initialized yet.

## The Root Cause

Your Supabase database schema hasn't been created. The `SUPABASE_SETUP.sql` file exists in your project, but it hasn't been executed in your Supabase account yet.

## ✅ The Fix (Do This Now - Takes 5 Minutes)

### Step 1: Open Supabase Dashboard

```
https://rrtjkyyqdpacigerkfin.supabase.co
```

### Step 2: Run the SQL Schema

1. In the left sidebar, click **SQL Editor**
2. Click **New Query** button
3. **Copy** the entire contents of `SUPABASE_SETUP.sql` from your project folder
4. **Paste** it into the Supabase SQL editor
5. Click the **Run** button (green play icon)
6. You should see: ✓ `executed successfully`

### Step 3: Verify Everything Was Created

Go to **Table Editor** in the left sidebar and verify:

- ✓ You see a `books` table
- ✓ The table has these columns: `id`, `title`, `author`, `genre`, `status`, `rating`, `review`, `cover_url`, `created_at`, `updated_at`

Go to **Storage** in the left sidebar and verify:

- ✓ You see a `covers` bucket
- ✓ It's marked as public

### Step 4: Test Your App

1. Go back to your app: http://localhost:5173
2. **Refresh the page** (F5 or Cmd+R)
3. Click "Add Book"
4. Fill in the form and click "Add Book"
5. **It should now work!** 🎉

---

## 🔍 If You Still Get the Error

### Check the Error Details

1. Open your browser developer tools: **F12**
2. Go to the **Console** tab
3. Try adding a book again
4. Look for any red error messages
5. **Copy the full error message and share it**

### Check the Network Request

1. Open developer tools: **F12**
2. Go to the **Network** tab
3. Try adding a book
4. Look for a request that shows a red ✗
5. Click on it and check the **Response** tab

---

## 📋 Verification Checklist

Before you try adding a book, verify ALL of these:

- [ ] Supabase credentials in `.env` are correct:
  - VITE_SUPABASE_URL: `https://rrtjkyyqdpacigerkfin.supabase.co`
  - VITE_SUPABASE_ANON_KEY: `sb_publishable_etfEdchPgxwrM5eKa9QurA_PZrMlrGq`
- [ ] You've run `SUPABASE_SETUP.sql` in Supabase SQL Editor
- [ ] The `books` table exists in Supabase
- [ ] The `covers` bucket exists in Supabase
- [ ] Your browser is refreshed after running the SQL
- [ ] You're using the correct Supabase account

---

## What Each Component Does

| File                              | Purpose              | Status                     |
| --------------------------------- | -------------------- | -------------------------- |
| `.env`                            | Supabase credentials | ✓ Configured               |
| `src/lib/supabase.js`             | Supabase client      | ✓ Ready                    |
| `src/components/AddBookModal.jsx` | Book form            | ✓ Ready                    |
| `SUPABASE_SETUP.sql`              | Database schema      | ⚠️ **NOT YET RUN**         |
| Supabase dashboard                | Backend database     | ⚠️ **NOT YET INITIALIZED** |

---

## Common Issues & Solutions

### Issue: "relation 'public.books' does not exist"

**Solution:** Run SUPABASE_SETUP.sql in Supabase SQL Editor

### Issue: "storage bucket not found"

**Solution:** Run SUPABASE_SETUP.sql (it creates the storage bucket too)

### Issue: Page refreshes but still can't add book

**Solution:** Close and reopen the browser tab, then try again

### Issue: Different error message

**Solution:** Check F12 Console tab for the full error, then troubleshoot based on that error

---

## How to Find the Supabase SQL Editor

1. Open: https://rrtjkyyqdpacigerkfin.supabase.co
2. Look at the left sidebar
3. You should see this menu:
   - 🏠 Home
   - 📊 SQL Editor ← **Click here**
   - 📋 Table Editor
   - 💾 Database
   - 📦 Storage
   - ... (other options)

4. Click "SQL Editor"
5. Click "New Query" (or the + button)
6. You'll see an empty query editor
7. Paste your SQL there and click "Run"

---

## Next Steps After It Works

Once you can add books successfully:

1. ✅ Add a few test books
2. ✅ Try uploading a custom cover image
3. ✅ Test the 3D bookshelf view
4. ✅ Try the 2D card grid view
5. ✅ Test filtering by status and genre
6. ✅ Try deleting a book
7. ✅ Deploy to Vercel (see DEPLOYMENT_GUIDE.md)

---

## Still Stuck?

If you've followed all the steps and still get an error:

1. ✅ You've run SUPABASE_SETUP.sql
2. ✅ You've verified the books table exists
3. ✅ You've refreshed your browser
4. ✅ You're using the correct credentials

Then:

1. Open F12 Developer Tools
2. Go to Console tab
3. Try adding a book
4. Copy the full error message
5. Share it with detailed info about what you've tried

---

## What SUPABASE_SETUP.sql Does

When you run this SQL file, it:

```sql
✓ Creates the books table with proper columns
✓ Adds constraints for data validation
✓ Enables Row Level Security (RLS)
✓ Creates policies for public access
✓ Creates the storage bucket for book covers
✓ Sets up permissions for the storage bucket
```

All of this is **necessary** for the app to work!

---

## Important: One-Time Setup

**This setup only needs to be done ONCE.** After you run the SQL and create the storage bucket, you never need to do it again. Your database will persist and grow as you add books.

---

**Ready?** Go run that SQL file now! 🚀
