# ✅ GitHub Pages Deployment Checklist

## Before Pushing to GitHub

### 1. Update Configuration
- [ ] Open `document-editor/vite.config.ts`
- [ ] Change `base` path to match your repository name
- [ ] Example: `/SPAIRL-X-VAL/` or `/your-repo-name/`

### 2. Verify .gitignore
- [ ] Check `.gitignore` file exists in root folder
- [ ] Confirm these are excluded:
  - [ ] `Data/document_logs.csv`
  - [ ] `Data/users.csv`
  - [ ] `Data/UpdatedDocuments/*.docx`
  - [ ] `Data/Photos/*`
  - [ ] `Reference Files/**/*.docx`
  - [ ] `node_modules/`
  - [ ] `.env` files

### 3. Test Build Locally
```bash
cd document-editor
npm run build
npm run preview
```
- [ ] Build completes without errors
- [ ] Preview works at http://localhost:4173
- [ ] No console errors in browser

### 4. Security Check
- [ ] No passwords in code
- [ ] No API keys hardcoded (except Google Maps if needed)
- [ ] No sensitive customer data
- [ ] No personal information
- [ ] Review all files being committed

## GitHub Setup

### 5. Create Repository
- [ ] Go to https://github.com/new
- [ ] Name: `SPAIRL-X-VAL` (or your preferred name)
- [ ] Visibility: **Public** (required for free Pages)
- [ ] Do NOT initialize with README
- [ ] Click "Create repository"

### 6. Initialize and Push
```bash
cd "d:/SPAIRL/SPAIRL X VAL"
git init
git add .
git commit -m "Initial commit: Property Valuation Document Editor"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

- [ ] All files pushed successfully
- [ ] Check GitHub repo shows all files
- [ ] Verify sensitive data NOT uploaded

### 7. Enable GitHub Pages
- [ ] Go to repository Settings
- [ ] Click "Pages" in sidebar
- [ ] Source: Select "GitHub Actions"
- [ ] Save

### 8. Monitor Deployment
- [ ] Go to "Actions" tab
- [ ] Watch deployment workflow
- [ ] Wait for green checkmark (2-3 minutes)
- [ ] Check for any errors

### 9. Test Live Site
- [ ] Open: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
- [ ] Login screen loads correctly
- [ ] Bank selection works
- [ ] Valuation type selection works
- [ ] Document upload interface loads
- [ ] Preview and fields tabs switch
- [ ] No console errors

## Post-Deployment

### 10. Document the URL
- [ ] Update project documentation with live URL
- [ ] Share with team/stakeholders
- [ ] Add to portfolio/CV if applicable

### 11. Known Limitations (GitHub Pages)
- [ ] ⚠️ Backend API not available (file uploads won't save)
- [ ] ⚠️ CSV logging not working (no server)
- [ ] ⚠️ Document saving limited (client-side only)
- [ ] ✅ All UI features work
- [ ] ✅ Preview and editing work
- [ ] ✅ Location picker works

### 12. Optional: Deploy Backend Separately
For full functionality:
- [ ] Deploy `server.js` to Heroku/Render/Railway
- [ ] Update API endpoints in frontend
- [ ] Configure CORS
- [ ] Test end-to-end workflow

## Quick Commands

### View Status
```bash
git status
git log --oneline
```

### Update Deployment
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

### Fix Issues
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# View diff
git diff

# Remove file from git
git rm --cached filename
```

## Troubleshooting

### ❌ 404 Error After Deploy
**Fix:** Check `base` path in `vite.config.ts` matches repo name exactly

### ❌ Assets Not Loading
**Fix:** Ensure `base` path ends with `/` (slash)

### ❌ GitHub Actions Failed
**Fix:** Check Actions tab for error details, verify `package-lock.json` exists

### ❌ Sensitive Data Uploaded
**Fix:**
1. Add file to `.gitignore`
2. Remove from git: `git rm --cached filename`
3. Commit and push
4. **Consider the data compromised** - change passwords if needed

## Files Being Uploaded ✅

### Source Code
- React components (`.tsx`, `.ts`)
- Styles and configuration
- Build scripts
- Documentation

### NOT Uploaded ❌
- User data (`Data/` folder)
- Reference documents
- Node modules
- Environment variables
- Log files

---

**All checked?** You're ready to deploy! 🚀

Run the git commands in Section 6 to push to GitHub.
