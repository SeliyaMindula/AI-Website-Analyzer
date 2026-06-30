'use client';

import { useState } from 'react';
import { lookupIp } from '@/lib/api';
import { IpLookupResult } from '@/types/tools';
import { DomainForm } from '@/components/DomainForm';
import { IpResults } from '@/components/IpResults';

export default function IpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IpLookupResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">IP / Geolocation</h1>
        <p className="text-muted mt-2">Look up location and network info for a domain or IP address.</p>
      </div>
      <div className="flex justify-center mb-8">
        <DomainForm
          loading={loading}
          placeholder="example.com or 8.8.8.8"
          submitLabel="Look up"
          loadingLabel="Looking up…"
          onSubmit={async (query) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await lookupIp(query));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Lookup failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {error && <p className="text-center text-red-600">{error}</p>}
      {result && <IpResults result={result} />}
    </main>
  );
}
