# GitHub Pages Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Initialize Git Repository

```bash
cd /Users/shinojcm/.gemini/antigravity/scratch/httq-protocol

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HTTQ Protocol v1.0"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `httq-protocol` (or `httq`)
3. Description: "HyperText Transfer Quantum - Post-quantum cryptographic protocol"
4. Public repository
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/httq-protocol.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Build and deployment":
   - Source: **GitHub Actions**
5. The workflow will automatically deploy!

### Step 5: Access Your Site

After ~2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/httq-protocol/
```

---

## Manual Deployment (Alternative)

If you prefer manual deployment:

### Step 1: Build Static Files

```bash
# Create dist directory
mkdir -p dist

# Copy demo files
cp -r src/demo/public/* dist/

# Copy documentation
cp README.md dist/
```

### Step 2: Enable GitHub Pages (Manual)

1. Go to repository Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **dist**
4. Click "Save"

---

## Verify Deployment

### Check Workflow Status

1. Go to "Actions" tab in your repository
2. You should see "Deploy to GitHub Pages" workflow
3. Wait for green checkmark ✅

### Test Your Site

Visit: `https://YOUR_USERNAME.github.io/httq-protocol/`

You should see:
- ✅ Minimal black & white design
- ✅ Interactive demo
- ✅ Security level selector
- ✅ Real-time handshake visualization
- ✅ Performance benchmarks

---

## Custom Domain (Optional)

### Add Custom Domain

1. Buy a domain (e.g., `httq.org`)
2. Add CNAME record pointing to: `YOUR_USERNAME.github.io`
3. In GitHub Settings → Pages:
   - Custom domain: `httq.org`
   - Enforce HTTPS: ✅

### DNS Configuration

```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

---

## Troubleshooting

### Issue: 404 Error

**Solution**: 
- Check that GitHub Pages is enabled
- Verify source is set to "GitHub Actions"
- Wait 2-3 minutes for deployment

### Issue: Workflow Failed

**Solution**:
- Go to Actions tab
- Click on failed workflow
- Check error logs
- Usually permissions issue - verify Pages permissions are enabled

### Issue: Demo Not Working

**Solution**:
- Open browser console (F12)
- Check for JavaScript errors
- Verify all files are in `dist/` folder

---

## Update Your Site

After making changes:

```bash
# Make your changes
# ...

# Commit and push
git add .
git commit -m "Update: description of changes"
git push

# GitHub Actions will automatically redeploy!
```

---

## Performance Optimization

### Enable Caching

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Minify Assets

```bash
npm install -g html-minifier clean-css-cli uglify-js

# Minify HTML
html-minifier --collapse-whitespace --remove-comments dist/index.html -o dist/index.html

# Minify CSS
cleancss -o dist/styles.min.css dist/styles.css

# Minify JS
uglifyjs dist/app.js -o dist/app.min.js
```

---

## Analytics (Optional)

### Add Google Analytics

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## SEO Optimization

Already included in `index.html`:
- ✅ Meta description
- ✅ Title tags
- ✅ Semantic HTML
- ✅ Heading hierarchy

### Add sitemap.xml

Create `dist/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://YOUR_USERNAME.github.io/httq-protocol/</loc>
    <lastmod>2025-12-30</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Success Checklist

- [ ] Git repository initialized
- [ ] Pushed to GitHub
- [ ] GitHub Pages enabled (GitHub Actions)
- [ ] Workflow completed successfully
- [ ] Site accessible at GitHub Pages URL
- [ ] Demo works (handshake, benchmarks)
- [ ] Design is minimal black & white
- [ ] All links work
- [ ] Mobile responsive

---

## Next Steps

1. **Share your site**: Tweet, LinkedIn, Reddit
2. **Add to README**: Include live demo link
3. **Submit to directories**: Product Hunt, Hacker News
4. **Get feedback**: Share with community
5. **Iterate**: Improve based on feedback

---

**Your HTTQ Protocol demo is now live! 🚀🔐⚛️**

Live at: `https://YOUR_USERNAME.github.io/httq-protocol/`
