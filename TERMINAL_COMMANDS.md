## MyShelf - Complete Terminal Commands Guide

### Prerequisites

- Node.js 16+ installed
- npm installed
- Supabase account created

---

## 1. INSTALLATION

### Install all dependencies

```bash
npm install
```

**Output should show:**

- ✓ 238 packages installed
- ✓ Warnings about vulnerabilities are normal (low priority)
- ✓ Takes about 2-3 minutes on first install

---

## 2. SUPABASE SETUP (One-time, do this FIRST)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Create a new project
4. Note the Project URL and Anon Key

### Step 2: Update .env file

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your credentials
# Windows: Open with Notepad
notepad .env

# Or edit directly:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-actual-key
```

### Step 3: Run SQL Setup (Critical!)

1. Go to Supabase Dashboard
2. Click "SQL Editor" → "New Query"
3. Copy entire contents of `SUPABASE_SETUP.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Should see green ✓ success

### Step 4: Create Storage Bucket

1. In Supabase, go to Storage
2. Click "New Bucket"
3. Name: `covers`
4. CHECK "Public bucket" checkbox
5. Click "Create"

**Verify setup:**

- Go to Table Editor in Supabase
- Should see "books" table with columns: id, title, author, genre, status, rating, review, cover_url, created_at, updated_at
- Go to Storage
- Should see "covers" bucket (PUBLIC)

---

## 3. DEVELOPMENT

### Start Development Server

```bash
npm run dev
```

**Output should show:**

```
  VITE v4.4.9  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Browser will open automatically** at `http://localhost:5173/`

**Features in dev mode:**

- Hot reload (changes auto-refresh)
- Fast refresh (preserves React state)
- Source maps for debugging
- Tailwind classes hot-reload
- Three.js scene updates live

### Stop Dev Server

```bash
# Press Ctrl+C in terminal
```

### Verify Dev Server Working

1. Add a test book
2. See it appear in 3D view
3. Switch to 2D view
4. See filtering works
5. Click a book to see details modal

---

## 4. PRODUCTION BUILD

### Build Optimized Version

```bash
npm run build
```

**Output should show:**

```
  vite v4.4.9 building for production...
  ✓ 1234 modules transformed
  dist/index.html                   0.45 kB
  dist/assets/index-abc123.js      156.78 kB
  dist/assets/index-def456.css      12.34 kB
```

**Files created:**

- `dist/` folder with optimized build
- Ready for deployment

### Preview Production Build Locally

```bash
npm run preview
```

**Testing prod build:**

- More realistic than dev mode
- Slower hot reload (or none)
- Minified code (can't debug easily)
- Same performance as deployed

---

## 5. GIT & GITHUB

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: MyShelf e-library app"
```

### Add Remote Repository

```bash
git remote add origin https://github.com/your-username/myshelf.git
git branch -M main
git push -u origin main
```

### Subsequent Commits

```bash
git add .
git commit -m "Add feature or fix description"
git push
```

---

## 6. DEPLOYMENT TO VERCEL

### Option 1: Vercel CLI (Easiest)

```bash
# Install Vercel CLI globally (one-time)
npm install -g vercel

# Deploy
vercel
```

**Prompts will ask:**

- Scope (personal)
- Project setup (link existing)
- Build settings (auto-detected)
- Environment variables (add them)

### Option 2: Vercel Dashboard

1. Go to vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your GitHub repo
4. Vercel auto-detects Vite settings
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

**After deployment:**

- Get a URL like `https://myshelf-abc123.vercel.app`
- Automatic deploys on git push
- Domain customization available

---

## 7. DEVELOPMENT WORKFLOW

### Daily Development Cycle

**Start work:**

```bash
npm run dev
```

**Make changes:**

- Edit components in src/
- Changes auto-reload in browser
- Check browser console (F12) for errors

**Add new features:**

1. Create/edit component files
2. Hot reload happens automatically
3. Test in both 3D and 2D views

**Before committing:**

```bash
# Check for errors
npm run build

# If build successful, commit
git add .
git commit -m "Feature: [description]"
git push
```

**Deploy:**

- Push to main branch
- Vercel auto-deploys (2-5 minutes)
- Check deployment at your Vercel URL

---

## 8. COMMON COMMANDS REFERENCE

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Create optimized build
npm run preview          # Test production build locally

# Dependencies
npm install              # Install packages
npm install axios        # Add new package
npm update              # Update all packages

# Cleanup
rm -rf node_modules     # Remove dependencies
npm ci                  # Clean install (from lock file)
npm cache clean --force # Clear npm cache

# Git (if using)
git status              # Check changes
git add .               # Stage changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git log                 # View commit history
```

---

## 9. TROUBLESHOOTING

### Port 5173 already in use

```bash
# Kill process using port 5173
lsof -i :5173           # Find process
kill -9 <PID>           # Kill it

# Or use different port
npm run dev -- --port 3000
```

### Dependencies installation fails

```bash
# Clear cache and reinstall
rm package-lock.json
npm cache clean --force
npm install
```

### Build fails

```bash
# Check for errors
npm run build

# Common fixes:
# 1. Check .env variables exist
# 2. Check Supabase table schema
# 3. Clear dist folder: rm -rf dist
# 4. Try again: npm run build
```

### 3D view not rendering

- Check browser console (F12)
- Try different browser (Chrome/Firefox)
- Disable browser hardware acceleration
- Check GPU drivers are up to date

### Books not loading

```bash
# Check browser Network tab (F12)
# Should see API calls to Supabase
# If 403 error: RLS policies issue
# If 404 error: Table doesn't exist
```

---

## 10. NEXT STEPS

1. **Local Development:**
   - Run `npm run dev`
   - Add test books
   - Try features (3D view, filtering, etc.)

2. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Initial: MyShelf project"
   git push origin main
   ```

3. **Deploy to Vercel:**
   - Connect GitHub repo
   - Add environment variables
   - Deploy with one click

4. **Share & Enjoy:**
   - Your app is live!
   - Share the URL
   - Add more features as needed

---

## Quick Reference

**Windows Command Prompt:**

```cmd
cd d:\Users\Ruchi\Desktop\Myshelf
npm install
npm run dev
```

**PowerShell:**

```powershell
cd D:\Users\Ruchi\Desktop\Myshelf
npm install
npm run dev
```

**Git Bash / WSL:**

```bash
cd /d/Users/Ruchi/Desktop/Myshelf
npm install
npm run dev
```

---

**Questions?** Check:

- Browser console (F12) for errors
- Network tab (F12) for API issues
- Supabase dashboard for database status
- README.md for feature docs
