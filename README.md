# 📚 MyShelf - Personal E-Library

A beautiful, interactive personal e-library web app built with React, Three.js, and Supabase. Manage your book collection with dual 3D and 2D views, add books easily, and track your reading progress.

## ✨ Features

- **🎨 Dual Views**: Switch between an interactive 3D bookshelf and a 2D card grid
- **📦 3D Bookshelf**: Interactive Three.js scene with hover animations and realistic lighting
- **🏷️ Book Management**: Add, view, and delete books with detailed metadata
- **⭐ Ratings & Reviews**: Rate books 1-5 stars and write personal reviews
- **📖 Status Tracking**: Track reading status (Want to Read, Reading, Read)
- **🔍 Filtering**: Filter books by status and genre
- **🎯 Smart Cover Images**: Auto-fetch from Open Library API or upload custom covers
- **🌙 Dark Theme**: Beautiful dark UI with glassmorphism effects
- **⚡ Real-time Sync**: Instant database updates

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **3D**: React Three Fiber + Drei + Three.js
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router
- **Deploy**: Vercel

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier works great)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd myshelf
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the Supabase dashboard, run the SQL from `SUPABASE_SETUP.sql`:
   - Go to SQL Editor → New Query
   - Paste the entire contents of `SUPABASE_SETUP.sql`
   - Click "Run"
3. Create a storage bucket named `covers`:
   - Go to Storage → New Bucket
   - Name: `covers`
   - Check "Public bucket"
   - Click "Create Bucket"

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in Supabase Dashboard → Settings → API

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📖 Usage

### Adding Books

1. Click "+ Add Book" button
2. Fill in book details:
   - Title & Author (required)
   - Genre, Status, Rating
   - Optional review and cover image
3. If no cover uploaded, auto-fetches from Open Library API
4. Click "Add Book" to save

### Browsing Books

**3D View** (Default):

- Rotate: Drag to move camera
- Zoom: Scroll wheel
- Click any book: View details
- Auto-rotates when idle

**2D View**:

- Click toggle to switch to card grid
- Filter by status and genre
- Click any card to view details

### Managing Books

- Click any book to open detail modal
- View full details, rating, and review
- Delete books with the delete button (confirm required)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── BookShelf3D.jsx       # 3D bookshelf with Three.js
│   ├── BookCard.jsx          # 2D card component
│   ├── AddBookModal.jsx      # Add book form
│   ├── BookDetailModal.jsx   # Book detail & delete
│   └── FilterBar.jsx         # Filter controls
├── lib/
│   ├── supabase.js          # Supabase client config
│   └── bookUtils.js         # Utility functions
├── pages/
│   └── Library.jsx          # Main page
├── App.jsx                  # Router setup
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## 🗄️ Database Schema

**books table**:

- `id` (UUID, primary key)
- `title` (text, required)
- `author` (text, required)
- `genre` (text, one of: Fiction, Non-Fiction, Sci-Fi, Fantasy, Mystery, Biography, History, Self-Help, Other)
- `status` (text: want_to_read, reading, read)
- `rating` (integer, 1-5)
- `review` (text, optional)
- `cover_url` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Select your GitHub repo
4. Configure:
   - Framework: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --offwhite: #f5f0e8; /* Main text color */
}
```

Edit Tailwind classes in components for accent colors (currently amber-600).

### Adjust Bookshelf Layout

In `BookShelf3D.jsx`:

- `const perRow = 8` - books per shelf (change this number)
- Shelf spacing controlled by `y` position math

### Auto-rotate Speed

In `BookShelf3D.jsx`:

- `autoRotateSpeed={0.5}` - increase for faster, decrease for slower

## 🐛 Troubleshooting

### Books not loading

- Check Supabase connection in browser console
- Verify `.env` credentials
- Ensure `books` table exists in Supabase

### Covers not showing

- Check Supabase Storage `covers` bucket is public
- Verify storage permissions in Supabase dashboard

### 3D view not rendering

- Check browser console for WebGL errors
- Ensure your GPU supports WebGL
- Try a different browser

## 📝 License

MIT

## 🤝 Support

For issues or questions, check the GitHub repo or Supabase docs.

Happy reading! 📚✨
