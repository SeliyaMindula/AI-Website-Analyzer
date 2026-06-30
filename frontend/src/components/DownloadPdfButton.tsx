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
        className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-muted transition-colors disabled:opacity-50"
      >
        {loading ? 'Generating…' : 'Download PDF'}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
