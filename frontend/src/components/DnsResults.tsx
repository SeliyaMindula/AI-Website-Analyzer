import { DnsLookupResult } from '@/types/tools';

export function DnsResults({ result }: { result: DnsLookupResult }) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-muted text-center">Records for <span className="text-foreground font-medium">{result.domain}</span></p>
      {result.records.length === 0 ? (
        <p className="text-center text-muted">No DNS records found.</p>
      ) : (
        result.records.map((record) => (
          <div key={record.type} className="wp-card p-4">
            <h3 className="text-sm font-semibold text-accent mb-2">{record.type}</h3>
            <ul className="space-y-1">
              {record.values.map((v, i) => (
                <li key={i} className="text-sm text-foreground font-mono break-all">{v}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
