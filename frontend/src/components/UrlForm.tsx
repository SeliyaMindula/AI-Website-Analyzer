'use client';

import { useState } from 'react';
import { validateUrlInput } from '@/lib/url-utils';

export function UrlForm({
  onSubmit,
  loading,
  submitLabel = 'Analyze',
  loadingLabel = 'Analyzing…',
}: {
  onSubmit: (url: string) => void;
  loading: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}) {
  const [validationError, setValidationError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl space-y-2">
    <form
      className="flex gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setValidationError(null);
        const fd = new FormData(e.currentTarget);
        const raw = String(fd.get('url') ?? '').trim();
        if (!raw) return;
        try {
          onSubmit(validateUrlInput(raw));
        } catch (err) {
          setValidationError(err instanceof Error ? err.message : 'Please enter a valid URL');
        }
      }}
    >
      <input
        name="url"
        type="text"
        required
        inputMode="url"
        autoComplete="url"
        placeholder="example.com"
        className="wp-input"
      />
      <button type="submit" disabled={loading} className="wp-btn">
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
    {validationError && (
      <p className="text-center text-sm text-red-600">{validationError}</p>
    )}
    </div>
  );
}
