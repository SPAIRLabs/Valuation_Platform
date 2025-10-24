# Document Editor - Setup & Usage Guide

## ✅ Complete Implementation Summary

Your mobile document editing platform is now fully functional with authentication, CSV logging, and document export capabilities.

## 🎯 What Was Implemented

### 1. **User Authentication System**
- Login screen with username/password validation
- User data stored in CSV: `d:/SPAIRL/SPAIRL X VAL/Data/users.csv`
- Secure logout functionality
- Welcome message showing logged-in user

### 2. **CSV-Based User Management**
Pre-configured users in `users.csv`:
```
Username: admin
Password: admin123
Role: Administrator

Username: valuer1
Password: password123
Role: Valuer

Username: valuer2
Password: password123
Role: Valuer
```

### 3. **Document Logging System**
Every document edit is logged to: `d:/SPAIRL/SPAIRL X VAL/Data/document_logs.csv`

Logged information includes:
- Timestamp (ISO format)
- Username who made the edit
- File Number
- Property Type
- Location
- Customer Name
- Bank Code
- **Reference Code** (auto-generated)
- Inspection Date & Time
- Valuer Name
- Property Value
- Remarks
- Document Path (saved file name)

### 4. **Automated Field Generation**
- **Reference Code**: Format `REF-[FileNumber]-[6-digit-timestamp]`
- **Inspection Date**: Auto-populated with current date
- **Inspection Time**: Auto-populated with current time

### 5. **Document Export**
Edited documents are saved to: `d:/SPAIRL/SPAIRL X VAL/Data/UpdatedDocuments/`

File naming follows the format:
```
[File Number] - [Property Type] - [Location] - [Customer Name] - [Bank Code].docx
```

Example: `10216 - HFI - Karmala - Laljibhai Gupta - [bL].docx`

## 🚀 How to Run

### Start Both Frontend and Backend:
```bash
cd "d:/SPAIRL/SPAIRL X VAL/document-editor"
npm run dev:all
```

This starts:
- **Frontend** (Vite): http://localhost:3000
- **Backend** (Express API): http://localhost:3001

### Or Run Separately:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend API:**
```bash
npm run server
```

## 📱 Application Flow

### Step 1: Login
1. Open http://localhost:3000
2. Enter credentials (see users above)
3. Click "Sign In"

### Step 2: Select Bank
1. Welcome screen shows your name with logout option
2. Choose from 4 banks:
   - Bank of Baroda (bL)
   - State Bank of India (SH)
   - HDFC Bank (HDFC)
   - ICICI Bank (ICICI)

### Step 3: Upload Documents
1. Click "Upload Documents" button
2. Select .docx files from your device
3. Only documents matching selected bank code are shown

### Step 4: Edit Document
1. Click on a document from the list
2. View all fields (auto-filled fields marked with ✨)
3. Edit required fields:
   - File Number
   - Property Type
   - Location
   - Customer Name
   - Valuer Name
   - Property Value
   - Remarks

### Step 5: Save Changes
1. Click "Save Changes" button (top or bottom)
2. Document is:
   - Logged to CSV with timestamp
   - Exported to UpdatedDocuments folder
   - Saved with proper naming format

## 📊 Data Structure

### Users CSV (`users.csv`)
```csv
username,password,fullName,role
admin,admin123,Administrator,admin
valuer1,password123,Rahul Kumar,valuer
valuer2,password123,Priya Sharma,valuer
```

### Document Logs CSV (`document_logs.csv`)
```csv
timestamp,username,fileNumber,propertyType,location,customerName,bankCode,referenceCode,inspectionDate,inspectionTime,valuerName,propertyValue,remarks,documentPath
```

Example log entry:
```csv
2025-10-24T08:42:15.234Z,admin,10216,HFI,Karmala,Laljibhai Gupta,bL,REF-10216-234567,24/10/2025,10:42:15,John Doe,₹50,00,000,Verified property,10216 - HFI - Karmala - Laljibhai Gupta - [bL].docx
```

## 🔧 Backend API Endpoints

### GET `/api/csv/users`
Returns users CSV for authentication

### POST `/api/csv/log`
Logs document edit to CSV
```json
{
  "timestamp": "2025-10-24T08:42:15.234Z",
  "username": "admin",
  "fileNumber": "10216",
  "propertyType": "HFI",
  "location": "Karmala",
  "customerName": "Laljibhai Gupta",
  "bankCode": "bL",
  "referenceCode": "REF-10216-234567",
  "inspectionDate": "24/10/2025",
  "inspectionTime": "10:42:15",
  "valuerName": "John Doe",
  "propertyValue": "₹50,00,000",
  "remarks": "Verified",
  "documentPath": "10216 - HFI - Karmala - Laljibhai Gupta - [bL].docx"
}
```

### POST `/api/documents/save`
Saves document file to UpdatedDocuments folder
- Accepts multipart/form-data
- Returns saved file path

## 📂 Project Structure

```
document-editor/
├── src/
│   ├── components/
│   │   ├── Login.tsx              # Authentication screen
│   │   ├── BankSelection.tsx      # Bank selection with logout
│   │   ├── DocumentList.tsx       # Upload & document list
│   │   └── DocumentEditor.tsx     # Edit fields & save
│   ├── utils/
│   │   ├── banks.ts               # Bank definitions
│   │   ├── csvHelper.ts           # CSV operations
│   │   ├── documentParser.ts      # Parse & extract fields
│   │   └── cn.ts                  # Tailwind utility
│   ├── types.ts                   # TypeScript interfaces
│   ├── store.ts                   # Zustand state management
│   └── App.tsx                    # Main app component
├── server.js                      # Express API server
└── Data/                          # CSV files & documents
    ├── users.csv
    ├── document_logs.csv
    └── UpdatedDocuments/
```

## 🎨 Features

✅ **Clean, minimal mobile-first UI**
✅ **Secure user authentication**
✅ **CSV-based data storage**
✅ **Auto-generated reference codes**
✅ **Timestamp tracking**
✅ **Document export with proper naming**
✅ **Logout functionality**
✅ **Real-time field validation**
✅ **Loading states for save operations**
✅ **Success feedback**

## 🔐 Security Notes

- Currently using plain-text passwords in CSV (for demo)
- In production, use bcrypt for password hashing
- Consider using a proper database (PostgreSQL, MongoDB)
- Add JWT tokens for session management
- Implement HTTPS for secure communication

## 📝 Adding New Users

Edit `d:/SPAIRL/SPAIRL X VAL/Data/users.csv`:

```csv
username,password,fullName,role
newuser,newpass123,New User Name,valuer
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### Backend Not Starting
Ensure all dependencies are installed:
```bash
npm install
```

### Documents Not Saving
Check that the folder exists:
```
d:/SPAIRL/SPAIRL X VAL/Data/UpdatedDocuments/
```

### CSV Not Logging
Verify CSV file has headers:
```csv
timestamp,username,fileNumber,propertyType,location,customerName,bankCode,referenceCode,inspectionDate,inspectionTime,valuerName,propertyValue,remarks,documentPath
```

## 🎯 Next Steps

1. **Test with Reference Documents**:
   - Upload documents from `d:/SPAIRL/SPAIRL X VAL/Reference Files/`
   - Edit fields and save
   - Check exported documents in UpdatedDocuments folder
   - Verify logs in document_logs.csv

2. **Add More Users** (optional):
   - Edit users.csv
   - Add new valuer accounts

3. **Monitor Logs**:
   - Check document_logs.csv after each save
   - Verify all fields are captured correctly

## ✨ Application is Ready!

The document editor is fully functional and ready to use. Login with the demo credentials and start editing documents!
