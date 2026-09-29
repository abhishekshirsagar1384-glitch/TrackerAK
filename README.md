# My Tracker — mobile-first PWA

This is a self-contained prototype for a personal tracker.

## Included
- Daily habits with one-tap completion
- Daily numeric/count targets (+ / -)
- Checklists
- Deadlines / countdowns
- Streak tracking
- Daily completion dashboard
- Local device storage
- JSON backup/export and restore/import
- PWA install support
- Offline shell through a service worker

## Run locally

A service worker normally needs HTTP(S), so use a small local server instead of opening index.html directly.

### Option A: Python
```bash
cd personal_tracker
python -m http.server 8000
```
Then open:
http://localhost:8000

### Option B: Node
```bash
npx serve .
```

## Use on Android
1. Put these files on any HTTPS host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).
2. Open the website in Chrome on your Android phone.
3. Use Chrome's "Install app" / "Add to Home screen".
4. The app opens in a standalone window.

## Important
This first version stores data on the device/browser. It does NOT sync between multiple devices yet.

## Good next step
Add a cloud database + user account so the same tracker data syncs between phone, laptop and multiple browsers. Supabase or Firebase would work well.

## APK path later
Once the PWA is stable, it can be wrapped with Capacitor to produce an Android APK/AAB without rebuilding the UI from scratch.
