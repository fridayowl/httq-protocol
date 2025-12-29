# GitHub Actions Workflow Documentation

## Overview

The HTTQ Protocol uses GitHub Actions for automatic deployment to GitHub Pages. Every time you push code to the `main` branch, the site automatically rebuilds and deploys.

---

## Workflow File

**Location**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build static site
        run: |
          mkdir -p dist
          cp -r src/demo/public/* dist/
          cp README.md dist/
          
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## How It Works

### 1. **Trigger Events**

The workflow runs when:
- **Push to main**: Automatically deploys when you push code
- **Manual trigger**: Can be triggered manually from Actions tab

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:  # Allows manual trigger
```

### 2. **Permissions**

Required permissions for deployment:
```yaml
permissions:
  contents: read      # Read repository contents
  pages: write        # Write to GitHub Pages
  id-token: write     # Generate deployment token
```

### 3. **Build Job**

**Steps**:

#### Step 1: Checkout Code
```yaml
- name: Checkout
  uses: actions/checkout@v4
```
Downloads your repository code to the runner.

#### Step 2: Setup Node.js
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
```
Installs Node.js v18 for building.

#### Step 3: Install Dependencies
```yaml
- name: Install dependencies
  run: npm install
```
Installs packages from `package.json`.

#### Step 4: Build Static Site
```yaml
- name: Build static site
  run: |
    mkdir -p dist
    cp -r src/demo/public/* dist/
    cp README.md dist/
```
Creates `dist/` folder with:
- All files from `src/demo/public/` (HTML, CSS, JS)
- README.md for documentation

#### Step 5: Upload Artifact
```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```
Packages the `dist/` folder for deployment.

### 4. **Deploy Job**

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

**What it does**:
- Waits for build job to complete (`needs: build`)
- Deploys artifact to GitHub Pages
- Sets deployment URL

---

## Viewing Workflow Runs

### 1. **Actions Tab**
Visit: https://github.com/fridayowl/httq-protocol/actions

You'll see:
- List of all workflow runs
- Status (✅ Success, ❌ Failed, 🟡 In Progress)
- Duration of each run

### 2. **Workflow Details**

Click on any workflow run to see:
- **Build job**: All build steps and logs
- **Deploy job**: Deployment status
- **Artifacts**: Built files

### 3. **Logs**

Click on any step to see detailed logs:
```
Run npm install
added 98 packages in 2.5s
```

---

## Manual Deployment

### Trigger Manually

1. Go to: https://github.com/fridayowl/httq-protocol/actions
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select branch: `main`
5. Click "Run workflow"

---

## Troubleshooting

### Issue: Workflow Not Running

**Check**:
1. GitHub Pages is enabled (Settings → Pages)
2. Source is set to "GitHub Actions"
3. Workflow file exists at `.github/workflows/deploy.yml`

### Issue: Build Failed

**Common causes**:
1. **Missing files**: Check that `src/demo/public/` exists
2. **npm install failed**: Check `package.json` is valid
3. **Permissions**: Verify workflow has correct permissions

**Solution**:
- Check workflow logs in Actions tab
- Look for error messages
- Fix the issue and push again

### Issue: Deployment Failed

**Common causes**:
1. **Pages not enabled**: Enable in Settings → Pages
2. **Wrong source**: Must be "GitHub Actions"
3. **Permissions**: Check repository settings

---

## Customizing the Workflow

### Add Build Steps

To add preprocessing (minification, etc.):

```yaml
- name: Build static site
  run: |
    mkdir -p dist
    cp -r src/demo/public/* dist/
    cp README.md dist/
    
    # Add custom build steps
    npm run build        # If you have a build script
    npm run minify       # Minify assets
```

### Add Testing

```yaml
- name: Run tests
  run: npm test
```

### Add Linting

```yaml
- name: Lint code
  run: npm run lint
```

### Deploy to Different Branch

```yaml
on:
  push:
    branches:
      - main
      - develop  # Also deploy from develop branch
```

---

## Performance Optimization

### 1. **Cache Dependencies**

Add caching to speed up builds:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2. **Parallel Jobs**

Run tests in parallel with build:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
  
  build:
    runs-on: ubuntu-latest
    needs: test  # Only build if tests pass
    steps:
      # ... build steps
```

---

## Deployment Timeline

Typical deployment takes **~2 minutes**:

1. **Trigger** (0s): Push to main
2. **Queue** (5-10s): Wait for runner
3. **Build** (30-60s): Install deps, build site
4. **Deploy** (30-60s): Upload and deploy
5. **Live** (2-5s): Site is live!

---

## Monitoring

### 1. **Status Badge**

Add to README.md:

```markdown
[![Deploy](https://github.com/fridayowl/httq-protocol/actions/workflows/deploy.yml/badge.svg)](https://github.com/fridayowl/httq-protocol/actions/workflows/deploy.yml)
```

### 2. **Email Notifications**

GitHub sends emails on:
- ❌ Failed deployments
- ✅ Fixed deployments (after failure)

### 3. **Deployment History**

View all deployments:
https://github.com/fridayowl/httq-protocol/deployments

---

## Best Practices

### 1. **Test Locally First**

Before pushing:
```bash
# Test the build
mkdir -p dist
cp -r src/demo/public/* dist/
open dist/index.html
```

### 2. **Use Branches**

Develop on feature branches:
```bash
git checkout -b feature/new-feature
# Make changes
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR, merge to main
```

### 3. **Semantic Commits**

Use clear commit messages:
```bash
git commit -m "feat: Add new security level"
git commit -m "fix: Correct handshake timing"
git commit -m "docs: Update README"
```

---

## Advanced Configuration

### Environment Variables

Add secrets in Settings → Secrets:

```yaml
- name: Build with API key
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: npm run build
```

### Multiple Environments

Deploy to staging and production:

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # ... deploy to staging
  
  deploy-production:
    if: github.ref == 'refs/heads/main'
    # ... deploy to production
```

---

## Workflow Status

### Check Current Status

```bash
# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch live
gh run watch
```

---

## Summary

The GitHub Actions workflow:
- ✅ **Automatically deploys** on every push to main
- ✅ **Builds static site** from `src/demo/public/`
- ✅ **Deploys to GitHub Pages** in ~2 minutes
- ✅ **Provides logs** for debugging
- ✅ **Can be triggered manually** from Actions tab

**Your site updates automatically every time you push!** 🚀

---

## Next Steps

1. **Monitor**: Check Actions tab after each push
2. **Optimize**: Add caching for faster builds
3. **Test**: Add automated tests to workflow
4. **Customize**: Modify workflow for your needs

---

**Workflow Location**: `.github/workflows/deploy.yml`  
**Actions URL**: https://github.com/fridayowl/httq-protocol/actions  
**Deployments**: https://github.com/fridayowl/httq-protocol/deployments
