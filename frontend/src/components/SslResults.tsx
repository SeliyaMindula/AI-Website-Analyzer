import { SslCheckResult } from '@/types/tools';

export function SslResults({ result }: { result: SslCheckResult }) {
  return (
    <div className="max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{result.domain}</h3>
        <span className={result.valid ? 'text-green-400' : 'text-red-400'}>
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
          <p className="text-xs text-zinc-500 uppercase mb-1">Alt names</p>
          <p className="text-sm text-zinc-300">{result.altNames.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className={`text-right break-all ${highlight ? 'text-amber-400' : 'text-zinc-300'}`}>{value}</span>
    </div>
  );
}
