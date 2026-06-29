import { DnsLookupResult } from '@/types/tools';

export function DnsResults({ result }: { result: DnsLookupResult }) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-zinc-500 text-center">Records for <span className="text-zinc-300">{result.domain}</span></p>
      {result.records.length === 0 ? (
        <p className="text-center text-zinc-400">No DNS records found.</p>
      ) : (
        result.records.map((record) => (
          <div key={record.type} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-indigo-400 mb-2">{record.type}</h3>
            <ul className="space-y-1">
              {record.values.map((v, i) => (
                <li key={i} className="text-sm text-zinc-300 font-mono break-all">{v}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
