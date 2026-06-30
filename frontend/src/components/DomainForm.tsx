'use client';

export function DomainForm({
  onSubmit,
  loading,
  submitLabel = 'Lookup',
  loadingLabel = 'Looking up…',
  placeholder = 'example.com',
}: {
  onSubmit: (domain: string) => void;
  loading: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  placeholder?: string;
}) {
  return (
    <form
      className="flex gap-2 w-full max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit(String(fd.get('domain') ?? ''));
      }}
    >
      <input
        name="domain"
        type="text"
        required
        placeholder={placeholder}
        className="wp-input"
      />
      <button type="submit" disabled={loading} className="wp-btn">
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
