# 🔀 Merge Master Branch to Main

## Quick Commands

```bash
cd "d:\SPAIRL\SPAIRL X VAL"

# Checkout main branch
git checkout main

# Merge master into main
git merge master

# Push the merged main branch
git push origin main
```

## Step-by-Step Guide

### Step 1: Navigate to Project
```bash
cd "d:\SPAIRL\SPAIRL X VAL"
```

### Step 2: Check Current Branch
```bash
git branch
```
You should see which branch you're on (marked with *)

### Step 3: Checkout Main Branch
```bash
git checkout main
```

### Step 4: Merge Master into Main
```bash
git merge master
```

### Step 5: Resolve Conflicts (if any)
If there are merge conflicts:
1. Git will tell you which files have conflicts
2. Open those files
3. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
4. Edit to keep the correct version
5. Remove conflict markers
6. Save files
7. Stage resolved files: `git add <filename>`
8. Complete merge: `git commit -m "Merge master into main"`

### Step 6: Push to GitHub
```bash
git push origin main
```

## Alternative: Fast Way (All in One)

```bash
cd "d:\SPAIRL\SPAIRL X VAL"
git checkout main && git merge master && git push origin main
```

## If You Want to Delete Master After Merge

Once master is merged and you don't need it anymore:

```bash
# Delete local master branch
git branch -d master

# Delete remote master branch (careful!)
git push origin --delete master
```

## Verify Merge

Check that merge was successful:
```bash
# View commit history
git log --oneline --graph --all

# Check branches
git branch -a
```

## Troubleshooting

### "Already on 'main'"
You're already on main branch, just run:
```bash
git merge master
```

### "master branch not found"
Check available branches:
```bash
git branch -a
```

### "Automatic merge failed; fix conflicts"
1. Check which files have conflicts:
```bash
git status
```
2. Open conflicted files and resolve
3. Add resolved files:
```bash
git add .
```
4. Complete merge:
```bash
git commit -m "Merge master into main"
```

---

**Ready to merge?** Run the quick commands above! 🔀
