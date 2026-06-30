'use client';

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
        onSubmit(String(fd.get('url') ?? ''));
      }}
    >
      <input
        name="url"
        type="url"
        required
        placeholder="https://example.com"
        className="wp-input"
      />
      <button type="submit" disabled={loading} className="wp-btn">
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
