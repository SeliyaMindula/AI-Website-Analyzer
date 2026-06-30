import { SslCheckResult } from '@/types/tools';

export function SslResults({ result }: { result: SslCheckResult }) {
  return (
    <div className="max-w-lg mx-auto wp-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{result.domain}</h3>
        <span className={result.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
          {result.valid ? 'Valid' : 'Invalid / Expired'}
        </span>
      </div>
      <Row label="Issuer" value={result.issuer} />
      <Row label="Subject" value={result.subject} />
      <Row label="Valid from" value={new Date(result.validFrom).toLocaleDateString()} />
      <Row label="Valid to" value={new Date(result.validTo).toLocaleDateString()} />
      <Row label="Days remaining" value={String(result.daysRemaining)} highlight={result.daysRemaining < 30} />
      <Row label="TLS protocol" value={result.protocol} />
      {result.altNames.length > 0 && (
        <div>
          <p className="text-xs text-muted uppercase mb-1">Alt names</p>
          <p className="text-sm text-foreground">{result.altNames.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-muted shrink-0">{label}</span>
      <span className={`text-right break-all ${highlight ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
