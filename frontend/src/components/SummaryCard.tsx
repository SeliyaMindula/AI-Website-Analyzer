import { AnalysisReport, Grade } from '@/types/analysis';
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

export function SummaryCard({ report }: { report: AnalysisReport }) {
  const { summary, url, analyzedAt } = report;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
      <div className="flex items-center gap-4 mb-3">
        <ScoreBadge score={gradeScores[summary.grade]} label={summary.grade} />
        <div>
          <h2 className="text-lg font-semibold">Overall Summary</h2>
          <p className="text-sm text-zinc-500 truncate max-w-md">{url}</p>
          <p className="text-xs text-zinc-600">{new Date(analyzedAt).toLocaleString()}</p>
        </div>
      </div>
      <p className="text-zinc-300">{summary.overview}</p>
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
