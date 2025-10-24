export interface DocumentMetadata {
  id: string;
  fileName: string;
  bankCode: string;
  fileNumber: string;
  propertyType: string;
  location: string;
  customerName: string;
  file?: File;
}

export interface Bank {
  code: string;
  name: string;
  color: string;
}

export interface ValuationType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DocumentField {
  label: string;
  key: string;
  value: string;
  editable: boolean;
  automated?: boolean;
}

export interface User {
  username: string;
  password: string;
  fullName: string;
  role: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface PhotoMetadata {
  id: string;
  filename: string;
  timestamp: string;
  location: LocationData | null;
  compass: number | null; // Heading in degrees
  url: string;
}

export interface DocumentLog {
  timestamp: string;
  username: string;
  fileNumber: string;
  propertyType: string;
  location: string;
  customerName: string;
  bankCode: string;
  referenceCode: string;
  inspectionDate: string;
  inspectionTime: string;
  valuerName: string;
  propertyValue: string;
  remarks: string;
  documentPath: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
  photoCount?: number;
  photoPaths?: string;
}

export interface AppState {
  currentUser: User | null;
  selectedBank: Bank | null;
  selectedValuationType: ValuationType | null;
  selectedDocument: DocumentMetadata | null;
  documentFields: DocumentField[];
  setCurrentUser: (user: User | null) => void;
  setSelectedBank: (bank: Bank | null) => void;
  setSelectedValuationType: (type: ValuationType | null) => void;
  setSelectedDocument: (doc: DocumentMetadata | null) => void;
  setDocumentFields: (fields: DocumentField[]) => void;
  updateField: (key: string, value: string) => void;
  logout: () => void;
  reset: () => void;
}
