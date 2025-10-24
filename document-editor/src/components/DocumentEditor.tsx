import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Sparkles, CheckCircle, Camera, Trash2, MapPin, FileText, Edit3 } from 'lucide-react';
import { useStore } from '../store';
import { extractDocumentFields } from '../utils/documentParser';
import { logDocumentEdit, generateDocumentFileName, saveDocument, savePhoto } from '../utils/csvHelper';
import { DocumentLog } from '../types';
import { cn } from '../utils/cn';
import CameraCapture from './CameraCapture';
import DocumentPreview from './DocumentPreview';
import LocationPicker from './LocationPicker';
import { modifyDocxFile, DocxFieldValues } from '../utils/docxModifier';
import { generateFileNumber } from '../utils/fileNumberGenerator';

export default function DocumentEditor() {
  const {
    currentUser,
    selectedBank,
    selectedDocument,
    documentFields,
    photos,
    originalFieldValues,
    setSelectedDocument,
    setDocumentFields,
    updateField,
    addPhoto,
    removePhoto,
    setOriginalFieldValues,
  } = useStore();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'fields'>('preview');

  useEffect(() => {
    if (selectedDocument && documentFields.length === 0) {
      const fields = extractDocumentFields(selectedDocument);
      setDocumentFields(fields);
      
      // Store original values for comparison
      const originals: Record<string, string> = {};
      fields.forEach(field => {
        originals[field.key] = field.value;
      });
      setOriginalFieldValues(originals);
      
      // Auto-generate file number if empty or needs update
      const generateNumber = async () => {
        const fileNumberField = fields.find(f => f.key === 'fileNumber');
        if (!fileNumberField || !fileNumberField.value || fileNumberField.value === '10216') {
          const newFileNumber = await generateFileNumber();
          updateField('fileNumber', newFileNumber);
        }
      };
      generateNumber();
    }
  }, [selectedDocument, documentFields.length, setDocumentFields, setOriginalFieldValues, updateField]);

  const handleSave = async () => {
    if (!currentUser || !selectedDocument || !selectedBank) return;
    
    setSaving(true);
    try {
      // Get field values
      const getFieldValue = (key: string) => {
        const field = documentFields.find(f => f.key === key);
        return field?.value || '';
      };

      // Generate new document filename
      const newFileName = generateDocumentFileName(
        getFieldValue('fileNumber'),
        getFieldValue('propertyType'),
        getFieldValue('location'),
        getFieldValue('customerName'),
        getFieldValue('bankCode')
      );

      // Upload photos first
      const uploadedPhotoNames: string[] = [];
      for (const photo of photos) {
        try {
          // Convert data URL to blob
          const response = await fetch(photo.url);
          const photoBlob = await response.blob();
          
          // Upload photo
          const savedFilename = await savePhoto(photoBlob, photo.filename);
          if (savedFilename) {
            uploadedPhotoNames.push(savedFilename);
          }
        } catch (err) {
          console.error('Error uploading photo:', err);
        }
      }

      // Create field values object for docx modification
      const fieldValues: DocxFieldValues = {};
      documentFields.forEach(field => {
        fieldValues[field.label] = field.value;
        fieldValues[field.key] = field.value;
      });
      
      // Modify the original .docx file
      if (!selectedDocument.file) {
        throw new Error('No document file available');
      }
      
      const modifiedBlob = await modifyDocxFile(selectedDocument.file, fieldValues);
      
      // Save modified document
      const documentPath = await saveDocument(newFileName, modifiedBlob);
      
      if (documentPath) {
        // Get GPS from first photo if available
        const firstPhoto = photos[0];
        const gpsLat = firstPhoto?.location?.latitude.toFixed(6) || '';
        const gpsLon = firstPhoto?.location?.longitude.toFixed(6) || '';
        const photoPaths = uploadedPhotoNames.join(';');

        // Create log entry
        const log: DocumentLog = {
          timestamp: new Date().toISOString(),
          username: currentUser.username,
          fileNumber: getFieldValue('fileNumber'),
          propertyType: getFieldValue('propertyType'),
          location: getFieldValue('location'),
          customerName: getFieldValue('customerName'),
          bankCode: getFieldValue('bankCode'),
          referenceCode: getFieldValue('referenceCode'),
          inspectionDate: getFieldValue('inspectionDate'),
          inspectionTime: getFieldValue('inspectionTime'),
          valuerName: getFieldValue('valuerName'),
          propertyValue: getFieldValue('propertyValue'),
          remarks: getFieldValue('remarks'),
          documentPath: newFileName,
          gpsLatitude: gpsLat,
          gpsLongitude: gpsLon,
          photoCount: photos.length,
          photoPaths: photoPaths,
        };

        // Log to CSV
        await logDocumentEdit(log);
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    updateField(key, value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 backdrop-blur-lg bg-white/80 border-b border-slate-200"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedDocument(null)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors tap-highlight-transparent"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {selectedDocument?.fileNumber}
            </h2>
            <p className="text-sm text-slate-600 truncate">
              {selectedDocument?.propertyType}
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <FileText className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('fields')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                viewMode === 'fields'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Edit3 className="w-4 h-4" />
              Fields
            </button>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all duration-200 tap-highlight-transparent flex items-center gap-2',
              saved
                ? 'bg-green-600 text-white'
                : saving
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
            )}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Saved
              </>
            ) : saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="md:hidden p-4 bg-white border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'preview'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700'
            )}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Document
          </button>
          <button
            onClick={() => setViewMode('fields')}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'fields'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700'
            )}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            Edit Fields
          </button>
        </div>
      </div>

      {/* Document Preview */}
      {viewMode === 'preview' && selectedDocument?.file && (
        <div className="p-6">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Changed fields are highlighted in yellow - Click to edit</span>
            </p>
          </div>
          <DocumentPreview 
            file={selectedDocument.file}
            changedFields={Object.entries(originalFieldValues).reduce((acc, [key, original]) => {
              const current = documentFields.find(f => f.key === key);
              if (current && current.value !== original) {
                acc[key] = { old: original, new: current.value };
              }
              return acc;
            }, {} as Record<string, { old: string; new: string }>)}
            onFieldClick={(fieldKey) => {
              // Switch to fields tab and focus on the clicked field
              setViewMode('fields');
              // Small delay to ensure tab switch completes
              setTimeout(() => {
                const fieldElement = document.querySelector(`[data-field-key="${fieldKey}"]`);
                if (fieldElement) {
                  fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Focus the input if it's an input element
                  if (fieldElement instanceof HTMLInputElement || fieldElement instanceof HTMLTextAreaElement) {
                    fieldElement.focus();
                  }
                }
              }, 100);
            }}
            className="rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          />
        </div>
      )}

      {/* Fields */}
      {viewMode === 'fields' && (
      <div className="p-6 space-y-4">
        {/* Bank Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="px-3 py-1.5 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: selectedBank?.color }}
          >
            {selectedBank?.name}
          </div>
        </div>

        {/* Automated Fields Notice */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Auto-filled fields
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Some fields are automatically populated with current date and time
            </p>
          </div>
        </div>

        {/* Photo Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Property Photos & Location</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLocationPicker(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Pick Location</span>
              </button>
              <button
                onClick={() => setShowCamera(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Take Photo</span>
              </button>
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt="Property"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {photo.location && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>GPS</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No photos added yet</p>
              <p className="text-xs text-slate-400 mt-1">Take photos with GPS and compass overlay</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {documentFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                {field.label}
                {field.automated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs">
                    <Sparkles className="w-3 h-3" />
                    Auto
                  </span>
                )}
              </label>
              {field.key === 'remarks' ? (
                <textarea
                  data-field-key={field.key}
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  disabled={!field.editable}
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    field.editable
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed',
                    field.automated && 'bg-blue-50 border-blue-200'
                  )}
                />
              ) : (
                <input
                  data-field-key={field.key}
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  disabled={!field.editable}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    field.editable
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed',
                    field.automated && 'bg-blue-50 border-blue-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Save Button (Bottom) */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={cn(
            'w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 tap-highlight-transparent mt-6 flex items-center justify-center gap-2',
            saved
              ? 'bg-green-600 text-white'
              : saving
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/20'
          )}
        >
          {saved ? (
            <>
              <CheckCircle className="w-6 h-6" />
              Changes Saved
            </>
          ) : saving ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Save Changes
            </>
          )}
        </button>
      </div>
      )}

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onPhotoCapture={(photo) => {
            addPhoto(photo);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={(location) => {
            // Update latitude and longitude fields
            updateField('latitude', location.latitude.toFixed(6));
            updateField('longitude', location.longitude.toFixed(6));
            
            // Optionally update location/address field if it exists
            const addressParts = location.address.split(',');
            if (addressParts.length > 0) {
              const locationField = documentFields.find(f => 
                f.key.toLowerCase().includes('location') || 
                f.key.toLowerCase().includes('address')
              );
              if (locationField) {
                updateField(locationField.key, addressParts[0].trim());
              }
            }
            
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
          initialLat={parseFloat(documentFields.find(f => f.key === 'latitude')?.value || '21.1702')}
          initialLng={parseFloat(documentFields.find(f => f.key === 'longitude')?.value || '72.8311')}
        />
      )}
    </div>
  );
}
