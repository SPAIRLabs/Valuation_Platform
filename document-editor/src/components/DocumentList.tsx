import { useRef, useState } from 'react';
import { ArrowLeft, FileText, FolderOpen, Upload, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { parseFileName } from '../utils/documentParser';
import { DocumentMetadata } from '../types';
import { cn } from '../utils/cn';

export default function DocumentList() {
  const { selectedBank, selectedValuationType, setSelectedValuationType, setSelectedDocument } = useStore();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocs: DocumentMetadata[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.endsWith('.docx')) continue;

      const parsed = parseFileName(file.name);
      
      // Filter by selected bank and valuation type (more lenient)
      if (parsed.bankCode === selectedBank?.code) {
        const propType = parsed.propertyType?.toLowerCase() || '';
        const isProperty = propType.includes('flat') || 
                          propType.includes('house') ||
                          propType.includes('apartment') ||
                          propType.includes('hfi');
        const isPlot = propType.includes('plot');
        
        // Match valuation type - if no clear match, allow both
        const matchesType = 
          (selectedValuationType?.id === 'property' && (isProperty || !isPlot)) ||
          (selectedValuationType?.id === 'plot' && (isPlot || !isProperty)) ||
          (!isProperty && !isPlot); // Allow documents that don't clearly match either
        
        if (matchesType) {
          newDocs.push({
            id: `${Date.now()}-${i}`,
            fileName: file.name,
            fileNumber: parsed.fileNumber || '',
            propertyType: parsed.propertyType || '',
            location: parsed.location || '',
            customerName: parsed.customerName || '',
            bankCode: parsed.bankCode || '',
            file,
          });
        }
      }
    }

    setDocuments([...documents, ...newDocs]);
  };

  const handleDocumentClick = (doc: DocumentMetadata) => {
    setSelectedDocument(doc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 backdrop-blur-lg bg-white/80 border-b border-slate-200"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedValuationType(null)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors tap-highlight-transparent"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedValuationType?.name}
            </h2>
            <p className="text-sm text-slate-600">
              {selectedBank?.name} • {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'w-full p-6 rounded-2xl border-2 border-dashed',
            'border-primary-300 bg-primary-50/50',
            'hover:bg-primary-100/50 hover:border-primary-400',
            'active:bg-primary-100',
            'transition-all duration-200 tap-highlight-transparent',
            'flex flex-col items-center gap-3'
          )}
        >
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">Upload Documents</p>
            <p className="text-sm text-slate-600 mt-1">
              Select .docx files from your device
            </p>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-200 mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">No documents uploaded yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Upload documents to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={cn(
                  'w-full p-4 rounded-2xl bg-white shadow-sm',
                  'border-2 border-transparent',
                  'hover:shadow-md hover:scale-[1.01]',
                  'active:scale-[0.99]',
                  'transition-all duration-200 tap-highlight-transparent',
                  'flex items-start gap-4 group'
                )}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: selectedBank?.color + '20' }}
                >
                  <FileText
                    className="w-6 h-6"
                    style={{ color: selectedBank?.color }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {doc.fileNumber} - {doc.propertyType}
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    {doc.customerName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {doc.location}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-2" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
