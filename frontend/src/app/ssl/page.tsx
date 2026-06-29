'use client';

import { useState } from 'react';
import { checkSsl } from '@/lib/api';
import { SslCheckResult } from '@/types/tools';
import { DomainForm } from '@/components/DomainForm';
import { SslResults } from '@/components/SslResults';

export default function SslPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SslCheckResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">SSL Certificate Check</h1>
        <p className="text-zinc-400 mt-2">Verify certificate validity and expiry.</p>
      </div>
      <div className="flex justify-center mb-8">
        <DomainForm
          loading={loading}
          submitLabel="Check SSL"
          loadingLabel="Checking…"
          onSubmit={async (domain) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await checkSsl(domain));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'SSL check failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {error && <p className="text-center text-red-400">{error}</p>}
      {result && <SslResults result={result} />}
    </main>
  );
}
