'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
// Removed direct import of GoogleDriveService - will use API route instead
import { FormTemplate } from '@/store/appStore';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Camera,
  MapPin
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Dashboard() {
  const { user, formTemplates, setFormTemplates, capturedPhotos, currentLocation } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    loadFormTemplates();
    loadRecentSessions();
  }, []);

  const loadFormTemplates = async () => {
    try {
      // Use API route instead of direct service import
      const response = await fetch('/api/google-drive?folderId=your_folder_id_here');
      if (response.ok) {
        const data = await response.json();
        setFormTemplates(data.templates || []);
      } else {
        console.error('Failed to load form templates');
        // Set some mock templates for demo purposes
        setFormTemplates([
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
        ]);
      }
    } catch (error) {
      console.error('Failed to load form templates:', error);
      // Set mock templates for demo
      setFormTemplates([
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
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentSessions = async () => {
    // Mock data for now
    setRecentSessions([
      {
        id: '1',
        propertyId: 'PROP-001',
        formType: 'residential',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        photos: 12,
      },
      {
        id: '2',
        propertyId: 'PROP-002',
        formType: 'commercial',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        photos: 8,
      },
    ]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'draft':
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Ready to start a new property valuation? Choose a form template below.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-900">{formTemplates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Photos Today</p>
              <p className="text-2xl font-bold text-gray-900">{capturedPhotos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Location Status</p>
              <p className="text-sm font-bold text-gray-900">
                {currentLocation ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Templates */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Form Templates</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">
            <Plus className="h-4 w-4" />
            <span>New Valuation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {template.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {template.fields.length} fields • Updated {template.lastModified.toLocaleDateString()}
              </p>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[44px]">
                Start Valuation
              </button>
            </div>
          ))}
        </div>

        {formTemplates.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No form templates available</p>
            <p className="text-sm text-gray-500">Contact your administrator to set up form templates</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Sessions</h2>
        <div className="space-y-4">
          {recentSessions.map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(session.status)}
                <div>
                  <p className="font-medium text-gray-900">{session.propertyId}</p>
                  <p className="text-sm text-gray-600">
                    {session.formType} • {session.photos} photos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                  {session.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  {session.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
