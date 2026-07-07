'use client';

import { normalizeUrl } from '@/lib/url-utils';

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
  return (
    <form
      className="flex gap-2 w-full max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const raw = String(fd.get('url') ?? '').trim();
        if (!raw) return;
        onSubmit(normalizeUrl(raw));
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
  );
}
