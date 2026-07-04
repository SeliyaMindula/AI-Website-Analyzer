'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import {
  canvasToBlob,
  downloadBlob,
  loadImageFromFile,
  replaceExtension,
} from '@/lib/image-utils';

type TargetFormat = 'image/png' | 'image/jpeg' | 'image/webp';

const FORMATS: { value: TargetFormat; label: string; ext: string }[] = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
];

export function ConvertImageTool() {
  const [target, setTarget] = useState<TargetFormat>('image/png');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);

  const convert = async (file: File) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      if (target === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const fmt = FORMATS.find((f) => f.value === target)!;
      const blob = await canvasToBlob(canvas, target, target === 'image/png' ? undefined : 0.92);
      setResult({ blob, name: replaceExtension(file.name, fmt.ext) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="wp-card p-4">
        <label className="text-sm text-muted">Convert to</label>
        <div className="flex gap-2 mt-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setTarget(f.value)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                target === f.value
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-muted hover:border-accent/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ImageUpload onFile={convert} disabled={processing} />

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {result && (
        <div className="wp-card p-4 text-center">
          <button type="button" className="wp-btn" onClick={() => downloadBlob(result.blob, result.name)}>
            Download {result.name.split('.').pop()?.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
