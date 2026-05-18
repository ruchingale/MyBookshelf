# 🔧 MyShelf - Supabase Setup Walkthrough

## The Error You're Seeing

```
TypeError: Failed to fetch
```

**Why?** Your database isn't created yet.

**Fix?** Follow these exact steps.

---

## 📍 STEP 1: Go to Supabase

Open this URL in your browser:

```
https://rrtjkyyqdpacigerkfln.supabase.co
```

You should see the Supabase dashboard. If you need to sign in, use your Supabase account credentials.

---

## 📍 STEP 2: Find SQL Editor

Look at the **LEFT SIDEBAR** of the Supabase dashboard.

You should see these menu items (from top to bottom):

```
🏠 Home
📊 SQL Editor          ← ✓ CLICK THIS ONE
📋 Table Editor
💾 Database
📦 Storage
...
```

Click on **SQL Editor**.

---

## 📍 STEP 3: Create New Query

You should now see the SQL Editor page. It looks like a code editor with a blank area.

In the top-left, you should see a button that says:

```
New Query     +
```

Click **"New Query"** (or the **+** button).

---

## 📍 STEP 4: Open Your SQL File

In VS Code (or your file explorer):

1. Open the folder: `d:\Users\Ruchi\Desktop\Myshelf`
2. Find the file: **`SUPABASE_SETUP.sql`**
3. Open it with VS Code or any text editor

You should see SQL code that starts with:

```sql
-- Create books table for MyShelf
CREATE TABLE IF NOT EXISTS public.books (
...
```

---

## 📍 STEP 5: Copy the SQL

1. In VS Code, select ALL the code in `SUPABASE_SETUP.sql`
   - Use: **Ctrl + A** (or Cmd + A on Mac)
2. Copy it:
   - Use: **Ctrl + C** (or Cmd + C on Mac)

---

## 📍 STEP 6: Paste Into Supabase

1. Go back to your browser with Supabase open
2. Click in the **white code editor area** (the blank query area)
3. Paste the SQL code:
   - Use: **Ctrl + V** (or Cmd + V on Mac)

You should now see the SQL code in the Supabase editor.

---

## 📍 STEP 7: Run the SQL

Look for a **green button** in the top-right area. It should say:

```
▶ Run    (or    ▶ Execute)
```

Click it.

---

## 📍 STEP 8: Check for Success

After clicking Run, you should see:

```
✓ executed successfully
```

This message should appear somewhere in green text below the query.

If you see red text with an error, something went wrong. Share the error message.

---

## 📍 STEP 9: Verify Tables Were Created

1. In the LEFT SIDEBAR, click **"Table Editor"**
2. You should see a list of tables. Look for:
   ```
   books        ← ✓ This should be there now
   ```
3. Click on **"books"** to see its columns

You should see these columns:

- id
- title
- author
- genre
- status
- rating
- review
- cover_url
- created_at
- updated_at

If you see these columns, **your database is set up correctly!** ✅

---

## 📍 STEP 10: Verify Storage Bucket

1. In the LEFT SIDEBAR, click **"Storage"**
2. You should see a bucket named:
   ```
   covers       ← ✓ This should be there now
   ```
3. Make sure it shows "PUBLIC" next to it

If you see this, **your storage is set up correctly!** ✅

---

## 📍 STEP 11: Go Back to Your App

1. Open your browser to:
   ```
   http://localhost:5173
   ```
2. Press **F5** or **Refresh** to reload the page

---

## 📍 STEP 12: Test It

1. Click the **"+ Add Book"** button
2. Fill in the form:
   - Title: `The Hobbit`
   - Author: `J.R.R. Tolkien`
   - Genre: `Fantasy`
   - Status: `Want to Read`
   - Leave other fields blank or as default
3. Click **"Add Book"** button

**It should now work!** ✅

If you see the book added to your library, **you're all set!** 🎉

---

## ❌ If It Still Doesn't Work

### Check 1: Is the SQL showing as successfully run?

- Did you see ✓ executed successfully message?
- If NO: The SQL had an error. Share the error message.
- If YES: Move to Check 2.

### Check 2: Does the books table exist?

- In Table Editor, do you see the "books" table?
- If NO: Run the SQL again (maybe it didn't execute).
- If YES: Move to Check 3.

### Check 3: Open Browser Developer Tools

1. Press **F12** (or Cmd+Option+I on Mac)
2. Go to the **Console** tab
3. Try adding a book again
4. Look for red error messages
5. Copy the full error message
6. Share it with all the context

### Check 4: Hard Refresh Your Browser

1. Close the browser tab with your app
2. Reopen: http://localhost:5173
3. Try adding a book again

---

## ⚠️ Important Notes

- ✅ Do this setup **only ONCE** - after this, your database persists
- ✅ The SQL file is **idempotent** - you can run it multiple times safely
- ✅ After this setup, you can add unlimited books
- ✅ Make sure you're logged into the correct Supabase account
- ✅ Make sure you're using the same Supabase project (the one with your URL)

---

## 🎉 Success Indicators

After completing these steps, you should be able to:

- ✅ Add a book without errors
- ✅ See the book appear in your library
- ✅ See the book card displayed
- ✅ See the 3D bookshelf working
- ✅ Add multiple books

---

## 📞 Troubleshooting Summary

| Problem                     | What to Check                                    |
| --------------------------- | ------------------------------------------------ |
| Still see "Failed to fetch" | Did you run the SQL? Did you see ✓ success?      |
| SQL gave an error           | Copy the error message and troubleshoot it       |
| Can't find SQL Editor       | Look for 📊 icon in left sidebar                 |
| Can't find the button       | It's usually in the top-right corner             |
| Not sure what URL to use    | It's: https://rrtjkyyqdpacigerkfin.supabase.co   |
| App still doesn't work      | Open F12 Console and try again - share the error |

---

## Next: You Can Now...

After the database is set up:

1. Add books freely
2. Upload custom cover images
3. View 3D bookshelf
4. Filter and search books
5. Leave ratings and reviews
6. Deploy to Vercel

See other guide files for more steps!

---

**Last Step:** Go to https://rrtjkyyqdpacigerkfin.supabase.co and run that SQL! 🚀
