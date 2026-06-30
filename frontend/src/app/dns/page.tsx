'use client';

import { useState } from 'react';
import { lookupDns } from '@/lib/api';
import { DnsLookupResult } from '@/types/tools';
import { DomainForm } from '@/components/DomainForm';
import { DnsResults } from '@/components/DnsResults';

export default function DnsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DnsLookupResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">DNS Lookup</h1>
        <p className="text-muted mt-2">View DNS records for any domain.</p>
      </div>
      <div className="flex justify-center mb-8">
        <DomainForm
          loading={loading}
          onSubmit={async (domain) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await lookupDns(domain));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Lookup failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {error && <p className="text-center text-red-600">{error}</p>}
      {result && <DnsResults result={result} />}
    </main>
  );
}
