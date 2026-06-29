'use client';

import { useState } from 'react';
import { AnalysisReport } from '@/types/analysis';
import { downloadPdfReport } from '@/lib/api';

export function DownloadPdfButton({ report }: { report: AnalysisReport }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            await downloadPdfReport(report);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'PDF failed');
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800"
      >
        {loading ? 'Generating…' : 'Download PDF'}
      </button>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
