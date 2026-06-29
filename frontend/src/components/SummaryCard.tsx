import { AnalysisReport, Grade, isSectionError } from '@/types/analysis';
import { DownloadPdfButton } from './DownloadPdfButton';
import { ScoreBadge } from './ScoreBadge';
const gradeScores: Record<Grade, number> = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 40,
};

const priorityColor = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-zinc-400',
} as const;

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export function SummaryCard({ report }: { report: AnalysisReport }) {
  const { summary, url, analyzedAt, seo, security, speed, techStack } = report;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 min-w-0">
          <ScoreBadge score={gradeScores[summary.grade]} label={summary.grade} />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Overall Summary</h2>
            <p className="text-sm text-zinc-500 truncate">{url}</p>
            <p className="text-xs text-zinc-600">{new Date(analyzedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="shrink-0 sm:pt-1">
          <DownloadPdfButton report={report} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 py-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">SEO</p>
          {isSectionError(seo) ? (
            <p className="text-sm text-zinc-500">N/A</p>
          ) : (
            <p className={`text-lg font-semibold ${scoreColor(seo.score)}`}>{seo.score}</p>
          )}
        </div>
        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 py-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Speed</p>
          {isSectionError(speed) ? (
            <p className="text-sm text-zinc-500">N/A</p>
          ) : (
            <p className={`text-lg font-semibold ${scoreColor(speed.performanceScore)}`}>
              {speed.performanceScore}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 py-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Security</p>
          {isSectionError(security) ? (
            <p className="text-sm text-zinc-500">N/A</p>
          ) : (
            <p className={`text-lg font-semibold ${scoreColor(security.score)}`}>
              {security.score}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 py-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Tech</p>
          {isSectionError(techStack) ? (
            <p className="text-sm text-zinc-500">N/A</p>
          ) : (
            <p className="text-lg font-semibold text-zinc-200">
              {techStack.technologies.length}
            </p>
          )}
        </div>
      </div>

      <p className="text-zinc-300 leading-relaxed">{summary.overview}</p>

      {summary.recommendations.length > 0 && (
        <ol className="mt-4 space-y-2">
          {summary.recommendations.map((rec, i) => (
            <li key={i} className="text-sm">
              <span className={`uppercase text-xs font-medium mr-2 ${priorityColor[rec.priority]}`}>
                {rec.priority}
              </span>
              <span className="text-zinc-500 uppercase text-xs mr-2">{rec.category}</span>
              <span className="text-zinc-300">{rec.message}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
