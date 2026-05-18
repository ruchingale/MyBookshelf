# MyShelf Troubleshooting Guide

## Issue: "TypeError: Failed to fetch" when adding a book

### ✅ Solution (Quick Fix - 5 minutes)

Your Supabase database hasn't been set up yet. Follow these steps:

#### Step 1: Run Supabase SQL Setup

1. Go to your Supabase dashboard: https://rrtjkyyqdpacigerkfin.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `SUPABASE_SETUP.sql` from your project
5. Copy the ENTIRE contents
6. Paste into the Supabase SQL editor
7. Click the **Run** button (green play button)
8. You should see ✓ success messages

#### Step 2: Verify in Supabase

After running the SQL:

- Go to **Table Editor** in Supabase left sidebar
- You should see the `books` table with columns: id, title, author, genre, status, rating, review, cover_url, created_at, updated_at
- You should also see `covers` under **Storage** buckets

#### Step 3: Test Your App

1. Refresh your browser (http://localhost:5173)
2. Try adding a book again
3. **It should now work!** ✅

---

### 🔍 If You Still Get an Error

#### Check Browser Console for Detailed Error

1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Try adding a book again
4. Look for error messages in red
5. Screenshot and share the error details

#### Check Network Request

1. Press **F12** to open Developer Tools
2. Click the **Network** tab
3. Try adding a book
4. Look for a failed request to your Supabase URL
5. Click on it and check the **Response** tab for error details

---

### 🛠️ Manual Verification Checklist

- [ ] Supabase URL is correct: `https://rrtjkyyqdpacigerkfin.supabase.co`
- [ ] Supabase Anon Key is in `.env` file
- [ ] `SUPABASE_SETUP.sql` has been run in Supabase SQL Editor
- [ ] `books` table exists in Supabase Table Editor
- [ ] `covers` bucket exists in Supabase Storage
- [ ] Browser is refreshed after SQL setup
- [ ] No network errors in F12 Network tab

---

### 📝 What the SQL Setup Does

The `SUPABASE_SETUP.sql` file:

1. ✅ Creates the `books` table with proper schema
2. ✅ Enables Row Level Security (RLS)
3. ✅ Creates RLS policy for public read access
4. ✅ Creates the `covers` storage bucket
5. ✅ Sets up storage policies for public access

---

### ✨ Debugging Steps (Advanced)

If you need more debugging info, you can check the detailed error in the modal:

1. The error message now shows: `Failed to add book: [detailed error]`
2. Check the browser console (F12) for full error logs
3. Look at Supabase logs: Dashboard → Logs → API requests

---

### 💡 Common Issues & Fixes

| Issue                                    | Solution                                               |
| ---------------------------------------- | ------------------------------------------------------ |
| "relation 'public.books' does not exist" | Run SUPABASE_SETUP.sql in SQL Editor                   |
| "storage bucket not found"               | Run SUPABASE_SETUP.sql (includes bucket creation)      |
| "CORS error"                             | Supabase should handle this - wait 30 seconds, refresh |
| "Failed to fetch" with no details        | Press F12, check Console tab for full error            |
| App loads but can't add books            | Database table doesn't exist - run SQL setup           |

---

## Next Steps After Fixing

1. ✅ Add a test book to verify it works
2. ✅ Try switching between 3D and 2D views
3. ✅ Test the filtering functionality
4. ✅ Try uploading a custom cover image
5. ✅ Test deleting a book

---

## Need More Help?

1. Check this troubleshooting guide first
2. Check the browser console (F12) for error messages
3. Verify Supabase tables/buckets exist
4. Make sure you ran SUPABASE_SETUP.sql
5. If still stuck, share the error message from the console
