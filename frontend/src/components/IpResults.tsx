import { IpLookupResult } from '@/types/tools';

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-500 shrink-0">{label}</span>
      <span className="text-sm text-zinc-200 text-right font-mono break-all">{value}</span>
    </div>
  );
}

export function IpResults({ result }: { result: IpLookupResult }) {
  const location = [result.city, result.region, result.country].filter(Boolean).join(', ');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-1">
        <p className="text-center text-lg font-semibold text-indigo-400 mb-4 font-mono">{result.ip}</p>
        {result.resolvedFrom && (
          <p className="text-xs text-zinc-500 text-center mb-4">
            Resolved from <span className="text-zinc-400">{result.resolvedFrom}</span>
          </p>
        )}
        <Row label="Location" value={location || 'Unknown'} />
        <Row label="Country code" value={result.countryCode} />
        <Row label="ISP" value={result.isp} />
        <Row label="Timezone" value={result.timezone} />
        {result.latitude != null && result.longitude != null && (
          <Row label="Coordinates" value={`${result.latitude}, ${result.longitude}`} />
        )}
      </div>
    </div>
  );
}
