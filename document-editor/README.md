# Document Editor - Mobile Platform

A clean, minimal mobile platform for editing property documents with bank-specific workflows.

## Features

- **User Authentication**: Secure login with CSV-based user management
- **Bank Selection**: Choose from multiple banks (Bank of Baroda, SBI, HDFC, ICICI)
- **Document Upload**: Upload and manage .docx property documents from local storage
- **Smart Parsing**: Automatically extracts property details from document filenames
- **Field Editing**: Edit document parameters with a clean, intuitive interface
- **Auto-fill**: Automatic population of inspection date, time, and reference code
- **📷 Camera Capture**: Take photos with GPS location and compass overlay
- **🗺️ GPS Integration**: Automatic geolocation with reverse geocoding
- **🧭 Compass Overlay**: Device orientation displayed on photos
- **Photo Gallery**: Manage multiple photos per document with thumbnails
- **CSV Logging**: All document edits logged with GPS coordinates and photo links
- **Document Export**: Saves edited documents to a dedicated folder with proper naming
- **Mobile-First**: Responsive design optimized for mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Zustand** for state management
- **Lucide React** for icons
- **docx** library for Word document handling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

To run both the frontend and backend API:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
npm run server
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:3001`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Login**: Sign in with your credentials (see demo credentials below)
2. **Select Bank**: Choose the bank associated with your documents
3. **Upload Documents**: Select .docx files from your device
4. **Select Document**: Choose a document to edit from the list
5. **Edit Fields**: Update document parameters as needed
   - Auto-filled fields include: Reference Code, Inspection Date & Time
6. **Save Changes**: Click Save to:
   - Log the edit to `Data/document_logs.csv`
   - Export the document to `Data/UpdatedDocuments/` folder
   - Document is saved with the same naming format as the original

### Demo Credentials

```
Username: admin
Password: admin123

Username: valuer1
Password: password123
```

### Data Storage

- **Users**: `d:/SPAIRL/SPAIRL X VAL/Data/users.csv`
- **Document Logs**: `d:/SPAIRL/SPAIRL X VAL/Data/document_logs.csv`
- **Exported Documents**: `d:/SPAIRL/SPAIRL X VAL/Data/UpdatedDocuments/`

## Document Format

Documents should follow this naming convention:
```
[File Number] - [Property Type] - [Details] - [Location] - [Customer Name] - [Bank Code].docx
```

Example:
```
10216 - HFI - Plot no.316 Gruham Exotica - Karmala - Laljibhai Gupta - [bL].docx
```

Supported bank codes:
- `bL` - Bank of Baroda
- `SH` - State Bank of India
- `HDFC` - HDFC Bank
- `ICICI` - ICICI Bank

## Automated Fields

The following fields are automatically populated:
- **Reference Code**: Auto-generated unique identifier (REF-[FileNumber]-[Timestamp])
- **Inspection Date**: Current date in Indian format
- **Inspection Time**: Current time in Indian format

## Future Enhancements

- Actual .docx file parsing and editing
- Document export functionality
- Cloud storage integration
- Offline support with IndexedDB
- Camera integration for property photos
- GPS location capture
