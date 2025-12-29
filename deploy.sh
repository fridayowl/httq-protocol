#!/bin/bash

# HTTQ Protocol - GitHub Deployment Script
# This script helps you deploy HTTQ to GitHub Pages

echo "🔐⚛️ HTTQ Protocol - GitHub Deployment"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Get GitHub username
echo "📝 Enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📝 Enter repository name (default: httq-protocol):"
read REPO_NAME

if [ -z "$REPO_NAME" ]; then
    REPO_NAME="httq-protocol"
fi

echo ""
echo "📋 Deployment Summary:"
echo "  GitHub Username: $GITHUB_USERNAME"
echo "  Repository Name: $REPO_NAME"
echo "  Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "  GitHub Pages URL: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""

echo "❓ Continue with deployment? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote
echo "📡 Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

if [ $? -ne 0 ]; then
    echo "❌ Failed to add remote"
    exit 1
fi

echo "✅ Remote added successfully"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Push failed. This might be because:"
    echo "  1. The repository doesn't exist on GitHub yet"
    echo "  2. You need to authenticate"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Create repository at: https://github.com/new"
    echo "     - Name: $REPO_NAME"
    echo "     - Description: HyperText Transfer Quantum - Post-quantum cryptographic protocol"
    echo "     - Public repository"
    echo "     - Do NOT initialize with README"
    echo ""
    echo "  2. Then run: git push -u origin main"
    echo ""
    exit 1
fi

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "  1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "  2. Under 'Build and deployment':"
echo "     - Source: GitHub Actions"
echo "  3. Wait ~2 minutes for deployment"
echo "  4. Visit: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "📖 For detailed instructions, see: docs/GITHUB_PAGES_DEPLOY.md"
