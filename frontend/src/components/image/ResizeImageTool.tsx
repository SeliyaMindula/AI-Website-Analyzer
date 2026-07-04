'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import {
  canvasToBlob,
  downloadBlob,
  loadImageFromFile,
  replaceExtension,
} from '@/lib/image-utils';

export function ResizeImageTool() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [aspect, setAspect] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; w: number; h: number } | null>(null);

  const process = async (file: File) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImageFromFile(file);
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspect(ratio);

      let w = width ? parseInt(width, 10) : img.naturalWidth;
      let h = height ? parseInt(height, 10) : img.naturalHeight;
      if (!width && !height) {
        w = img.naturalWidth;
        h = img.naturalHeight;
      } else if (width && !height && lockAspect) {
        h = Math.round(w / ratio);
      } else if (height && !width && lockAspect) {
        w = Math.round(h * ratio);
      }

      if (w < 1 || h < 1) throw new Error('Invalid dimensions');

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(img, 0, 0, w, h);

      const mime = file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await canvasToBlob(canvas, mime, 0.92);
      const ext = file.name.split('.').pop() ?? 'png';
      setResult({ blob, name: replaceExtension(file.name, ext), w, h });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resize failed');
    } finally {
      setProcessing(false);
    }
  };

  const onWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspect && val && aspect) {
      setHeight(String(Math.round(parseInt(val, 10) / aspect)));
    }
  };

  const onHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspect && val && aspect) {
      setWidth(String(Math.round(parseInt(val, 10) * aspect)));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="wp-card p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted">Width (px)</label>
          <input
            type="number"
            min={1}
            placeholder="Auto"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            className="mt-1 w-full wp-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Height (px)</label>
          <input
            type="number"
            min={1}
            placeholder="Auto"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="mt-1 w-full wp-input"
          />
        </div>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={lockAspect}
            onChange={(e) => setLockAspect(e.target.checked)}
            className="accent-teal-600"
          />
          Lock aspect ratio
        </label>
      </div>

      <ImageUpload onFile={process} disabled={processing} />

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {result && (
        <div className="wp-card p-4 text-center space-y-3">
          <p className="text-sm text-muted">New size: {result.w} × {result.h} px</p>
          <button type="button" className="wp-btn" onClick={() => downloadBlob(result.blob, result.name)}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
