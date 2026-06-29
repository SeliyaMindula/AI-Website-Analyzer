'use client';

import { useState } from 'react';
import { checkUptime } from '@/lib/api';
import { UptimeCheckResult } from '@/types/tools';
import { UrlForm } from '@/components/UrlForm';
import { UptimeResults } from '@/components/UptimeResults';

export default function UptimePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UptimeCheckResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Uptime Ping</h1>
        <p className="text-zinc-400 mt-2">Check if a site is up and measure response time.</p>
      </div>
      <div className="flex justify-center mb-8">
        <UrlForm
          loading={loading}
          submitLabel="Ping"
          loadingLabel="Pinging…"
          onSubmit={async (url) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await checkUptime(url));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Ping failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {error && <p className="text-center text-red-400">{error}</p>}
      {result && <UptimeResults result={result} />}
    </main>
  );
}
