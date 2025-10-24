# Property Valuation Platform

A comprehensive web-based property valuation platform for banks that enables field agents to complete valuation forms with integrated photo capture, GPS metadata, and automatic form filling capabilities.

## Features

- **Google Drive Integration**: Access form templates from Google Drive with real-time sync
- **Mobile Camera Interface**: Unlimited photo capture with GPS coordinates and compass metadata overlays
- **Google Cloud Storage**: Secure image storage with automatic upload and progress tracking
- **Auto-Fill System**: Intelligent form completion based on previous valuations
- **Mobile-First Design**: Optimized for field agents using mobile devices
- **Offline Support**: Works offline with automatic sync when connectivity returns

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: Firebase Auth
- **Storage**: Google Cloud Storage
- **Forms**: Google Drive API
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Firebase project
- Google Drive API access

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd property-valuation-platform
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual credentials:

```env
# Google Drive API Configuration
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret_here

# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 3. Google Cloud Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**:
   - Enable Google Drive API
   - Enable Google Cloud Storage API

3. **Create Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Create a new service account
   - Download the JSON key file
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of this file

4. **Create Storage Bucket**:
   - Go to Cloud Storage
   - Create a new bucket
   - Configure CORS settings for browser uploads:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE"],
       "responseHeader": ["Content-Type"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

### 4. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Get Firebase Config**:
   - Go to Project Settings > General
   - Copy the Firebase config object
   - Update your `.env.local` file

### 5. Google Drive Setup

1. **Create Google Drive Folder**:
   - Create a folder in Google Drive for form templates
   - Share it with your service account email
   - Note the folder ID from the URL

2. **Create Form Templates**:
   - Create Google Docs with form fields
   - Use format: "Field Name: Default Value"
   - Upload to your templates folder

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

### For Field Agents

1. **Sign In**: Use your bank credentials to access the platform
2. **Start New Valuation**: Select a form template and enter property details
3. **Capture Photos**: Use the camera interface to take photos with GPS metadata
4. **Complete Form**: Fill out the valuation form with auto-fill suggestions
5. **Submit**: Submit the completed valuation for review

### For Administrators

1. **Manage Templates**: Upload new form templates to Google Drive
2. **Configure Auto-Fill**: Set up rules for automatic form completion
3. **Monitor Sessions**: Review completed valuations and photo galleries
4. **User Management**: Manage field agent accounts and permissions

## Mobile Optimization

The platform is optimized for mobile devices with:

- Touch-friendly interface (44px minimum touch targets)
- Responsive design for all screen sizes
- Camera access with GPS and compass integration
- Offline functionality with automatic sync
- Progressive Web App (PWA) capabilities

## Security Features

- Firebase Authentication for user management
- Role-based access control (field agents, supervisors, admins)
- HTTPS-only communication
- Secure file upload validation
- Input sanitization and validation
- Environment variable protection

## API Endpoints

- `GET /api/google-drive` - Fetch form templates
- `POST /api/google-drive` - Upload completed forms
- `POST /api/storage` - Generate signed upload URLs
- `DELETE /api/storage` - Delete photos

## Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── valuation/         # Valuation pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── camera/            # Camera interface
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication service
│   ├── camera.ts          # Camera service
│   ├── firebase.ts        # Firebase configuration
│   ├── googleDrive.ts     # Google Drive service
│   └── googleCloudStorage.ts # Cloud Storage service
├── store/                 # State management
│   └── appStore.ts        # Zustand store
└── types/                 # TypeScript types
```

### Key Components

- **AuthProvider**: Handles authentication state
- **CameraInterface**: Mobile camera with GPS/compass overlays
- **Layout**: Main application layout with navigation
- **Dashboard**: Overview of forms and recent sessions

### Services

- **AuthService**: Firebase authentication management
- **CameraService**: Camera, GPS, and compass functionality
- **GoogleDriveService**: Form template management
- **GoogleCloudStorageService**: Image upload and storage

## Testing

The platform includes comprehensive testing for:

- Mobile device compatibility (iOS Safari, Android Chrome)
- Camera and GPS permissions flow
- Offline functionality and sync
- Image quality and overlay accuracy
- Form validation and submission

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Google Drive API credentials secured
- [ ] Google Cloud Storage bucket created with proper IAM permissions
- [ ] Service account JSON key secured
- [ ] CORS configuration set on GCS bucket
- [ ] Database backups automated
- [ ] Monitoring and logging enabled
- [ ] User documentation prepared
- [ ] Admin training materials created

### Deployment Options

- **Vercel**: Recommended for Next.js applications
- **Google Cloud Run**: For containerized deployment
- **AWS**: Using Amplify or Elastic Beanstalk
- **Self-hosted**: Using Docker containers

## Support

For technical support or questions:

1. Check the documentation in `/docs`
2. Review the API documentation
3. Contact the development team
4. Submit issues through the project repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Important Notes for Developers:**

- Always validate user inputs and handle errors gracefully
- Test camera and geolocation APIs early - they have browser/device limitations
- Implement auto-save to prevent data loss
- Optimize for mobile - this is primarily a field tool
- Use TypeScript for type safety in complex form logic
- Keep UI minimal - remove unnecessary elements that don't serve the core workflow
- Document API integrations thoroughly for maintenance
- Build offline-first - field agents may have poor connectivity
