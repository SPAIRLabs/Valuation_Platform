import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const DATA_PATH = path.resolve(__dirname, '../Data');
const USERS_CSV = path.join(DATA_PATH, 'users.csv');
const LOGS_CSV = path.join(DATA_PATH, 'document_logs.csv');
const DOCS_FOLDER = path.join(DATA_PATH, 'UpdatedDocuments');
const PHOTOS_FOLDER = path.join(DATA_PATH, 'Photos');

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOCS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Read users CSV
app.get('/api/csv/users', async (req, res) => {
  try {
    const csvContent = await fs.readFile(USERS_CSV, 'utf-8');
    res.type('text/csv').send(csvContent);
  } catch (error) {
    console.error('Error reading users CSV:', error);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Read logs CSV
app.get('/api/csv/logs', async (req, res) => {
  try {
    const csvContent = await fs.readFile(LOGS_CSV, 'utf-8');
    res.type('text/csv').send(csvContent);
  } catch (error) {
    console.error('Error reading logs CSV:', error);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    
    // Validation
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if username already exists
    const csvContent = await fs.readFile(USERS_CSV, 'utf-8');
    const lines = csvContent.split('\n');
    const existingUsernames = lines.slice(1).map(line => {
      const [user] = line.split(',');
      return user;
    });
    
    if (existingUsernames.includes(username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Add new user to CSV
    const newUserRow = `\n${username},${password},${fullName},${role || 'valuer'}`;
    await fs.appendFile(USERS_CSV, newUserRow, 'utf-8');
    
    res.json({ 
      success: true, 
      message: 'Account created successfully',
      user: { username, fullName, role: role || 'valuer' }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Log document edit
app.post('/api/csv/log', async (req, res) => {
  try {
    const log = req.body;
    
    // Create CSV row
    const row = [
      log.timestamp,
      log.username,
      log.fileNumber,
      log.propertyType,
      log.location,
      log.customerName,
      log.bankCode,
      log.referenceCode,
      log.inspectionDate,
      log.inspectionTime,
      log.valuerName,
      log.propertyValue,
      `"${log.remarks.replace(/"/g, '""')}"`, // Escape quotes in remarks
      log.documentPath,
      log.gpsLatitude || '',
      log.gpsLongitude || '',
      log.photoCount || 0,
      log.photoPaths || '',
    ].join(',');
    
    // Append to CSV
    await fs.appendFile(LOGS_CSV, `\n${row}`, 'utf-8');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging document:', error);
    res.status(500).json({ error: 'Failed to log document' });
  }
});

// Save document
app.post('/api/documents/save', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = path.join(DOCS_FOLDER, req.file.filename);
    res.json({ 
      success: true, 
      path: filePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ error: 'Failed to save document' });
  }
});

// Configure multer for photo uploads
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PHOTOS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const photoUpload = multer({ storage: photoStorage });

// Save photo
app.post('/api/photos/save', photoUpload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    
    const filePath = path.join(PHOTOS_FOLDER, req.file.filename);
    res.json({ 
      success: true, 
      path: filePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error saving photo:', error);
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
