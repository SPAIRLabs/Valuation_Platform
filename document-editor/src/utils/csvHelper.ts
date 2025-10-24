import Papa from 'papaparse';
import { User, DocumentLog } from '../types';

const DATA_PATH = 'd:/SPAIRL/SPAIRL X VAL/Data';
const USERS_CSV = `${DATA_PATH}/users.csv`;
const LOGS_CSV = `${DATA_PATH}/document_logs.csv`;
const DOCS_FOLDER = `${DATA_PATH}/UpdatedDocuments`;

// Read users from CSV
export const readUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`/api/csv/users`);
    const csvText = await response.text();
    
    const result = Papa.parse<User>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return result.data;
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Authenticate user
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const users = await readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// Register new user
export const registerUser = async (
  username: string,
  password: string,
  fullName: string,
  role: string = 'valuer'
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, fullName, role }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};

// Append document log to CSV
export const logDocumentEdit = async (log: DocumentLog): Promise<boolean> => {
  try {
    const response = await fetch('/api/csv/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error logging document:', error);
    return false;
  }
};

// Generate document filename
export const generateDocumentFileName = (
  fileNumber: string,
  propertyType: string,
  location: string,
  customerName: string,
  bankCode: string
): string => {
  // Extract key parts for filename
  const parts = [fileNumber, propertyType];
  
  // Add location if available
  if (location) {
    parts.push(location);
  }
  
  // Add customer name if available
  if (customerName) {
    parts.push(customerName);
  }
  
  // Add bank code
  const fileName = `${parts.join(' - ')} - [${bankCode}].docx`;
  
  return fileName;
};

// Save document
export const saveDocument = async (
  fileName: string,
  content: Blob
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', content, fileName);
    
    const response = await fetch('/api/documents/save', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.path;
    }
    
    return null;
  } catch (error) {
    console.error('Error saving document:', error);
    return null;
  }
};

// Save photo to backend
export const savePhoto = async (
  photoBlob: Blob,
  filename: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('photo', photoBlob, filename);
    
    const response = await fetch('/api/photos/save', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.filename;
    }
    
    return null;
  } catch (error) {
    console.error('Error saving photo:', error);
    return null;
  }
};

export { USERS_CSV, LOGS_CSV, DOCS_FOLDER };
