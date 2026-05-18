# 🚀 Vercel Environment Variables Setup

Your deployment is live but showing a blank page because **environment variables are not set in Vercel**.

## ✅ Quick Fix (2 minutes)

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/ruchingale/my-bookshelf
2. Click on your **my-bookshelf** project

### Step 2: Add Environment Variables

1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Click **Add New** button

### Step 3: Add Variables (add BOTH)

**First Variable:**

- Name: `VITE_SUPABASE_URL`
- Value: `https://rrtjkyyqdpacigerkfln.supabase.co`
- Select all environments: ✓ Production ✓ Preview ✓ Development
- Click **Add**

**Second Variable:**

- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `sb_publishable_etfEdchPgxwrM5eKa9QurA_PZrMlrGq`
- Select all environments: ✓ Production ✓ Preview ✓ Development
- Click **Add**

### Step 4: Redeploy

1. Click **Deployments** (top menu)
2. Click the three dots ⋯ on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete (usually 30-60 seconds)

### Step 5: Verify

- Go to: https://my-bookshelf-eta.vercelapp.com
- You should now see your app! 🎉

---

## ❓ Why This Happens

Vite uses **environment variables at build time**, not runtime. When Vercel builds your app:

- It needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to build the code
- These get injected into the bundled JavaScript during build
- Your local `.env` file exists, but Vercel doesn't have access to it

---

## 📸 Visual Guide

**What you're looking for in Vercel:**

```
Settings → Environment Variables
  ├─ VITE_SUPABASE_URL = https://rrtjkyyqdpacigerkfln.supabase.co
  └─ VITE_SUPABASE_ANON_KEY = sb_publishable_etfEdchPgxwrM5eKa9QurA_PZrMlrGq
```

---

## ✅ Troubleshooting

**Still seeing blank page after redeploy?**

1. **Hard refresh browser:**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - This clears cache

2. **Check browser console (F12):**
   - Any JavaScript errors?
   - Post screenshot if you see errors

3. **Check Vercel build logs:**
   - Go to **Deployments** → click deployment → scroll down for **Build Logs**
   - Look for errors like `VITE_SUPABASE_URL is undefined`

**Build log shows env variables missing?**

- Make sure you saved them in Vercel Settings
- Check that all three environments are selected: ✓ Production, Preview, Development
- Re-deploy again (Step 4 above)

---

## 🎯 What Should Happen

Once variables are set:

1. **Vercel builds your Vite app** with env variables
2. **Build output (dist folder)** is created
3. **Static files are deployed** to Vercel CDN
4. **App loads and connects** to Supabase
5. **You see your books** on the live site

---

## 📋 Checklist

- ✅ Environment variables set in Vercel
- ✅ All three environments selected (Production, Preview, Development)
- ✅ Redeployed after adding variables
- ✅ Waited 60+ seconds for build
- ✅ Hard refreshed browser (Ctrl+Shift+R)
- ✅ App should now show books from Supabase

**Still stuck?** Check Vercel build logs for detailed error messages!
