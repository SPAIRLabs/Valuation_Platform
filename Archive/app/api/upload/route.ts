
import { NextRequest, NextResponse } from 'next/server';
import { GoogleCloudStorageService } from '@/lib/googleCloudStorage';

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType, propertyId, sessionId } = await req.json();

    if (!fileName || !contentType || !propertyId || !sessionId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const storageService = new GoogleCloudStorageService();
    const signedUrl = await storageService.getSignedUploadUrl(
      fileName,
      contentType,
      propertyId,
      sessionId
    );

    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/valuations/${propertyId}/${sessionId}/photos/${fileName}`;

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 });
  }
}
