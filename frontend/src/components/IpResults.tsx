import { IpLookupResult } from '@/types/tools';

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right font-mono break-all">{value}</span>
    </div>
  );
}

export function IpResults({ result }: { result: IpLookupResult }) {
  const location = [result.city, result.region, result.country].filter(Boolean).join(', ');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="wp-card p-6 space-y-1">
        <p className="text-center text-lg font-semibold text-accent mb-4 font-mono">{result.ip}</p>
        {result.resolvedFrom && (
          <p className="text-xs text-muted text-center mb-4">
            Resolved from <span className="text-foreground">{result.resolvedFrom}</span>
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
