'use client';

import { useState } from 'react';
import { analyzeUrl } from '@/lib/api';
import { AnalysisReport } from '@/types/analysis';
import { UrlForm } from '@/components/UrlForm';
import { SummaryCard } from '@/components/SummaryCard';
import { SeoCard } from '@/components/SeoCard';
import { SpeedCard } from '@/components/SpeedCard';
import { SecurityCard } from '@/components/SecurityCard';
import { TechStackCard } from '@/components/TechStackCard';

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analyze Site</h1>
        <p className="text-muted mt-2">SEO, PageSpeed, security, tech stack — in one report.</p>
      </div>
      <div className="flex justify-center mb-8">
        <UrlForm
          loading={loading}
          onSubmit={async (url) => {
            setLoading(true);
            setError(null);
            setReport(null);
            try {
              setReport(await analyzeUrl(url));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {loading && <p className="text-center text-muted">Analyzing… speed checks can take up to 30 seconds</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {report && (
        <section className="max-w-6xl mx-auto space-y-6">
          <SummaryCard report={report} />
          <div className="grid md:grid-cols-2 gap-4">
            <SeoCard data={report.seo} />
            <SpeedCard data={report.speed} />
            <SecurityCard data={report.security} />
            <TechStackCard data={report.techStack} />
          </div>
        </section>
      )}
    </main>
  );
}
