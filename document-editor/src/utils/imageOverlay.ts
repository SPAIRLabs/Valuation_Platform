import { LocationData } from '../types';
import { headingToDirection } from './locationHelper';

export interface OverlayOptions {
  location: LocationData | null;
  compass: number | null;
  address?: string;
}

// Draw compass overlay on image
const drawCompass = (
  ctx: CanvasRenderingContext2D,
  heading: number,
  x: number,
  y: number,
  size: number
) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2 - 5;

  // Outer circle (dark background)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle (lighter)
  ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Cardinal direction markers
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  const markers = ['N', 'E', 'S', 'W'];
  markers.forEach((marker, i) => {
    const angle = (i * Math.PI) / 2 - Math.PI / 2;
    const startX = centerX + Math.cos(angle) * (radius - 10);
    const startY = centerY + Math.sin(angle) * (radius - 10);
    const endX = centerX + Math.cos(angle) * radius;
    const endY = centerY + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  });

  // North indicator (larger)
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N', centerX, centerY - radius + 15);

  // Compass needle
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((heading * Math.PI) / 180);

  // Red needle pointing north
  ctx.fillStyle = '#00D9FF'; // Cyan color like in reference
  ctx.beginPath();
  ctx.moveTo(0, -radius + 15);
  ctx.lineTo(-6, 0);
  ctx.lineTo(6, 0);
  ctx.closePath();
  ctx.fill();

  // South part (gray)
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.moveTo(0, radius - 15);
  ctx.lineTo(-4, 0);
  ctx.lineTo(4, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

// Overlay location and compass data on image
export const overlayDataOnImage = async (
  imageUrl: string,
  options: OverlayOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw compass if available (top-left corner)
      if (options.compass !== null) {
        const compassSize = Math.min(img.width, img.height) * 0.15; // 15% of image
        const margin = 15;
        drawCompass(ctx, options.compass, margin, margin, compassSize);
      }

      // Prepare location text
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-IN');

      let locationText: string[] = [];
      locationText.push(`${dateStr} ${timeStr}`);

      if (options.location) {
        const { latitude, longitude } = options.location;
        locationText.push(`${latitude.toFixed(6)}N ${longitude.toFixed(6)}E`);
        
        if (options.compass !== null) {
          const direction = headingToDirection(options.compass);
          locationText.push(`${Math.round(options.compass)}° ${direction}`);
        }
        
        if (options.address) {
          locationText.push(options.address);
        }
      }

      // Draw location text overlay (bottom-right)
      const textPadding = 15;
      const lineHeight = 24;
      const fontSize = 16;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      // Draw text background
      const maxTextWidth = Math.max(
        ...locationText.map((text) => ctx.measureText(text).width)
      );
      const bgHeight = locationText.length * lineHeight + textPadding * 2;
      const bgWidth = maxTextWidth + textPadding * 2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        img.width - bgWidth - 10,
        img.height - bgHeight - 10,
        bgWidth,
        bgHeight
      );

      // Draw text
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      locationText.forEach((text, index) => {
        ctx.fillText(
          text,
          img.width - textPadding - 10,
          img.height - textPadding - 10 - (locationText.length - index - 1) * lineHeight
        );
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Could not create blob from canvas'));
        }
      }, 'image/jpeg', 0.95);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

// Convert data URL to File object
export const dataURLtoFile = (dataURL: string, filename: string): File => {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};
