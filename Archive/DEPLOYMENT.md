# Deployment Guide - Property Valuation Platform

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual credentials
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all variables from `.env.local`

### Option 2: Google Cloud Run

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Deploy**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/valuation-platform
   gcloud run deploy --image gcr.io/PROJECT_ID/valuation-platform --platform managed
   ```

### Option 3: Self-Hosted

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## Required Services Setup

### 1. Google Cloud Platform

- **Project**: Create a new GCP project
- **APIs**: Enable Google Drive API and Cloud Storage API
- **Service Account**: Create service account with appropriate permissions
- **Storage Bucket**: Create bucket with CORS configuration

### 2. Firebase

- **Project**: Create Firebase project
- **Authentication**: Enable Email/Password authentication
- **Firestore**: Create database for user data

### 3. Google Drive

- **Folder**: Create folder for form templates
- **Sharing**: Share folder with service account email
- **Templates**: Upload form templates as Google Docs

## Environment Variables Reference

```env
# Google Drive API
GOOGLE_DRIVE_API_KEY=your_api_key
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Testing Checklist

- [ ] Authentication flow works
- [ ] Camera access on mobile devices
- [ ] GPS location capture
- [ ] Photo upload to Cloud Storage
- [ ] Form template loading from Google Drive
- [ ] Offline functionality
- [ ] Auto-save feature
- [ ] Cross-browser compatibility

## Performance Optimization

- **Image Compression**: Photos are automatically compressed before upload
- **Lazy Loading**: Form sections load on demand
- **Caching**: Service worker caches static assets
- **CDN**: Use CloudFlare or similar for static assets

## Security Considerations

- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit credentials to repository
- **CORS**: Configure proper CORS settings
- **Input Validation**: All user inputs are validated
- **Authentication**: Firebase Auth handles user management

## Monitoring

- **Health Check**: `/api/health` endpoint for monitoring
- **Error Tracking**: Integrate with Sentry or similar
- **Analytics**: Google Analytics for usage tracking
- **Logging**: Cloud Logging for server-side logs

## Troubleshooting

### Common Issues

1. **Camera Not Working**:
   - Check HTTPS requirement
   - Verify browser permissions
   - Test on actual mobile device

2. **GPS Not Available**:
   - Check location permissions
   - Test on device with GPS
   - Verify HTTPS requirement

3. **Upload Failures**:
   - Check CORS configuration
   - Verify service account permissions
   - Check bucket configuration

4. **Authentication Issues**:
   - Verify Firebase configuration
   - Check environment variables
   - Test with different browsers

### Support

For technical support:
- Check the README.md for detailed setup instructions
- Review the API documentation
- Contact the development team
- Submit issues through the repository

## Maintenance

### Regular Tasks

- **Backup**: Regular database backups
- **Updates**: Keep dependencies updated
- **Monitoring**: Check application health
- **Security**: Regular security audits

### Scaling

- **Horizontal**: Use load balancers for multiple instances
- **Vertical**: Increase server resources as needed
- **CDN**: Use content delivery networks
- **Database**: Consider database scaling options

---

**Ready to Deploy!** 🚀

The Property Valuation Platform is now complete and ready for production deployment. Follow the setup instructions above to get your platform running.
