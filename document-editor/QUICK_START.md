# 🚀 Quick Start Guide

## Application is Running! ✅

**Frontend**: http://localhost:3000
**Backend API**: http://localhost:3001

## Login Credentials

```
👨‍💼 Admin Account:
Username: admin
Password: admin123

👤 Valuer Account 1:
Username: valuer1
Password: password123

👤 Valuer Account 2:
Username: valuer2
Password: password123
```

## 📁 Important File Locations

### Data Storage
- **Users**: `d:/SPAIRL/SPAIRL X VAL/Data/users.csv`
- **Document Logs**: `d:/SPAIRL/SPAIRL X VAL/Data/document_logs.csv`
- **Saved Documents**: `d:/SPAIRL/SPAIRL X VAL/Data/UpdatedDocuments/`

### Reference Files (for testing)
- `d:/SPAIRL/SPAIRL X VAL/Reference Files/`

## 📋 Workflow

1. **Login** → Enter username and password
2. **Select Bank** → Choose from bL, SH, HDFC, or ICICI
3. **Upload Documents** → Select .docx files
4. **Edit Document** → Click document to edit fields
5. **📷 Take Photos** → Capture property photos with GPS overlay
6. **Save** → Document logged to CSV with GPS coordinates and photos exported

## 🎯 Auto-Generated Fields

When you open a document, these fields are automatically filled:

- ✨ **Reference Code**: `REF-[FileNumber]-[Timestamp]`
- ✨ **Inspection Date**: Current date (DD/MM/YYYY)
- ✨ **Inspection Time**: Current time (HH:MM:SS)

## 💾 What Happens When You Save?

1. **Photos Uploaded** to `Data/Photos/`:
   - All photos with GPS/compass overlays
   - Named: `photo_[timestamp].jpg`
   
2. **CSV Log Entry Created** in `document_logs.csv`:
   - Timestamp
   - Your username
   - All document fields
   - Reference code
   - GPS coordinates (latitude/longitude)
   - Photo count and filenames
   
3. **Document Exported** to `UpdatedDocuments/`:
   - Named: `[FileNumber] - [Type] - [Location] - [Customer] - [Bank].docx`
   - Example: `10216 - HFI - Karmala - Laljibhai Gupta - [bL].docx`

## 🔄 Restart Application

If you need to restart:

```bash
# Stop current server (Ctrl+C)
# Then run:
npm run dev:all
```

## 📊 View Your Logs

Open in Excel or any CSV viewer:
```
d:/SPAIRL/SPAIRL X VAL/Data/document_logs.csv
```

Each row shows:
- When document was edited
- Who edited it
- All field values
- Where it was saved

## 🎨 UI Features

- **Mobile-first design** - Works on phone, tablet, desktop
- **Touch-friendly buttons** - Large tap targets
- **Loading states** - Visual feedback during save
- **Success confirmation** - Green checkmark when saved
- **Logout button** - Top right on bank selection screen

## ✅ Ready to Use!

Everything is set up and running. Start by:
1. Going to http://localhost:3000
2. Logging in with `admin` / `admin123`
3. Selecting a bank
4. Uploading a test document from Reference Files

Enjoy! 🎉
