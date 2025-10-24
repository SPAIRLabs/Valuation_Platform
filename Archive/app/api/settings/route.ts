import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, you would use a database
let settingsStorage: any = {};

export async function GET() {
  try {
    return NextResponse.json(settingsStorage);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'googleDriveApiKey',
      'googleDriveClientId', 
      'googleDriveClientSecret',
      'googleDriveFolderId',
      'googleCloudProjectId',
      'googleCloudStorageBucket',
      'googleServiceAccountEmail',
      'googleServiceAccountPrivateKey',
      'firebaseApiKey',
      'firebaseAuthDomain',
      'firebaseProjectId',
      'firebaseStorageBucket',
      'firebaseMessagingSenderId',
      'firebaseAppId'
    ];

    for (const field of requiredFields) {
      if (!settings[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Store settings
    settingsStorage = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      updatedAt: settingsStorage.updatedAt
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}



