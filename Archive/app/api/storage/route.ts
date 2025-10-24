import { NextRequest, NextResponse } from 'next/server';
import { GoogleCloudStorageService } from '@/lib/googleCloudStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, propertyId, sessionId } = body;
    
    if (!fileName || !contentType || !propertyId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const storageService = new GoogleCloudStorageService();
    const signedUrl = await storageService.getSignedUploadUrl(
      fileName,
      contentType,
      propertyId,
      sessionId
    );
    
    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const propertyId = searchParams.get('propertyId');
    const sessionId = searchParams.get('sessionId');
    
    if (!fileName || !propertyId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const storageService = new GoogleCloudStorageService();
    await storageService.deletePhoto(fileName, propertyId, sessionId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
