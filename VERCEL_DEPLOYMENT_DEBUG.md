# ✅ Vercel Deployment - Troubleshooting Guide

## Current Status

✅ **App deployed successfully** - No build errors
✅ **Running locally** - Works perfectly on your computer  
⚠️ **Vercel showing black page** - Environment variables or data loading issue

## 🔍 Debug Steps

### Step 1: Check Browser Console on Vercel

1. Go to: https://my-bookshelf2.vercel.app
2. Press **F12** (Open DevTools)
3. Click **Console** tab
4. You should see:
   - **Green:** ✅ "Supabase credentials loaded successfully"
   - **Red:** ❌ Any error messages?

### Step 2: Check Network Tab

1. Still in F12
2. Click **Network** tab
3. Refresh the page (F5)
4. Look for:
   - Any requests showing RED (failed)
   - Request to `supabase.co` - did it succeed?
   - Click on failed requests to see error details

### Step 3: Check if Books Exist

1. In browser console, type:

```javascript
// This will show you if there's any data
localStorage.debug = "*";
location.reload();
```

### Step 4: Verify Environment Variables in Vercel

1. Go to: https://vercel.com/ruchingale/my-bookshelf2
2. Click **Settings**
3. Click **Environment Variables**
4. Both variables showing? ✓
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## ⚡ Quick Fix: Force Rebuild

Sometimes Vercel caches old builds. Try this:

1. Go to: https://vercel.com/ruchingale/my-bookshelf2
2. Click **Deployments**
3. Find latest deployment
4. Click the **three dots (⋯)**
5. Click **Redeploy**
6. Wait 60 seconds
7. Hard refresh (Ctrl+Shift+R)

---

## 🆘 Common Issues & Fixes

### Issue: "TypeError: Cannot read property 'select' of undefined"

**Cause:** Supabase client not loading
**Fix:** Check console for "Supabase credentials loaded successfully"

### Issue: Black page but no errors

**Cause:** Books table empty OR RLS policy blocking reads
**Fix:**

- Check Supabase Table Editor - does `books` table exist?
- Check if any books show up there
- Verify RLS policies allow SELECT

### Issue: Books load locally but not on Vercel

**Cause:** Environment variables not in Vercel OR different Supabase project
**Fix:**

- Verify VITE_SUPABASE_URL matches your project
- Verify VITE_SUPABASE_ANON_KEY is correct
- Redeploy after changing variables

---

## 📋 My Checklist

- [ ] Opened deployed app in browser
- [ ] Opened F12 console
- [ ] Saw "✅ Supabase credentials loaded successfully"
- [ ] No red errors in console
- [ ] Checked Network tab - all requests succeeded
- [ ] Saw books loading OR "No books found" message
- [ ] App working! 🎉

---

## 🚀 If All Else Fails

Let me see a screenshot of:

1. Your **browser console** (F12 → Console) showing any errors
2. Your **Supabase Table Editor** showing the `books` table with data
3. Your **Vercel deployment logs**

Then I can help directly!

---

**Share your findings and I'll help get this working! 💪**
