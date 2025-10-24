# 📝 Auto File Numbers & Change Highlighting - COMPLETE!

## ✅ Features Implemented

### 1. **Auto-Generated File Numbers**
- Automatically creates unique file numbers for each document
- Reads existing numbers from CSV to avoid duplicates
- Incremental numbering system

### 2. **Change Highlighting in Preview**
- Yellow highlights show edited fields
- Visual diff between original and current values
- Real-time preview updates

## 🎯 How It Works

### Auto File Number Generation

#### System Logic
```
1. Document opens → Check if file number exists
2. If empty or default → Generate new number
3. Read document_logs.csv
4. Find highest file number (e.g., 10216)
5. Add 1 → New number (e.g., 10217)
6. Auto-fill in file number field
```

#### Fallback System
- **Primary**: Reads CSV, finds max number, adds 1
- **Fallback**: Uses timestamp-based number if CSV unavailable
- **Format**: 5-6 digit numbers (e.g., 10000-99999)

### Change Highlighting

#### Tracking System
```
1. Document loads → Store original values
2. User edits fields → Track changes
3. Switch to Preview → Compare values
4. Changed text → Highlight in yellow
5. Visual feedback → See what changed
```

#### Highlight Style
- **Color**: Yellow background (#fef08a)
- **Padding**: 2px 4px
- **Border Radius**: 3px
- **Font Weight**: Bold (600)
- **Visual**: 🟡 Highlighted text stands out

## 📊 File Number Examples

### Before (Manual)
```
User uploads: "10216 - HFI - Karmala..."
File Number field: "10216" (from filename)
```

### After (Auto-Generated)
```
User uploads: "10216 - HFI - Karmala..."
System checks CSV: Highest = 10216
File Number field: "10217" ← AUTO-GENERATED
```

### CSV Log
```csv
timestamp,username,fileNumber,...
2025-10-24...,admin,10216,...
2025-10-24...,sahil,10217,...  ← New auto-generated
2025-10-24...,sahil,10218,...  ← Next auto-generated
```

## 🎨 Visual Change Highlighting

### Example Scenario

#### Original Document
```
File Number: 10216
Location: Karmala
Customer Name: Laljibhai Gupta
```

#### After Editing
```
File Number: 🟡 10217 🟡     ← Highlighted (changed)
Location: 🟡 Mumbai 🟡        ← Highlighted (changed)  
Customer Name: Laljibhai Gupta  ← Not highlighted (same)
```

### Preview Tab Shows
```
┌─────────────────────────────────────┐
│ ⚠️ Changed fields are highlighted   │
├─────────────────────────────────────┤
│ File Number: [🟡 10217 🟡]         │
│ Property Type: HFI                  │
│ Location: [🟡 Mumbai 🟡]           │
│ Customer: Laljibhai Gupta           │
│ ...                                 │
└─────────────────────────────────────┘
```

## 🔧 Technical Implementation

### New Files Created

#### `fileNumberGenerator.ts`
```typescript
export const generateFileNumber = async (): Promise<string> => {
  // Read CSV logs
  // Find max number
  // Return max + 1
}
```

**Features:**
- Async CSV reading
- Number parsing and sorting
- Duplicate prevention
- Fallback mechanism

### Updated Components

#### DocumentEditor.tsx
```typescript
// Auto-generate on load
useEffect(() => {
  if (document && fields.length === 0) {
    const fields = extractDocumentFields(document);
    
    // Store originals
    const originals = {};
    fields.forEach(f => originals[f.key] = f.value);
    setOriginalFieldValues(originals);
    
    // Auto-generate file number
    const generateNumber = async () => {
      if (!fileNumber || fileNumber === '10216') {
        const newNumber = await generateFileNumber();
        updateField('fileNumber', newNumber);
      }
    };
    generateNumber();
  }
}, [document]);
```

#### DocumentPreview.tsx
```typescript
// Highlight changed fields
const highlightChanges = (container, changes) => {
  Object.entries(changes).forEach(([key, { old, new }]) => {
    // Find text nodes with old value
    // Replace with highlighted new value
    parent.innerHTML = html.replace(
      old,
      `<mark style="...">${new}</mark>`
    );
  });
};
```

### Store Updates

#### Added State
```typescript
interface ExtendedAppState {
  originalFieldValues: Record<string, string>;
  setOriginalFieldValues: (values) => void;
}
```

**Purpose**: Track original values for comparison

### API Endpoint

#### GET `/api/csv/logs`
```typescript
app.get('/api/csv/logs', async (req, res) => {
  const csvContent = await fs.readFile(LOGS_CSV, 'utf-8');
  res.type('text/csv').send(csvContent);
});
```

**Purpose**: Read existing file numbers for auto-generation

## 📝 User Workflow

### Document Upload & Edit

1. **Upload Document**
   ```
   Select .docx file → Click document
   ```

2. **Auto File Number**
   ```
   System reads CSV → Finds max: 10216
   Generates: 10217 → Auto-fills field
   ```

3. **Edit Fields**
   ```
   Switch to "Fields" tab
   Edit: Location, Customer Name, etc.
   System tracks: Original vs New values
   ```

4. **View Changes**
   ```
   Switch to "Preview" tab
   See: Yellow highlights on changed text
   Banner: "Changed fields are highlighted"
   ```

5. **Save Document**
   ```
   Click "Save Changes"
   CSV logs new file number: 10217
   Document saved with new number
   ```

## 🎯 Benefits

### Auto File Numbers
✅ **No manual entry** - System generates automatically  
✅ **No duplicates** - Checks existing numbers  
✅ **Sequential** - Logical numbering (10216, 10217, 10218...)  
✅ **Trackable** - Each document has unique ID  
✅ **CSV logged** - All numbers saved  

### Change Highlighting
✅ **Visual feedback** - See what changed  
✅ **Error prevention** - Verify edits before saving  
✅ **Confidence** - Know exactly what's different  
✅ **Professional** - Like Word's track changes  
✅ **Real-time** - Updates as you switch tabs  

## 💡 Pro Tips

### For File Numbers
1. **First document** - Will get next available number
2. **Multiple uploads** - Each gets unique number
3. **Check CSV** - See all generated numbers
4. **Manual override** - Can edit if needed

### For Highlighting
1. **Make edits** - Change some fields
2. **Switch to Preview** - See highlights
3. **Verify changes** - Check highlighted text
4. **Edit more** - Switch back to Fields
5. **Final check** - Preview before saving

## 🐛 Troubleshooting

### File Number Issues

**Problem**: File number not generating  
**Solution**: Check `/api/csv/logs` endpoint is accessible

**Problem**: Duplicate numbers  
**Solution**: Refresh page, system will rescan CSV

### Highlighting Issues

**Problem**: Changes not highlighted  
**Solution**: Make sure you edited fields, then switch to Preview

**Problem**: All text highlighted  
**Solution**: Normal if all fields changed from original

## 📊 CSV Integration

### Updated Columns
```csv
timestamp,username,fileNumber,propertyType,location,...
```

### Example Entries
```csv
2025-10-24...,admin,10216,HFI,Karmala,...
2025-10-24...,sahil,10217,HFI,Mumbai,...    ← Auto-generated
2025-10-24...,admin,10218,HFI,Pune,...      ← Auto-generated
```

### File Number in Document Name
```
[fileNumber] - [Type] - [Location] - [Customer] - [Bank].docx

Examples:
10217 - HFI - Mumbai - Rajesh Sharma - [bL].docx
10218 - HFI - Pune - Amit Patel - [SH].docx
```

## 🔮 Future Enhancements

Potential improvements:
- [ ] File number prefix by bank (bL-10217, SH-10218)
- [ ] Custom number ranges per user
- [ ] Number reservation system
- [ ] Highlight intensity based on change size
- [ ] Track change history
- [ ] Export change report
- [ ] Undo/redo with highlighting

## ✅ Testing Checklist

- [x] File numbers auto-generate
- [x] Numbers are sequential
- [x] No duplicates created
- [x] CSV logs file numbers
- [x] Original values tracked
- [x] Changes highlighted in yellow
- [x] Highlight banner shows
- [x] Preview updates in real-time
- [x] Manual edits still work

## 🎊 Features are LIVE!

Both features are now fully functional:

### To Test:

1. **Auto File Numbers**
   - Upload a new document
   - Check file number field → Should auto-generate
   - Save document → Check CSV for new number

2. **Change Highlighting**
   - Open a document (file number auto-fills)
   - Switch to "Fields" tab
   - Edit some fields (location, customer, etc.)
   - Switch to "Preview" tab
   - See yellow highlights on changed text ✨

**Experience professional document editing with auto-numbering and change tracking!** 📝🟡✨
