import { UptimeCheckResult } from '@/types/tools';

export function UptimeResults({ result }: { result: UptimeCheckResult }) {
  return (
    <div className="max-w-lg mx-auto wp-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">Status</span>
        <span className={`text-lg font-bold ${result.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {result.up ? 'UP' : 'DOWN'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="HTTP code" value={String(result.statusCode)} />
        <Stat label="Response" value={`${result.responseTimeMs} ms`} />
      </div>
      <p className="text-sm text-muted truncate">Final URL: <span className="text-foreground">{result.finalUrl}</span></p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="wp-stat">
      <p className="text-xs text-muted uppercase">{label}</p>
      <p className="text-lg font-semibold mt-1 text-foreground">{value}</p>
    </div>
  );
}
