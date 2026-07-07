'use client';

import { useState } from 'react';
import { checkBrokenLinks } from '@/lib/api';
import { BrokenLinksResult } from '@/types/tools';
import { BrokenLinksResults } from '@/components/BrokenLinksResults';
import { UrlForm } from '@/components/UrlForm';

export default function BrokenLinksPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrokenLinksResult | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Broken Link Checker</h1>
        <p className="text-muted mt-2">
          Crawl your site and find dead links, images, scripts, and stylesheets.
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <UrlForm
          loading={loading}
          submitLabel="Scan"
          loadingLabel="Crawling…"
          onSubmit={async (url) => {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
              setResult(await checkBrokenLinks(url));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Scan failed');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {loading && (
        <p className="text-center text-muted">
          Crawling site… this can take up to 60 seconds for large sites.
        </p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
      {result && <BrokenLinksResults result={result} />}
    </main>
  );
}
