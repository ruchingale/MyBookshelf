#!/bin/bash
# MyShelf - Setup and Run Commands

# ===================================
# 1. INSTALL DEPENDENCIES
# ===================================
npm install

# ===================================
# 2. SETUP SUPABASE
# ===================================
# Step 1: Go to https://supabase.com and create a new project
# Step 2: In Supabase Dashboard:
#   - Copy the Project URL and Anon Key
#   - Update .env with these values
# Step 3: Run SQL Setup in Supabase SQL Editor:
#   - Go to SQL Editor → New Query
#   - Copy all contents from SUPABASE_SETUP.sql and paste it
#   - Run the query
# Step 4: Create storage bucket:
#   - Go to Storage → New Bucket
#   - Name: "covers"
#   - Check "Public bucket"
#   - Create

# ===================================
# 3. CONFIGURE ENVIRONMENT
# ===================================
# Run this to copy example env:
cp .env.example .env

# Then edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ===================================
# 4. START DEVELOPMENT SERVER
# ===================================
npm run dev

# The app will open at http://localhost:5173
# Hot reload is enabled - changes auto-refresh

# ===================================
# 5. BUILD FOR PRODUCTION
# ===================================
npm run build

# The build output will be in the dist/ folder
# Ready to deploy to Vercel

# ===================================
# 6. PREVIEW PRODUCTION BUILD
# ===================================
npm run preview

# ===================================
# VERIFY SETUP
# ===================================
# To verify everything is working:
# 1. Check .env has correct Supabase credentials
# 2. Check Supabase has "books" table and "covers" storage bucket
# 3. In dev server, try adding a book
# 4. Check browser console (F12) for any errors

# ===================================
# DEPLOYMENT TO VERCEL
# ===================================
# 1. Push to GitHub:
#    git add .
#    git commit -m "Initial commit"
#    git push origin main

# 2. Go to vercel.com and import the GitHub repo
# 3. Set environment variables in Vercel dashboard:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 4. Deploy button

# ===================================
# TROUBLESHOOTING
# ===================================
# Books not loading?
#   - Check browser console (F12) for errors
#   - Verify .env credentials
#   - Ensure books table exists in Supabase
#   - Check Network tab to see API requests

# Covers not showing?
#   - Verify covers bucket is PUBLIC in Supabase
#   - Check Storage > covers bucket settings
#   - Try uploading a test image

# 3D view not working?
#   - Check browser console for WebGL errors
#   - Ensure your browser supports WebGL
#   - Try Chrome/Firefox on a desktop
#   - Disable hardware acceleration if issues persist
