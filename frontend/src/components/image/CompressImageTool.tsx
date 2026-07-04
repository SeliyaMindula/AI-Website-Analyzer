'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import {
  canvasToBlob,
  downloadBlob,
  formatBytes,
  loadImageFromFile,
  replaceExtension,
} from '@/lib/image-utils';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export function CompressImageTool() {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ before: number; after: number; blob: Blob; name: string } | null>(null);

  const compress = async (file: File) => {
    setProcessing(true);
    setError(null);
    setStats(null);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, format, quality / 100);
      const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
      setStats({
        before: file.size,
        after: blob.size,
        blob,
        name: replaceExtension(file.name, ext),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="wp-card p-4 space-y-4">
        <div>
          <label className="text-sm text-muted">Output format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="mt-1 w-full wp-input"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Quality: {quality}%</label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-2 w-full accent-teal-600"
          />
        </div>
      </div>

      <ImageUpload onFile={compress} disabled={processing} />

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {stats && (
        <div className="wp-card p-4 text-center space-y-3">
          <p className="text-sm text-muted">
            {formatBytes(stats.before)} → <span className="text-accent font-semibold">{formatBytes(stats.after)}</span>
            {' '}
            ({Math.round((1 - stats.after / stats.before) * 100)}% smaller)
          </p>
          <button type="button" className="wp-btn" onClick={() => downloadBlob(stats.blob, stats.name)}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
