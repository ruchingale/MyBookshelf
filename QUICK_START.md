# 🚀 EXACT COMMANDS TO RUN - Copy & Paste Ready

## ⚡ TL;DR - Quick Start (Copy these commands in order)

### 1. Start Development Server

```bash
npm run dev
```

✓ App opens at http://localhost:5173
✓ You can add and view books immediately

### 2. Build for Production

```bash
npm run build
```

✓ Creates optimized dist/ folder for deployment

### 3. Preview Production Build

```bash
npm run preview
```

✓ Test the production build locally

---

## 📖 Full Command Guide

### IMMEDIATE: Run Development Server

**Option 1: Command Prompt (Windows)**

```cmd
cd d:\Users\Ruchi\Desktop\Myshelf
npm run dev
```

**Option 2: PowerShell (Windows)**

```powershell
cd D:\Users\Ruchi\Desktop\Myshelf
npm run dev
```

**Option 3: Git Bash / WSL (Windows)**

```bash
cd /d/Users/Ruchi/Desktop/Myshelf
npm run dev
```

**Output will show:**

```
VITE v4.4.9  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✓ Browser opens automatically
✓ Start adding books!

### Stop Dev Server

```
Press Ctrl+C in terminal
```

---

## 🔄 WORKFLOW COMMANDS

### Build for Production (Before deploying)

```bash
npm run build
```

Expected output:

```
vite v4.4.9 building for production...
✓ 1234 modules transformed
dist/index.html                   0.45 kB
dist/assets/index-abc123.js      156.78 kB
```

### Test Production Build Locally

```bash
npm run preview
```

Then visit: http://localhost:4173

---

## 📤 GIT & GITHUB COMMANDS

### Initialize Git (if new repo)

```bash
git init
```

### Add All Files

```bash
git add .
```

### Commit Changes

```bash
git commit -m "Initial: MyShelf personal e-library app"
```

### Add Remote GitHub Repo

```bash
git remote add origin https://github.com/YOUR_USERNAME/myshelf.git
```

### Rename to main branch

```bash
git branch -M main
```

### Push to GitHub

```bash
git push -u origin main
```

### Future commits:

```bash
git add .
git commit -m "Your message here"
git push
```

---

## ☁️ DEPLOYMENT COMMANDS

### Deploy to Vercel (Option 1: CLI)

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy
vercel
```

Follow the prompts:

- Scope: personal (or select yours)
- Link to existing project? (no for first time)
- Add environment variables? (yes, add your Supabase keys)

### Manual Deploy (Option 2: Vercel Dashboard)

1. Go to vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your myshelf repo
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://rrtjkyyqdpacigerkfin.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_etfEdchPgxwrM5eKa9QurA_PZrMlrGq
   ```
6. Click "Deploy"

---

## 🔧 MAINTENANCE COMMANDS

### Install New Package

```bash
npm install package-name
```

### Update All Packages

```bash
npm update
```

### Clean Install (start fresh)

```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear npm Cache

```bash
npm cache clean --force
```

### View Installed Packages

```bash
npm list
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Check Node Version

```bash
node --version
```

(Should be 16.0.0 or higher)

### Check npm Version

```bash
npm --version
```

(Should be 7.0.0 or higher)

### Kill Process on Port 5173 (if stuck)

```bash
# Windows - use Task Manager to kill node.exe
# Or use:
lsof -i :5173
kill -9 <PID>

# Or use different port:
npm run dev -- --port 3000
```

### Check Build Errors

```bash
npm run build 2>&1
```

### Verify Supabase Connection

```bash
# In browser console (F12 → Console):
import { supabase } from './src/lib/supabase.js'
supabase.from('books').select('*').then(console.log)
```

---

## 📋 COMPLETE DAILY WORKFLOW

```bash
# 1. Open terminal in project folder
cd d:\Users\Ruchi\Desktop\Myshelf

# 2. Start dev server
npm run dev

# 3. Make changes (auto-reloads)
# 4. Test in browser at http://localhost:5173

# 5. Before committing, test build
npm run build

# 6. Commit if build succeeds
git add .
git commit -m "Feature: [what changed]"
git push

# 7. Vercel auto-deploys on push!
```

---

## ✅ ONE-TIME SETUP CHECKLIST

- [ ] `npm install` - ✓ Already done
- [ ] `.env` configured - ✓ Already done
- [ ] Supabase `books` table created - Need to do once
- [ ] Supabase `covers` bucket created - Need to do once
- [ ] `npm run dev` starts successfully
- [ ] Add test book works
- [ ] Book appears in both views

---

## 🎯 QUICK REFERENCE

| Command               | What it does             | When to use                                |
| --------------------- | ------------------------ | ------------------------------------------ |
| `npm run dev`         | Start development server | Always first to test locally               |
| `npm run build`       | Create production build  | Before deploying                           |
| `npm run preview`     | Test production build    | Verify build works locally                 |
| `npm install`         | Install dependencies     | Already done, only if package.json changes |
| `git add .`           | Stage changes            | Before committing                          |
| `git commit -m "msg"` | Save changes locally     | Regular checkpoints                        |
| `git push`            | Send to GitHub           | Before/after deploying                     |
| `vercel`              | Deploy to Vercel         | When ready to go live                      |

---

## 💡 TIPS

### Hot Reload in Dev Mode

- Edit any file in src/
- Browser auto-refreshes
- No need to restart!

### Check Console for Errors

- Press F12 in browser
- Click Console tab
- Shows all JavaScript errors
- Also shows Supabase requests

### Network Debugging

- Press F12 in browser
- Click Network tab
- Perform action (add book)
- See API requests to Supabase
- Check response codes (200=good, 4xx=error)

### Keyboard Shortcuts

- Ctrl+C - Stop dev server
- Ctrl+L - Clear console
- Ctrl+Shift+K - Delete line (VS Code)
- Ctrl+/ - Comment/uncomment (VS Code)

---

## 🆘 IF STUCK

### Dev server won't start

```bash
npm run dev 2>&1
# Check error message carefully
```

### Can't connect to Supabase

1. Check .env file has correct keys
2. Check Supabase project is active
3. Check internet connection
4. Try: `npm run build` to verify

### Books not saving

1. Open browser console (F12)
2. Try to add a book
3. Look for error messages
4. Check Network tab for failed requests

### 3D view broken

1. Open browser console (F12)
2. Look for WebGL errors
3. Try different browser
4. Check GPU drivers updated

---

## ✨ Success Indicators

When everything works:

✓ `npm run dev` shows no errors  
✓ Browser opens automatically  
✓ App UI loads with dark theme  
✓ Can click "+ Add Book"  
✓ Can add book successfully  
✓ Book appears in 3D view  
✓ Can switch to 2D view  
✓ Book appears in card grid  
✓ Filtering controls work  
✓ Can view book details  
✓ Can delete book

If all ✓, you're ready to deploy! 🚀

---

## 📞 COMMAND CHEAT SHEET

```bash
# Development
npm run dev              # Start
npm run build            # Build
npm run preview          # Preview

# Git
git status               # Check changes
git add .                # Stage all
git commit -m "msg"      # Commit
git push                 # Push to GitHub

# Packages
npm install              # Install all
npm install package      # Add new
npm update               # Update all
npm list                 # Show all

# Cleanup
npm cache clean --force  # Clear cache
rm -rf node_modules      # Remove all

# Deployment
vercel                   # Deploy to Vercel
npm run build            # Build first
```

---

**Everything is ready. Just run:**

```bash
npm run dev
```

**Then enjoy your new e-library! 📚✨**
