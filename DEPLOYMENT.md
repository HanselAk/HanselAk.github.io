# Deployment Guide - GitHub Pages

## Quick Deploy (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click **"New repository"** (green button)
3. Repository settings:
   - Name: `senior-design-advisor` (or any name)
   - Description: "AI-powered senior design project advisor"
   - Public
   - ✅ Add README (optional, we have one)
4. Click **"Create repository"**

### Step 2: Upload Files

**Option A: Web Upload (Easiest)**

1. In your new repo, click **"uploading an existing file"**
2. Drag and drop ALL files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. Commit message: "Initial commit - SENIORDESIGN.SYS v2.1"
4. Click **"Commit changes"**

**Option B: Git Command Line**

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - SENIORDESIGN.SYS v2.1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/senior-design-advisor.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **"Pages"** in left sidebar
3. Under "Build and deployment":
   - Source: **"Deploy from a branch"**
   - Branch: **main** / **root**
   - Click **"Save"**
4. Wait 1-2 minutes

### Step 4: Access Your Site

Your app is live at:
```
https://YOUR-USERNAME.github.io/senior-design-advisor/
```

## Testing Checklist

After deployment, verify:

- [ ] Page loads with retro terminal design
- [ ] CRT effects visible (scanlines, glow)
- [ ] Menu buttons work
- [ ] Settings page accessible
- [ ] Can enter API key (test with dummy key)
- [ ] Keyboard shortcuts work (N, S, A, ESC)
- [ ] Color scheme switcher works
- [ ] Console shows no errors (F12)

## Custom Domain (Optional)

### Add Your Own Domain

1. Buy domain from registrar (GoDaddy, Namecheap, etc.)
2. In GitHub repo Settings → Pages
3. Enter domain under "Custom domain"
4. In domain registrar, add DNS records:
   - Type: CNAME
   - Name: www (or @)
   - Value: YOUR-USERNAME.github.io
5. Wait 24-48 hours for DNS propagation

### Free Alternatives

If you don't want to buy a domain:
- Use the free `.github.io` subdomain
- Works perfectly for demos and portfolios

## Alternative Hosting

### Netlify (Also Free)

1. Go to https://netlify.com
2. Sign up (use GitHub account)
3. Click **"Add new site"** → "Import existing project"
4. Connect GitHub repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/` (root)
6. Click **"Deploy"**
7. Done! Get URL like: `your-site.netlify.app`

**Benefits:**
- Instant deploys on git push
- Free HTTPS
- Custom domains
- Form handling (for future features)

### Vercel (Also Free)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"New Project"**
4. Import repository
5. Leave all settings default
6. Click **"Deploy"**
7. Live at: `your-site.vercel.app`

**Benefits:**
- Fast CDN
- Automatic HTTPS
- Preview deployments for branches

## Updating Your Site

### Via GitHub Web

1. Go to repository
2. Click file to edit
3. Click pencil icon
4. Make changes
5. Commit
6. Site updates in 1-2 minutes

### Via Git

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push

# GitHub Pages updates automatically
```

## Common Deployment Issues

### Page Shows 404

**Fix:**
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages shows green checkmark
- Verify `index.html` is in root folder
- Try hard refresh (Ctrl+Shift+R)

### Styling Not Working

**Fix:**
- Check `styles.css` uploaded to same folder as `index.html`
- Verify no typos in `<link>` tag
- Clear browser cache
- Check browser console for 404 errors

### JavaScript Not Running

**Fix:**
- Verify `app.js` uploaded correctly
- Check browser console (F12) for errors
- Ensure `<script src="app.js">` at end of HTML
- Try incognito/private window

### API Calls Failing (CORS)

**Fix:**
- This is normal - Anthropic API allows CORS
- Must use valid API key
- Check API key has credits
- Verify correct API endpoint in code

## Security Best Practices

### Never Commit API Keys

1. Create `.gitignore` file:
```
# API Keys
.env
.env.local
config.js
api-key.txt

# OS Files
.DS_Store
Thumbs.db
```

2. Always enter keys via UI, not hardcode

### Environment Variables (Advanced)

For production deployments with backend:

```javascript
// Use environment variable
const apiKey = process.env.ANTHROPIC_API_KEY;

// Never hardcode!
const apiKey = 'sk-ant-xxxxx'; // DON'T DO THIS
```

But for this static site:
- Users enter their own keys
- Stored in localStorage only
- No server-side needed

## Performance Optimization

### Already Optimized

✅ No build process
✅ Minimal dependencies
✅ Efficient CSS (no frameworks)
✅ Vanilla JS (no React bundle)
✅ Local storage (no DB calls)

### Optional Enhancements

**Add to `index.html` `<head>`:**

```html
<!-- Preload fonts -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" as="style">

<!-- Cache control -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

## Monitoring & Analytics

### Add Google Analytics

1. Get tracking ID from https://analytics.google.com
2. Add before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Track Errors

Add to `app.js`:

```javascript
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Optional: Send to error tracking service
});
```

## Backup & Version Control

### Automatic Backups

Git provides automatic versioning:
- Every commit is a restore point
- Can rollback anytime
- View history in GitHub

### Manual Backup

Download entire repo:
1. Click green **"Code"** button
2. Select **"Download ZIP"**
3. Save locally

### User Data Backup

Users should export their projects:
- Settings → "Export All Projects"
- Saves JSON file locally
- Can re-import later

## Scaling Considerations

### Current Limits

- localStorage: 5-10MB per domain
- GitHub Pages: 1GB total, 100GB/month bandwidth
- Free tier sufficient for 1000s of users

### If You Outgrow

**Backend Option:**
- Add Firebase for cloud storage
- Implement user accounts
- Share projects across devices

**Database Option:**
- MongoDB for project storage
- User authentication
- Team collaboration

But for senior design class: **current setup is perfect** ✅

## Help & Troubleshooting

### GitHub Pages Docs
https://docs.github.com/en/pages

### Anthropic API Docs
https://docs.anthropic.com

### Community Support
- GitHub Issues in your repo
- Stack Overflow (tag: github-pages)
- GitHub Community Forums

---

## Final Checklist

Before sharing your deployed site:

- [ ] Site loads at GitHub Pages URL
- [ ] All pages accessible
- [ ] API integration works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] README updated with your URL
- [ ] Repository description set
- [ ] License file included
- [ ] .gitignore configured
- [ ] Test with fresh browser (no cache)

## Share Your Work

Once deployed, share:

**Direct Link:**
```
https://YOUR-USERNAME.github.io/senior-design-advisor/
```

**Repository:**
```
https://github.com/YOUR-USERNAME/senior-design-advisor
```

Perfect for:
- Class demonstrations
- Portfolio projects
- Resume links
- Social media sharing

---

**Deployment Complete! 🚀**

Your AI-powered senior design advisor is now live and ready to help students worldwide.
