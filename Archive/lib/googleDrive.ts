import { google } from 'googleapis';
import { FormTemplate, FormField } from '@/store/appStore';

export class GoogleDriveService {
  private drive: any;
  private auth: any;
  private settings: any;

  constructor(settings?: any) {
    this.settings = settings || {};
    
    // Use settings if provided, otherwise fall back to environment variables
    const credentials = settings ? {
      client_email: settings.googleServiceAccountEmail,
      private_key: settings.googleServiceAccountPrivateKey?.replace(/\\n/g, '\n'),
    } : {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async getFormTemplates(folderId: string): Promise<FormTemplate[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
        fields: 'files(id,name,modifiedTime,version)',
        orderBy: 'modifiedTime desc',
      });

      const templates: FormTemplate[] = [];

      for (const file of response.data.files) {
        try {
          const template = await this.parseFormTemplate(file);
          templates.push(template);
        } catch (error) {
          console.error(`Error parsing template ${file.name}:`, error);
        }
      }

      return templates;
    } catch (error) {
      console.error('Error fetching form templates:', error);
      throw error;
    }
  }

  private async parseFormTemplate(file: any): Promise<FormTemplate> {
    try {
      // Export the Google Doc as plain text to parse form fields
      const response = await this.drive.files.export({
        fileId: file.id,
        mimeType: 'text/plain',
      });

      const content = response.data;
      const fields = this.extractFormFields(content);

      return {
        id: file.id,
        name: file.name,
        type: this.determineFormType(file.name),
        fields,
        googleDriveId: file.id,
        version: parseInt(file.version) || 1,
        lastModified: new Date(file.modifiedTime),
      };
    } catch (error) {
      console.error('Error parsing form template:', error);
      throw error;
    }
  }

  private extractFormFields(content: string): FormField[] {
    const fields: FormField[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for field patterns like "Property Address:" or "Square Footage:"
      const fieldMatch = line.match(/^([^:]+):\s*(.*)$/);
      if (fieldMatch) {
        const [, label, defaultValue] = fieldMatch;
        const fieldName = this.sanitizeFieldName(label);
        
        fields.push({
          id: fieldName,
          name: fieldName,
          type: this.determineFieldType(label, defaultValue),
          label: label.trim(),
          required: this.isRequiredField(label),
          options: this.extractOptions(defaultValue),
          validation: this.extractValidation(label),
        });
      }
    }

    return fields;
  }

  private sanitizeFieldName(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  private determineFieldType(label: string, defaultValue: string): FormField['type'] {
    const lowerLabel = label.toLowerCase();
    const lowerValue = defaultValue.toLowerCase();

    if (lowerLabel.includes('date') || lowerLabel.includes('time')) {
      return 'date';
    }
    if (lowerLabel.includes('square footage') || lowerLabel.includes('area') || lowerLabel.includes('size')) {
      return 'number';
    }
    if (lowerLabel.includes('price') || lowerLabel.includes('value') || lowerLabel.includes('cost')) {
      return 'number';
    }
    if (lowerLabel.includes('description') || lowerLabel.includes('notes') || lowerLabel.includes('comments')) {
      return 'textarea';
    }
    if (lowerLabel.includes('type') || lowerLabel.includes('category') || lowerLabel.includes('status')) {
      return 'select';
    }
    if (lowerLabel.includes('yes') || lowerLabel.includes('no') || lowerLabel.includes('check')) {
      return 'checkbox';
    }
    if (lowerValue.includes('select') || lowerValue.includes('choose')) {
      return 'select';
    }

    return 'text';
  }

  private isRequiredField(label: string): boolean {
    const requiredKeywords = ['required', 'mandatory', 'must', 'essential'];
    return requiredKeywords.some(keyword => 
      label.toLowerCase().includes(keyword)
    );
  }

  private extractOptions(defaultValue: string): string[] | undefined {
    if (defaultValue.includes('|') || defaultValue.includes(',')) {
      return defaultValue.split(/[|,]/).map(opt => opt.trim()).filter(opt => opt.length > 0);
    }
    return undefined;
  }

  private extractValidation(label: string): FormField['validation'] {
    const validation: FormField['validation'] = {};

    if (label.toLowerCase().includes('square footage') || label.toLowerCase().includes('area')) {
      validation.min = 0;
      validation.max = 100000;
    }

    if (label.toLowerCase().includes('price') || label.toLowerCase().includes('value')) {
      validation.min = 0;
    }

    return Object.keys(validation).length > 0 ? validation : undefined;
  }

  private determineFormType(filename: string): FormTemplate['type'] {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('residential') || lowerName.includes('home') || lowerName.includes('house')) {
      return 'residential';
    }
    if (lowerName.includes('commercial') || lowerName.includes('office') || lowerName.includes('retail')) {
      return 'commercial';
    }
    if (lowerName.includes('land') || lowerName.includes('lot') || lowerName.includes('vacant')) {
      return 'land';
    }

    return 'residential'; // Default
  }

  async uploadCompletedForm(formData: any, filename: string, folderId: string): Promise<string> {
    try {
      const fileMetadata = {
        name: filename,
        parents: [folderId],
      };

      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(formData, null, 2),
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading completed form:', error);
      throw error;
    }
  }
}
