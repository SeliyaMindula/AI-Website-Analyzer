'use client';

import { useState } from 'react';
import { checkHeaders } from '@/lib/api';
import { HeadersCheckResult } from '@/types/tools';
import { UrlForm } from '@/components/UrlForm';
import { HeadersResults } from '@/components/HeadersResults';

export default function HeadersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HeadersCheckResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">HTTP Headers</h1>
        <p className="text-muted mt-2">Inspect response headers for any URL.</p>
      </div>
      <div className="flex justify-center mb-8">
        <UrlForm
          loading={loading}
          submitLabel="Check"
          loadingLabel="Fetching…"
          onSubmit={async (url) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await checkHeaders(url));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Header check failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {error && <p className="text-center text-red-600">{error}</p>}
      {result && <HeadersResults result={result} />}
    </main>
  );
}
