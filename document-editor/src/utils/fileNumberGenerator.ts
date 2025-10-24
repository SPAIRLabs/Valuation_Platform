/**
 * Generate a unique file number for new documents
 * Reads existing file numbers from CSV and generates the next sequential number
 */

export const generateFileNumber = async (): Promise<string> => {
  try {
    // Read the CSV to get existing file numbers
    const response = await fetch('/api/csv/logs');
    const csvText = await response.text();
    
    // Parse CSV to extract file numbers
    const lines = csvText.split('\n').slice(1); // Skip header
    const fileNumbers: number[] = [];
    
    lines.forEach(line => {
      if (line.trim()) {
        const columns = line.split(',');
        const fileNumber = columns[2]; // fileNumber is 3rd column
        if (fileNumber && !isNaN(parseInt(fileNumber))) {
          fileNumbers.push(parseInt(fileNumber));
        }
      }
    });
    
    // Find the maximum file number and add 1
    if (fileNumbers.length > 0) {
      const maxNumber = Math.max(...fileNumbers);
      return (maxNumber + 1).toString();
    }
    
    // Default starting number if no existing file numbers
    return '10000';
  } catch (error) {
    console.error('Error generating file number:', error);
    // Fallback to timestamp-based number
    return Date.now().toString().slice(-5);
  }
};

/**
 * Get the next file number without making an API call
 * Uses current timestamp as fallback
 */
export const getNewFileNumber = (): string => {
  // Generate based on current timestamp
  const timestamp = Date.now();
  const lastFiveDigits = timestamp.toString().slice(-5);
  return `1${lastFiveDigits}`; // Prefix with 1 to make it look like a proper file number
};
