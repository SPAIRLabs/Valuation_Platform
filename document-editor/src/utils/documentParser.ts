import { DocumentMetadata, DocumentField } from '../types';

export const parseFileName = (fileName: string): Partial<DocumentMetadata> => {
  // Expected format: "10216 - HFI - Plot no.316 Gruham Exotica - Karmala - Laljibhai Gupta - [bL].docx"
  const parts = fileName.split(' - ');
  
  const fileNumber = parts[0]?.trim() || '';
  const propertyType = parts[1]?.trim() || '';
  const location = parts.length > 3 ? parts[3]?.trim() : '';
  const customerName = parts.length > 4 ? parts[4]?.trim() : '';
  
  // Extract bank code from brackets
  const bankMatch = fileName.match(/\[([^\]]+)\]/);
  const bankCode = bankMatch ? bankMatch[1] : '';
  
  return {
    fileNumber,
    propertyType,
    location,
    customerName,
    bankCode,
  };
};

export const extractDocumentFields = (metadata: DocumentMetadata): DocumentField[] => {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const currentTime = new Date().toLocaleTimeString('en-IN');
  
  // Generate reference code from file number and timestamp
  const referenceCode = `REF-${metadata.fileNumber}-${Date.now().toString().slice(-6)}`;
  
  return [
    {
      label: 'File Number',
      key: 'fileNumber',
      value: metadata.fileNumber,
      editable: true,
    },
    {
      label: 'Reference Code',
      key: 'referenceCode',
      value: referenceCode,
      editable: false,
      automated: true,
    },
    {
      label: 'Property Type',
      key: 'propertyType',
      value: metadata.propertyType,
      editable: true,
    },
    {
      label: 'Location',
      key: 'location',
      value: metadata.location,
      editable: true,
    },
    {
      label: 'Customer Name',
      key: 'customerName',
      value: metadata.customerName,
      editable: true,
    },
    {
      label: 'Bank Code',
      key: 'bankCode',
      value: metadata.bankCode,
      editable: false,
    },
    {
      label: 'Inspection Date',
      key: 'inspectionDate',
      value: currentDate,
      editable: true,
      automated: true,
    },
    {
      label: 'Inspection Time',
      key: 'inspectionTime',
      value: currentTime,
      editable: true,
      automated: true,
    },
    {
      label: 'Valuer Name',
      key: 'valuerName',
      value: '',
      editable: true,
    },
    {
      label: 'Property Value',
      key: 'propertyValue',
      value: '',
      editable: true,
    },
    {
      label: 'Remarks',
      key: 'remarks',
      value: '',
      editable: true,
    },
  ];
};
