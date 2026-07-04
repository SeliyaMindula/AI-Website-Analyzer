'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

type ImageUploadProps = {
  accept?: string;
  onFile: (file: File) => void;
  disabled?: boolean;
  label?: string;
};

export function ImageUpload({
  accept = 'image/png,image/jpeg,image/webp',
  onFile,
  disabled,
  label = 'Drop an image here or click to browse',
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      onFile(file);
    },
    [onFile],
  );

  return (
    <label
      className={`flex flex-col items-center justify-center gap-3 wp-card border-dashed p-10 cursor-pointer transition-colors ${
        dragging ? 'border-accent bg-accent-soft/30' : 'hover:border-accent/50'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Upload className="h-5 w-5" />
      </span>
      <span className="text-sm text-muted text-center">{label}</span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </label>
  );
}
