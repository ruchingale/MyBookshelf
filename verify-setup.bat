@echo off
REM MyShelf Setup Verification Script
REM Run this to verify your Supabase setup is complete

echo.
echo ====================================
echo MyShelf Setup Verification
echo ====================================
echo.

echo [1] Checking .env file...
if exist ".env" (
    echo ✓ .env file exists
    findstr "VITE_SUPABASE_URL" .env >nul
    if errorlevel 1 (
        echo ✗ VITE_SUPABASE_URL not found in .env
    ) else (
        echo ✓ VITE_SUPABASE_URL is set
    )
    findstr "VITE_SUPABASE_ANON_KEY" .env >nul
    if errorlevel 1 (
        echo ✗ VITE_SUPABASE_ANON_KEY not found in .env
    ) else (
        echo ✓ VITE_SUPABASE_ANON_KEY is set
    )
) else (
    echo ✗ .env file not found
)

echo.
echo [2] Checking project files...
if exist "src\components\AddBookModal.jsx" (
    echo ✓ AddBookModal.jsx exists
) else (
    echo ✗ AddBookModal.jsx not found
)

if exist "src\lib\supabase.js" (
    echo ✓ supabase.js exists
) else (
    echo ✗ supabase.js not found
)

if exist "SUPABASE_SETUP.sql" (
    echo ✓ SUPABASE_SETUP.sql exists
) else (
    echo ✗ SUPABASE_SETUP.sql not found
)

echo.
echo [3] Next Steps:
echo.
echo 1. Go to: https://rrtjkyyqdpacigerkfin.supabase.co
echo 2. Click SQL Editor in left sidebar
echo 3. Click "New Query"
echo 4. Open SUPABASE_SETUP.sql and copy all contents
echo 5. Paste into the SQL Editor
echo 6. Click the Run button (green play icon)
echo.
echo 7. After SQL runs successfully:
echo    - Verify "books" table exists in Table Editor
echo    - Verify "covers" bucket exists in Storage
echo.
echo 8. Refresh your browser at http://localhost:5173
echo 9. Try adding a book - it should now work!
echo.
echo ====================================
echo For more help, see: TROUBLESHOOTING.md
echo ====================================
echo.
pause
