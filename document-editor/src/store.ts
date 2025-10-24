import { create } from 'zustand';
import { AppState, PhotoMetadata } from './types';

interface ExtendedAppState extends AppState {
  photos: PhotoMetadata[];
  originalFieldValues: Record<string, string>;
  addPhoto: (photo: PhotoMetadata) => void;
  removePhoto: (photoId: string) => void;
  clearPhotos: () => void;
  setOriginalFieldValues: (values: Record<string, string>) => void;
}

export const useStore = create<ExtendedAppState>((set) => ({
  currentUser: null,
  selectedBank: null,
  selectedValuationType: null,
  selectedDocument: null,
  documentFields: [],
  photos: [],
  originalFieldValues: {},
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setSelectedBank: (bank) => set({ selectedBank: bank }),
  
  setSelectedValuationType: (type) => set({ selectedValuationType: type }),
  
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  
  setDocumentFields: (fields) => set({ documentFields: fields }),
  
  updateField: (key, value) => set((state) => ({
    documentFields: state.documentFields.map((field) =>
      field.key === key ? { ...field, value } : field
    ),
  })),
  
  addPhoto: (photo) => set((state) => ({
    photos: [...state.photos, photo],
  })),
  
  removePhoto: (photoId) => set((state) => ({
    photos: state.photos.filter((p) => p.id !== photoId),
  })),
  
  clearPhotos: () => set({ photos: [] }),
  
  setOriginalFieldValues: (values) => set({ originalFieldValues: values }),
  
  logout: () => set({
    currentUser: null,
    selectedBank: null,
    selectedValuationType: null,
    selectedDocument: null,
    documentFields: [],
    photos: [],
    originalFieldValues: {},
  }),
  
  reset: () => set({
    selectedBank: null,
    selectedValuationType: null,
    selectedDocument: null,
    documentFields: [],
    photos: [],
    originalFieldValues: {},
  }),
}));
