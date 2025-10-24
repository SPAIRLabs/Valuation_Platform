'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTemplate, FormField } from '@/store/appStore';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';

const formDataSchema = z.record(z.any());

type FormData = z.infer<typeof formDataSchema>;

interface DynamicFormProps {
  template: FormTemplate;
  initialData?: FormData;
  onSave?: (data: FormData) => void;
  onSubmit?: (data: FormData) => void;
  isReadOnly?: boolean;
}

export default function DynamicForm({
  template,
  initialData = {},
  onSave,
  onSubmit,
  isReadOnly = false,
}: DynamicFormProps) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialData,
  });

  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && !isAutoSaving) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [watchedValues, isDirty]);

  const handleAutoSave = async () => {
    if (!onSave || isReadOnly) return;

    setIsAutoSaving(true);
    try {
      await onSave(watchedValues);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setHasUnsavedChanges(true);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!onSave || isReadOnly) return;

    setIsAutoSaving(true);
    try {
      await onSave(watchedValues);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];
    const isRequired = field.required;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...register(field.id, {
                required: isRequired ? `${field.label} is required` : false,
                pattern: field.validation?.pattern ? {
                  value: new RegExp(field.validation.pattern),
                  message: 'Invalid format'
                } : undefined,
              })}
              type="text"
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...register(field.id, {
                required: isRequired ? `${field.label} is required` : false,
                valueAsNumber: true,
                min: field.validation?.min ? {
                  value: field.validation.min,
                  message: `Minimum value is ${field.validation.min}`
                } : undefined,
                max: field.validation?.max ? {
                  value: field.validation.max,
                  message: `Maximum value is ${field.validation.max}`
                } : undefined,
              })}
              type="number"
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...register(field.id, {
                required: isRequired ? `${field.label} is required` : false,
              })}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...register(field.id, {
                required: isRequired ? `${field.label} is required` : false,
              })}
              rows={4}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...register(field.id, {
                required: isRequired ? `${field.label} is required` : false,
              })}
              type="date"
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                {...register(field.id)}
                type="checkbox"
                disabled={isReadOnly}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {fieldError && (
              <p className="text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-600">
              {template.fields.length} fields • {template.type} valuation
            </p>
          </div>
          
          {!isReadOnly && (
            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              <div className="flex items-center space-x-2 text-sm">
                {isAutoSaving ? (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                ) : hasUnsavedChanges ? (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Unsaved changes</span>
                  </div>
                ) : null}
              </div>

              {/* Manual save button */}
              <button
                onClick={handleManualSave}
                disabled={isAutoSaving || !isDirty}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.fields.map(renderField)}
          </div>
        </div>

        {/* Submit Button */}
        {!isReadOnly && onSubmit && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
            >
              Submit Valuation
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
