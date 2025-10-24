import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/googleDrive';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    
    // Get settings from the API
    const settings = await getSettings();
    
    // Check if Google Drive credentials are configured
    if (!settings.googleDriveApiKey || !settings.googleDriveClientId) {
      // Return demo templates when credentials are not configured
      const demoTemplates = [
        {
          id: 'demo-residential',
          name: 'Residential Property Valuation',
          type: 'residential',
          fields: [
            { id: 'property_address', name: 'property_address', type: 'text', label: 'Property Address', required: true },
            { id: 'square_footage', name: 'square_footage', type: 'number', label: 'Square Footage', required: true },
            { id: 'bedrooms', name: 'bedrooms', type: 'number', label: 'Bedrooms', required: false },
            { id: 'bathrooms', name: 'bathrooms', type: 'number', label: 'Bathrooms', required: false },
            { id: 'condition', name: 'condition', type: 'select', label: 'Property Condition', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
            { id: 'notes', name: 'notes', type: 'textarea', label: 'Additional Notes', required: false },
          ],
          googleDriveId: 'demo-id',
          version: 1,
          lastModified: new Date(),
        },
        {
          id: 'demo-commercial',
          name: 'Commercial Property Valuation',
          type: 'commercial',
          fields: [
            { id: 'property_address', name: 'property_address', type: 'text', label: 'Property Address', required: true },
            { id: 'square_footage', name: 'square_footage', type: 'number', label: 'Square Footage', required: true },
            { id: 'property_type', name: 'property_type', type: 'select', label: 'Property Type', required: true, options: ['Office', 'Retail', 'Industrial', 'Warehouse'] },
            { id: 'condition', name: 'condition', type: 'select', label: 'Property Condition', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
            { id: 'notes', name: 'notes', type: 'textarea', label: 'Additional Notes', required: false },
          ],
          googleDriveId: 'demo-id-2',
          version: 1,
          lastModified: new Date(),
        },
      ];
      
      return NextResponse.json({ templates: demoTemplates });
    }
    
    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    // Initialize GoogleDriveService with settings
    const driveService = new GoogleDriveService(settings);
    const templates = await driveService.getFormTemplates(folderId);
    
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching form templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form templates' },
      { status: 500 }
    );
  }
}

async function getSettings() {
  // In a real application, you would fetch this from your database
  // For now, we'll return empty settings
  return {
    googleDriveApiKey: '',
    googleDriveClientId: '',
    googleDriveClientSecret: '',
    googleDriveFolderId: '',
    googleCloudProjectId: '',
    googleCloudStorageBucket: '',
    googleServiceAccountEmail: '',
    googleServiceAccountPrivateKey: '',
    firebaseApiKey: '',
    firebaseAuthDomain: '',
    firebaseProjectId: '',
    firebaseStorageBucket: '',
    firebaseMessagingSenderId: '',
    firebaseAppId: '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, filename, folderId } = body;
    
    if (!formData || !filename || !folderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const driveService = new GoogleDriveService();
    const fileId = await driveService.uploadCompletedForm(formData, filename, folderId);
    
    return NextResponse.json({ fileId });
  } catch (error) {
    console.error('Error uploading form:', error);
    return NextResponse.json(
      { error: 'Failed to upload form' },
      { status: 500 }
    );
  }
}
