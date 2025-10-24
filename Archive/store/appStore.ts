import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'field_agent' | 'admin' | 'supervisor';
  organization: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface ValuationSession {
  id: string;
  propertyId: string;
  userId: string;
  formType: 'residential' | 'commercial' | 'land';
  status: 'draft' | 'in_progress' | 'completed' | 'submitted';
  createdAt: Date;
  updatedAt: Date;
  photos: Photo[];
  formData: Record<string, any>;
}

export interface Photo {
  id: string;
  filename: string;
  url: string;
  timestamp: Date;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  compassHeading: number;
  compassDirection: string;
  uploaded: boolean;
  uploadProgress: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'land';
  fields: FormField[];
  googleDriveId: string;
  version: number;
  lastModified: Date;
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  autoFillRules?: AutoFillRule[];
}

export interface AutoFillRule {
  id: string;
  fieldId: string;
  condition: string;
  value: string;
  priority: number;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Current session
  currentSession: ValuationSession | null;
  
  // Form templates
  formTemplates: FormTemplate[];
  
  // Camera state
  isCameraActive: boolean;
  capturedPhotos: Photo[];
  
  // GPS state
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  
  // Compass state
  compassHeading: number;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setCurrentSession: (session: ValuationSession | null) => void;
  setFormTemplates: (templates: FormTemplate[]) => void;
  setCameraActive: (isActive: boolean) => void;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  setCurrentLocation: (location: { latitude: number; longitude: number; accuracy: number } | null) => void;
  setCompassHeading: (heading: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentSession: null,
      formTemplates: [],
      isCameraActive: false,
      capturedPhotos: [],
      currentLocation: null,
      compassHeading: 0,
      
      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setCurrentSession: (currentSession) => set({ currentSession }),
      setFormTemplates: (formTemplates) => set({ formTemplates }),
      setCameraActive: (isCameraActive) => set({ isCameraActive }),
      addPhoto: (photo) => set((state) => ({ 
        capturedPhotos: [...state.capturedPhotos, photo] 
      })),
      updatePhoto: (photoId, updates) => set((state) => ({
        capturedPhotos: state.capturedPhotos.map(photo =>
          photo.id === photoId ? { ...photo, ...updates } : photo
        )
      })),
      setCurrentLocation: (currentLocation) => set({ currentLocation }),
      setCompassHeading: (compassHeading) => set({ compassHeading }),
    }),
    {
      name: 'valuation-platform-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentSession: state.currentSession,
        capturedPhotos: state.capturedPhotos,
        currentLocation: state.currentLocation,
        compassHeading: state.compassHeading,
      }),
    }
  )
);
