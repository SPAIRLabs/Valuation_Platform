# 🚀 Deploy SPAIRL X VAL to GitHub Pages

## ✅ What's Been Configured

All necessary files have been set up for GitHub Pages deployment:

- ✅ `.gitignore` - Excludes sensitive data and unwanted files
- ✅ `.github/workflows/deploy.yml` - Automated deployment workflow
- ✅ `vite.config.ts` - Production build configuration
- ✅ `package.json` - Deploy scripts added

## 📋 Step-by-Step Deployment Guide

### Step 1: Prepare Your GitHub Repository

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `SPAIRL-X-VAL` (or your preferred name)
   - Set to **Public** (required for free GitHub Pages)
   - Do NOT initialize with README (we'll push existing code)

2. **Update the base path in `vite.config.ts`**
   - Open `document-editor/vite.config.ts`
   - Change line 9: `base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',`
   - Replace `YOUR-REPO-NAME` with your actual repository name

### Step 2: Initialize Git and Push to GitHub

```bash
# Navigate to your project root
cd "d:/SPAIRL/SPAIRL X VAL"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SPAIRL X VAL Document Editor"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR-USERNAME/SPAIRL-X-VAL.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Click **Save**

### Step 4: Automatic Deployment

The GitHub Actions workflow will automatically:
1. Detect the push to `main` branch
2. Install dependencies
3. Build the React app
4. Deploy to GitHub Pages

**View deployment status:**
- Go to your repository
- Click **Actions** tab
- Watch the deployment progress

### Step 5: Access Your Live Site

Once deployment completes (2-3 minutes), your site will be live at:

```
https://YOUR-USERNAME.github.io/SPAIRL-X-VAL/
```

## 🔒 Security: Files NOT Uploaded

The `.gitignore` file ensures these sensitive files are **NEVER** uploaded:

### Data Files (Protected)
- ❌ `Data/document_logs.csv` - Document history
- ❌ `Data/users.csv` - User credentials
- ❌ `Data/UpdatedDocuments/*.docx` - Processed documents
- ❌ `Data/Photos/*.jpg` - Property photos

### Reference Files (Protected)
- ❌ `Reference Files/**/*.docx` - Template documents

### System Files (Protected)
- ❌ `node_modules/` - Dependencies
- ❌ `.env` - Environment variables
- ❌ `*.log` - Log files

### What WILL Be Uploaded
- ✅ Source code (React components)
- ✅ Configuration files
- ✅ Build scripts
- ✅ Documentation
- ✅ Public assets

## ⚠️ Important Notes

### Note 1: Backend API
This deployment is **frontend only**. The backend API (`server.js`) will NOT run on GitHub Pages.

**For full functionality, you need:**
- Frontend: GitHub Pages ✅
- Backend: Deploy separately to:
  - Heroku
  - Render
  - Railway
  - Vercel (Serverless functions)
  - Your own server

### Note 2: Data Storage
Since the backend is not deployed:
- Document uploads won't work
- CSV logging won't work
- File saving won't work

**Solutions:**
1. Use GitHub Pages for **demo/preview only**
2. Deploy backend separately (see backend deployment guide)
3. Use Firebase/Supabase for data storage

### Note 3: Google Maps API
- The Google Maps API key is hardcoded in `LocationPicker.tsx`
- Consider using environment variables for production
- Monitor API usage in Google Cloud Console

## 🔄 Update Deployment

To update your deployed site:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

GitHub Actions will automatically rebuild and redeploy (2-3 minutes).

## 🛠️ Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Navigate to document-editor folder
cd document-editor

# Install gh-pages package
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

This will:
1. Build the project
2. Push to `gh-pages` branch
3. Deploy automatically

## 📱 Testing Before Deploy

Test the production build locally:

```bash
cd document-editor

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:4173 to test the production build.

## 🐛 Troubleshooting

### Issue 1: 404 Error After Deployment

**Problem:** Site shows 404 or blank page

**Solution:**
1. Check `vite.config.ts` base path matches repo name
2. Ensure it ends with `/`: `/SPAIRL-X-VAL/`
3. Rebuild and redeploy

### Issue 2: Assets Not Loading

**Problem:** Images, CSS, or JS not loading

**Solution:**
1. Check browser console for errors
2. Verify base path in `vite.config.ts`
3. Ensure all imports use relative paths

### Issue 3: Deployment Failed

**Problem:** GitHub Actions workflow fails

**Solution:**
1. Check Actions tab for error details
2. Verify `package.json` has all dependencies
3. Check if `package-lock.json` exists in repo
4. Ensure Node.js version is compatible

### Issue 4: Backend Features Not Working

**Problem:** Upload, save, or API calls fail

**Solution:**
This is expected! GitHub Pages only serves static files.

**Options:**
1. Deploy backend separately (Heroku, Render, etc.)
2. Use this for demo/preview only
3. Implement client-side storage (localStorage)

## 📊 File Structure After Deployment

```
SPAIRL-X-VAL/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Auto-deployment config
├── document-editor/
│   ├── src/                    ← React source code
│   ├── public/                 ← Static assets
│   ├── dist/                   ← Built files (deployed)
│   ├── vite.config.ts         ← Build configuration
│   ├── package.json           ← Dependencies
│   └── server.js              ← NOT deployed to Pages
├── Data/                       ← NOT uploaded (.gitignore)
├── Reference Files/            ← NOT uploaded (.gitignore)
├── .gitignore                 ← File exclusion rules
└── README.md                  ← Project documentation
```

## 🔐 Security Checklist

Before pushing to GitHub, verify:

- [ ] No API keys in code (use environment variables)
- [ ] No passwords in code
- [ ] No sensitive user data
- [ ] `.gitignore` properly configured
- [ ] `Data/` folder excluded
- [ ] `Reference Files/` excluded
- [ ] `.env` files excluded

## 🎉 Success!

Once deployed, you can:
- ✅ Share the public URL with anyone
- ✅ Use as a portfolio demo
- ✅ Show to clients/stakeholders
- ✅ Test frontend features
- ⚠️ Note: Backend features need separate deployment

## 📚 Next Steps

1. **Deploy Backend** (for full functionality)
   - Create separate backend repository
   - Deploy to Heroku/Render/Railway
   - Update frontend API endpoints

2. **Custom Domain** (optional)
   - Buy a domain name
   - Configure DNS settings
   - Update GitHub Pages settings

3. **Environment Variables**
   - Move API keys to environment variables
   - Use Vite's `import.meta.env`
   - Create `.env.production` file

4. **Analytics** (optional)
   - Add Google Analytics
   - Track user interactions
   - Monitor performance

## 🆘 Need Help?

**Resources:**
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

**Common Commands:**
```bash
# View git status
git status

# View recent commits
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Force push (use carefully!)
git push origin main --force
```

---

**Ready to deploy?** Follow Step 1 above to get started! 🚀
