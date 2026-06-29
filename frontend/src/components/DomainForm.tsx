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
        className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white"
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 font-medium disabled:opacity-50">
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
