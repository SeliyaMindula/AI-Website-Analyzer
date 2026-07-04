import { HeadersCheckResult } from '@/types/tools';

function highlightHeader(name: string): boolean {
  const key = name.toLowerCase();
  return (
    key.includes('security') ||
    key.includes('content-type') ||
    key.includes('cache') ||
    key.includes('server') ||
    key.startsWith('x-') ||
    key === 'strict-transport-security' ||
    key === 'content-security-policy'
  );
}

export function HeadersResults({ result }: { result: HeadersCheckResult }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="wp-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted uppercase">Status</p>
          <p className="text-lg font-semibold text-foreground">{result.statusCode}</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-xs text-muted uppercase">Final URL</p>
          <p className="text-sm text-foreground truncate max-w-xs">{result.finalUrl}</p>
        </div>
      </div>

      <div className="wp-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Response headers ({result.headers.length})
          </h2>
        </div>
        <ul className="divide-y divide-border max-h-[480px] overflow-y-auto">
          {result.headers.map(({ name, value }) => (
            <li
              key={name}
              className={`px-4 py-3 ${highlightHeader(name) ? 'bg-surface-muted/50' : ''}`}
            >
              <p className="text-xs font-medium text-accent font-mono">{name}</p>
              <p className="text-sm text-foreground font-mono break-all mt-1">{value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
