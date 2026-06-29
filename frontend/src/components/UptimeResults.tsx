import { UptimeCheckResult } from '@/types/tools';

export function UptimeResults({ result }: { result: UptimeCheckResult }) {
  return (
    <div className="max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Status</span>
        <span className={`text-lg font-bold ${result.up ? 'text-green-400' : 'text-red-400'}`}>
          {result.up ? 'UP' : 'DOWN'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="HTTP code" value={String(result.statusCode)} />
        <Stat label="Response" value={`${result.responseTimeMs} ms`} />
      </div>
      <p className="text-sm text-zinc-500 truncate">Final URL: <span className="text-zinc-400">{result.finalUrl}</span></p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3">
      <p className="text-xs text-zinc-500 uppercase">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
