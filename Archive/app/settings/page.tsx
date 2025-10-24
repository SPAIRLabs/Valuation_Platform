'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Settings, 
  Key, 
  Cloud, 
  Database, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const settingsSchema = z.object({
  // Google Drive API
  googleDriveApiKey: z.string().min(1, 'Google Drive API Key is required'),
  googleDriveClientId: z.string().min(1, 'Google Drive Client ID is required'),
  googleDriveClientSecret: z.string().min(1, 'Google Drive Client Secret is required'),
  googleDriveFolderId: z.string().min(1, 'Google Drive Folder ID is required'),
  
  // Google Cloud Storage
  googleCloudProjectId: z.string().min(1, 'Google Cloud Project ID is required'),
  googleCloudStorageBucket: z.string().min(1, 'Google Cloud Storage Bucket is required'),
  googleServiceAccountEmail: z.string().email('Invalid email format'),
  googleServiceAccountPrivateKey: z.string().min(1, 'Service Account Private Key is required'),
  
  // Firebase
  firebaseApiKey: z.string().min(1, 'Firebase API Key is required'),
  firebaseAuthDomain: z.string().min(1, 'Firebase Auth Domain is required'),
  firebaseProjectId: z.string().min(1, 'Firebase Project ID is required'),
  firebaseStorageBucket: z.string().min(1, 'Firebase Storage Bucket is required'),
  firebaseMessagingSenderId: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  firebaseAppId: z.string().min(1, 'Firebase App ID is required'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface ApiKeySettings {
  googleDriveApiKey: string;
  googleDriveClientId: string;
  googleDriveClientSecret: string;
  googleDriveFolderId: string;
  googleCloudProjectId: string;
  googleCloudStorageBucket: string;
  googleServiceAccountEmail: string;
  googleServiceAccountPrivateKey: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<Record<string, 'idle' | 'success' | 'error'>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
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
    },
  });

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        reset(settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSaveStatus('success');
        // Store settings in localStorage for client-side access
        localStorage.setItem('apiSettings', JSON.stringify(data));
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testConnection = async (service: string) => {
    setTestResults(prev => ({ ...prev, [service]: 'idle' }));
    
    try {
      const response = await fetch(`/api/test-connection?service=${service}`);
      const result = await response.json();
      
      setTestResults(prev => ({ 
        ...prev, 
        [service]: result.success ? 'success' : 'error' 
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: 'error' }));
    }
  };

  const getTestIcon = (service: string) => {
    const status = testResults[service];
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400" />;
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Configuration</h1>
            <p className="text-gray-600">Configure your API keys and service credentials</p>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Settings saved successfully!</span>
            </div>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to save settings. Please try again.</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Google Drive API Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Key className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Google Drive API</h2>
            </div>
            <button
              type="button"
              onClick={() => testConnection('google-drive')}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 min-h-[44px]"
            >
              {getTestIcon('google-drive')}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <div className="relative">
                <input
                  {...register('googleDriveApiKey')}
                  type={showSecrets.googleDriveApiKey ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Google Drive API Key"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('googleDriveApiKey')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.googleDriveApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.googleDriveApiKey && (
                <p className="mt-1 text-sm text-red-600">{errors.googleDriveApiKey.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID *
              </label>
              <input
                {...register('googleDriveClientId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Google Drive Client ID"
              />
              {errors.googleDriveClientId && (
                <p className="mt-1 text-sm text-red-600">{errors.googleDriveClientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret *
              </label>
              <div className="relative">
                <input
                  {...register('googleDriveClientSecret')}
                  type={showSecrets.googleDriveClientSecret ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Google Drive Client Secret"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('googleDriveClientSecret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.googleDriveClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.googleDriveClientSecret && (
                <p className="mt-1 text-sm text-red-600">{errors.googleDriveClientSecret.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder ID *
              </label>
              <input
                {...register('googleDriveFolderId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Google Drive Folder ID"
              />
              {errors.googleDriveFolderId && (
                <p className="mt-1 text-sm text-red-600">{errors.googleDriveFolderId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Google Cloud Storage Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Cloud className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Google Cloud Storage</h2>
            </div>
            <button
              type="button"
              onClick={() => testConnection('google-cloud')}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 min-h-[44px]"
            >
              {getTestIcon('google-cloud')}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID *
              </label>
              <input
                {...register('googleCloudProjectId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Google Cloud Project ID"
              />
              {errors.googleCloudProjectId && (
                <p className="mt-1 text-sm text-red-600">{errors.googleCloudProjectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Bucket *
              </label>
              <input
                {...register('googleCloudStorageBucket')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Storage Bucket Name"
              />
              {errors.googleCloudStorageBucket && (
                <p className="mt-1 text-sm text-red-600">{errors.googleCloudStorageBucket.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Account Email *
              </label>
              <input
                {...register('googleServiceAccountEmail')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="service-account@project.iam.gserviceaccount.com"
              />
              {errors.googleServiceAccountEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.googleServiceAccountEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key *
              </label>
              <div className="relative">
                <textarea
                  {...register('googleServiceAccountPrivateKey')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                />
              </div>
              {errors.googleServiceAccountPrivateKey && (
                <p className="mt-1 text-sm text-red-600">{errors.googleServiceAccountPrivateKey.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Firebase Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Firebase</h2>
            </div>
            <button
              type="button"
              onClick={() => testConnection('firebase')}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 min-h-[44px]"
            >
              {getTestIcon('firebase')}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <div className="relative">
                <input
                  {...register('firebaseApiKey')}
                  type={showSecrets.firebaseApiKey ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Firebase API Key"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('firebaseApiKey')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.firebaseApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.firebaseApiKey && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseApiKey.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auth Domain *
              </label>
              <input
                {...register('firebaseAuthDomain')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="project.firebaseapp.com"
              />
              {errors.firebaseAuthDomain && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseAuthDomain.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID *
              </label>
              <input
                {...register('firebaseProjectId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Firebase Project ID"
              />
              {errors.firebaseProjectId && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseProjectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Bucket *
              </label>
              <input
                {...register('firebaseStorageBucket')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="project.appspot.com"
              />
              {errors.firebaseStorageBucket && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseStorageBucket.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaging Sender ID *
              </label>
              <input
                {...register('firebaseMessagingSenderId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Messaging Sender ID"
              />
              {errors.firebaseMessagingSenderId && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseMessagingSenderId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App ID *
              </label>
              <input
                {...register('firebaseAppId')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="1:123456789:web:abcdef123456"
              />
              {errors.firebaseAppId && (
                <p className="mt-1 text-sm text-red-600">{errors.firebaseAppId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help Getting Your API Keys?</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Google Drive API:</strong>
            <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
              <li>Go to <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Create a new project or select existing one</li>
              <li>Enable Google Drive API</li>
              <li>Create credentials (API Key and OAuth 2.0 Client)</li>
              <li>Create a folder in Google Drive and get its ID from the URL</li>
            </ol>
          </div>
          <div>
            <strong>Google Cloud Storage:</strong>
            <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Enable Cloud Storage API</li>
              <li>Create a storage bucket</li>
              <li>Create a service account and download the JSON key</li>
            </ol>
          </div>
          <div>
            <strong>Firebase:</strong>
            <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
              <li>Create a new project</li>
              <li>Enable Authentication (Email/Password)</li>
              <li>Go to Project Settings > General</li>
              <li>Copy the Firebase config object values</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

