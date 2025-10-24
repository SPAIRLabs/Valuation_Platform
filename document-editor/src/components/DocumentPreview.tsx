import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';

interface DocumentPreviewProps {
  file: File;
  className?: string;
  changedFields?: Record<string, { old: string; new: string }>;
  onFieldClick?: (fieldKey: string, currentValue: string) => void;
}

export default function DocumentPreview({ file, className = '', changedFields = {}, onFieldClick }: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderDocument = async () => {
      if (!containerRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Render the document
        await renderAsync(arrayBuffer, containerRef.current, undefined, {
          className: 'docx-preview-container',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
        });

        if (!cancelled) {
          setLoading(false);
          
          // Highlight changed text
          if (Object.keys(changedFields).length > 0 && containerRef.current) {
            highlightChanges(containerRef.current, changedFields);
          }
        }
      } catch (err) {
        console.error('Error rendering document:', err);
        if (!cancelled) {
          setError('Failed to load document preview');
          setLoading(false);
        }
      }
    };

    renderDocument();

    return () => {
      cancelled = true;
    };
  }, [file, changedFields]);
  
  const highlightChanges = (container: HTMLElement, changes: Record<string, { old: string; new: string }>) => {
    // Find and highlight changed text in the rendered document
    const textNodes = getTextNodes(container);
    
    Object.entries(changes).forEach(([key, { old: oldValue, new: newValue }]) => {
      if (!oldValue || !newValue || oldValue === newValue) return;
      
      textNodes.forEach(node => {
        if (node.textContent && node.textContent.includes(oldValue)) {
          const parent = node.parentElement;
          if (parent) {
            const html = parent.innerHTML;
            const highlightedHtml = html.replace(
              new RegExp(escapeRegex(oldValue), 'g'),
              `<mark 
                data-field-key="${key}" 
                data-field-value="${escapeHtml(newValue)}"
                style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px; font-weight: 600; cursor: pointer; transition: all 0.2s;" 
                onmouseover="this.style.backgroundColor='#fde047'; this.style.boxShadow='0 0 0 2px #fde047'" 
                onmouseout="this.style.backgroundColor='#fef08a'; this.style.boxShadow='none'"
                title="Click to edit this field"
              >${newValue}</mark>`
            );
            parent.innerHTML = highlightedHtml;
          }
        }
      });
    });
    
    // Add click listeners to all highlighted marks
    if (onFieldClick) {
      const marks = container.querySelectorAll('mark[data-field-key]');
      marks.forEach(mark => {
        const fieldKey = mark.getAttribute('data-field-key');
        const fieldValue = mark.getAttribute('data-field-value');
        if (fieldKey && fieldValue) {
          mark.addEventListener('click', () => {
            onFieldClick(fieldKey, fieldValue);
          });
        }
      });
    }
  };
  
  const escapeHtml = (str: string): string => {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  
  const getTextNodes = (element: HTMLElement): Node[] => {
    const textNodes: Node[] = [];
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else {
        node.childNodes.forEach(child => walk(child));
      }
    };
    walk(element);
    return textNodes;
  };
  
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600">Loading document...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="docx-preview-wrapper overflow-auto bg-white"
        style={{ minHeight: '600px' }}
      />

      <style>{`
        .docx-preview-container {
          padding: 20px;
          background: white;
          max-width: 100%;
        }
        
        .docx-preview-wrapper {
          font-family: 'Calibri', 'Arial', sans-serif;
        }

        .docx-preview-wrapper table {
          border-collapse: collapse;
          width: 100%;
        }

        .docx-preview-wrapper td,
        .docx-preview-wrapper th {
          border: 1px solid #ddd;
          padding: 8px;
        }

        .docx-preview-wrapper p {
          margin: 0.5em 0;
        }

        .docx-preview-wrapper h1,
        .docx-preview-wrapper h2,
        .docx-preview-wrapper h3 {
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
}
