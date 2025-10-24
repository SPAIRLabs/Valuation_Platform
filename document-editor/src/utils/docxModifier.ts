import PizZip from 'pizzip';

export interface DocxFieldValues {
  [key: string]: string;
}

/**
 * Extract text content from XML preserving structure
 */
function getTextFromXml(xml: string): string {
  // Extract text from <w:t> tags which contain the actual text in docx
  const textMatches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  return textMatches.map(match => {
    const text = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
    return text;
  }).join('');
}

/**
 * Replace text within XML maintaining structure
 */
function replaceTextInXml(xml: string, searchText: string, replaceText: string): string {
  // Split text across multiple <w:t> tags can happen in Word
  // We need to handle both simple and split cases
  
  let result = xml;
  
  // Simple case: text is in a single <w:t> tag
  const simplePattern = new RegExp(`(<w:t[^>]*>)([^<]*${escapeRegex(searchText)}[^<]*)(<\/w:t>)`, 'gi');
  result = result.replace(simplePattern, (match, openTag, content, closeTag) => {
    const newContent = content.replace(new RegExp(escapeRegex(searchText), 'gi'), replaceText);
    return openTag + newContent + closeTag;
  });
  
  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Modify a .docx file by replacing field values
 * Preserves document structure and formatting
 */
export const modifyDocxFile = async (
  file: File,
  fieldValues: DocxFieldValues
): Promise<Blob> => {
  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the docx file with PizZip
    const zip = new PizZip(arrayBuffer);
    
    // Get the document.xml content (main document content)
    const documentXml = zip.file('word/document.xml')?.asText();
    
    if (!documentXml) {
      throw new Error('Could not read document content');
    }
    
    let modifiedXml = documentXml;
    
    // Replace each field value in the document
    // Look for common patterns like "Label: Value" or just the value
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (!value) return;
      
      // Common field labels to search for
      const labels = [
        'File Number',
        'Property Type',
        'Location',
        'Customer Name',
        'Bank Code',
        'Reference Code',
        'Inspection Date',
        'Inspection Time',
        'Valuer Name',
        'Property Value',
        'Remarks',
        'File No',
        'Type',
        'Customer',
        'Bank',
        'Reference',
        'Date',
        'Time',
        'Valuer',
        'Value',
      ];
      
      // Try to find and replace labeled fields
      labels.forEach(label => {
        if (key.toLowerCase().includes(label.toLowerCase().replace(/ /g, ''))) {
          // Look for patterns like "Label: OldValue" and replace OldValue
          const pattern = new RegExp(
            `(<w:t[^>]*>[^<]*${escapeRegex(label)}\\s*:?\\s*<\/w:t>\\s*<w:t[^>]*>)([^<]*)(<\/w:t>)`,
            'gi'
          );
          modifiedXml = modifiedXml.replace(pattern, `$1${value}$3`);
        }
      });
      
      // Also try direct replacement for bank codes in brackets
      if (key === 'bankCode' || key.toLowerCase().includes('bank')) {
        modifiedXml = replaceTextInXml(modifiedXml, `[${fieldValues.bankCode || ''}]`, `[${value}]`);
        // Try without brackets too
        const oldCode = fieldValues.bankCode;
        if (oldCode) {
          modifiedXml = replaceTextInXml(modifiedXml, oldCode, value);
        }
      }
    });
    
    // Update the document.xml in the zip
    zip.file('word/document.xml', modifiedXml);
    
    // Generate the modified docx file
    const modifiedBlob = zip.generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    return modifiedBlob;
  } catch (error) {
    console.error('Error modifying docx:', error);
    throw error;
  }
};

