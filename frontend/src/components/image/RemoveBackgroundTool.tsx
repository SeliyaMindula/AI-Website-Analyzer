'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { downloadBlob, formatBytes } from '@/lib/image-utils';

/** Self-hosted from public/bg-removal (copied at build via scripts/copy-bg-models.mjs). */
const MODEL_PUBLIC_PATH = '/bg-removal/';

export function RemoveBackgroundTool() {
  const [phase, setPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState('image.png');

  const process = async (file: File) => {
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultBlob(null);
    setOriginalName(file.name);
    setPhase('Loading AI model (first time may take a moment)…');

    try {
      const { removeBackground, preload } = await import('@imgly/background-removal');

      await preload({
        publicPath: MODEL_PUBLIC_PATH,
        model: 'small',
        progress: (key, current, total) => {
          if (total > 0) {
            setPhase(`Loading model… ${Math.round((current / total) * 100)}%`);
          } else {
            setPhase(`Loading ${key}…`);
          }
        },
      });

      setPhase('Removing background…');
      const blob = await removeBackground(file, {
        publicPath: MODEL_PUBLIC_PATH,
        model: 'small',
        output: { format: 'image/png' },
      });
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Background removal failed';
      setError(
        message.includes('metadata') || message.includes('fetch')
          ? 'AI model files missing. Run: npm install && npm run build'
          : message,
      );
    } finally {
      setPhase(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ImageUpload onFile={process} disabled={!!phase} label="Upload PNG, JPG, or WebP" />

      {phase && <p className="text-center text-sm text-muted animate-pulse">{phase}</p>}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {resultUrl && resultBlob && (
        <div className="space-y-4">
          <div className="wp-card p-4 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted uppercase mb-2">Result preview</p>
              <div className="rounded-lg bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#334155_0%_25%,#1e293b_0%_50%)] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Background removed" className="max-h-48 mx-auto object-contain" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <p className="text-sm text-muted">Output size: {formatBytes(resultBlob.size)}</p>
              <button
                type="button"
                className="wp-btn"
                onClick={() => downloadBlob(resultBlob, originalName.replace(/\.[^.]+$/, '') + '-nobg.png')}
              >
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
