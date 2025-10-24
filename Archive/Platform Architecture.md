# Property Valuation Platform - Development Instructions

## Project Overview
Build a web-based property valuation platform for banks that enables field agents to complete valuation forms with integrated photo capture, GPS metadata, and automatic form filling capabilities.

## Core Requirements

### 1. Google Drive Integration
- Implement Google Drive API integration for form template access
- Create authentication flow using OAuth 2.0 for secure Google Drive access
- Fetch form templates from a designated Google Drive folder
- Support multiple form types (residential, commercial, land valuation, etc.)
- Implement real-time sync to update forms when templates change
- Store completed forms back to Google Drive in organized folder structure

### 2. Mobile Camera & Image Capture
- Build responsive camera interface optimized for mobile devices
- Use browser's MediaDevices API (`navigator.mediaDevices.getUserMedia()`) for camera access
- Implement unlimited photo capture per valuation session
- Auto-generate file names with timestamps and sequence numbers
- Organize photos by property ID and valuation session

**Image Metadata Overlays:**
- Capture GPS coordinates using Geolocation API (`navigator.geolocation`)
- Display coordinates overlay on each photo (latitude/longitude)
- Capture device compass orientation using DeviceOrientationEvent API
- Show compass direction overlay (N, NE, E, SE, S, SW, W, NW with degrees)
- Embed timestamp on each photo
- Ensure overlays are permanently rendered on images before storage

### 3. Storage Architecture - Google Cloud Storage
- Implement Google Cloud Storage for all image and document storage
- Use `@google-cloud/storage` Node.js client library
- Create automatic upload queue for captured images
- Enable real-time sync with progress indicators
- Implement offline-first architecture with local caching
- Auto-retry failed uploads with exponential backoff
- Organize storage structure: `/valuations/{property-id}/{session-id}/photos/`
- Configure bucket with proper CORS settings for browser uploads
- Set appropriate IAM roles and service account permissions
- Enable versioning for audit trail capability

### 4. Auto-Fill Backend System
- Create admin panel for defining auto-fill rules
- Implement text extraction from previous valuations
- Support field-level auto-complete suggestions
- Enable backend configuration for:
  - Property type defaults
  - Common measurements and descriptions
  - Address auto-completion
  - Valuation templates by property category
- Use ML-based suggestions if possible (optional enhancement)

### 5. UI/UX Design Principles
**Visual & Minimal:**
- Clean, spacious layout with ample whitespace
- Large, touch-friendly buttons (minimum 44x44px)
- Minimalist color scheme (2-3 primary colors)
- Clear typography hierarchy
- Progressive disclosure (show only necessary fields)
- Step-by-step wizard for form completion
- Bottom navigation for mobile
- Card-based layouts for form sections
- Inline validation with subtle error messages

## Technical Stack Recommendations

### Frontend
- **Framework:** React.js or Next.js for modern, responsive UI
- **Styling:** Tailwind CSS for minimal, utility-first design
- **State Management:** React Context or Zustand for lightweight state
- **PWA:** Service Workers for offline functionality
- **Camera Library:** react-webcam or native MediaDevices API

### Backend
- **API:** Node.js with Express or Next.js API routes
- **Database:** PostgreSQL or MongoDB for form data and metadata
- **Authentication:** Firebase Auth or Auth0 for user management
- **Storage:** Google Cloud Storage for images and documents
- **Drive API:** Google APIs Node.js client
- **GCS Client:** @google-cloud/storage npm package

### Mobile Optimization
- Responsive design (mobile-first approach)
- Touch gesture support
- Prevent zoom on input focus
- Optimize image compression before upload
- Battery-efficient background sync

## Critical Implementation Details

### Image Overlay Implementation
```javascript
// Capture image with overlays before storage
1. Capture camera frame to canvas
2. Get GPS coordinates and compass heading
3. Draw overlays on canvas (coordinates, direction, timestamp)
4. Convert canvas to blob/file
5. Upload processed image with embedded metadata
```

### Error Handling
- Graceful degradation when GPS/compass unavailable
- Clear error messages for camera permission denials
- Retry logic for network failures
- Data validation before form submission
- Prevent data loss with auto-save drafts

### Performance Optimization
- Lazy load form sections
- Image compression (resize to max 1920px width)
- Debounced auto-save (every 2-3 seconds)
- Paginated form history
- Virtualized lists for long photo galleries

## Security Considerations
- Implement proper authentication for all users
- Role-based access control (field agents vs. admin)
- Encrypt sensitive data in transit (HTTPS only)
- Validate all file uploads (type, size, content)
- Sanitize user inputs to prevent XSS
- Secure Google Drive API credentials (use environment variables)

## Development Phases

**Phase 1 - Core Infrastructure:**
- Set up project structure and dependencies
- Implement authentication system
- Configure Google Drive API integration
- Create basic form rendering engine

**Phase 2 - Camera & Storage:**
- Build camera capture interface
- Implement GPS and compass metadata capture
- Create image overlay system
- Set up Google Cloud Storage bucket and configure permissions
- Implement signed URL generation for secure uploads
- Create upload pipeline with progress tracking

**Phase 3 - Auto-Fill System:**
- Develop admin panel for auto-fill rules
- Implement suggestion engine
- Create field mapping system
- Build preview and testing tools

**Phase 4 - Polish & Testing:**
- Optimize mobile performance
- Implement offline mode
- Comprehensive testing on multiple devices
- User acceptance testing with bank staff

## Testing Requirements
- Test on iOS Safari and Android Chrome
- Verify camera and GPS permissions flow
- Test offline functionality and sync
- Validate image quality and overlay accuracy
- Load testing for concurrent users
- Security penetration testing

## Deployment Checklist
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Google Drive API credentials secured
- [ ] Google Cloud Storage bucket created with proper IAM permissions
- [ ] Service account JSON key secured (never commit to repo)
- [ ] CORS configuration set on GCS bucket
- [ ] Database backups automated
- [ ] Monitoring and logging enabled (Cloud Logging recommended)
- [ ] User documentation prepared
- [ ] Admin training materials created

## Key Success Metrics
- Photo upload success rate > 99%
- Form completion time < 15 minutes
- GPS accuracy within 10 meters
- Zero data loss incidents
- Mobile page load < 2 seconds

---

## Important Notes for Cursor Agent

1. **Always validate user inputs** and handle errors gracefully
2. **Test camera and geolocation APIs** early - they have browser/device limitations
3. **Implement auto-save** to prevent data loss
4. **Optimize for mobile** - this is primarily a field tool
5. **Use TypeScript** for type safety in complex form logic
6. **Keep UI minimal** - remove unnecessary elements that don't serve the core workflow
7. **Document API integrations** thoroughly for maintenance
8. **Build offline-first** - field agents may have poor connectivity

Start with Phase 1, ensure each component works reliably before moving to the next phase. Prioritize mobile experience and data integrity above all else.