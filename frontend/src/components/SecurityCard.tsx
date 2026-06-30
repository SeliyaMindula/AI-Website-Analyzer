import { SectionError, SecurityResult, isSectionError } from '@/types/analysis';
import { ScoreBadge } from './ScoreBadge';
import { IssueList } from './IssueList';

const statusIcon = {
  present: 'text-emerald-600',
  missing: 'text-red-600',
  weak: 'text-amber-600',
} as const;

export function SecurityCard({ data }: { data: SecurityResult | SectionError }) {
  return (
    <div className="wp-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Security</h3>
        {!isSectionError(data) && <ScoreBadge score={data.score} />}
      </div>
      {isSectionError(data) ? (
        <p className="text-red-600 text-sm">{data.error}</p>
      ) : (
        <>
          <ul className="space-y-1 text-sm">
            {data.headers.map((header) => (
              <li key={header.name} className="flex justify-between">
                <span className="text-muted">{header.name}</span>
                <span className={statusIcon[header.status]}>{header.status}</span>
              </li>
            ))}
          </ul>
          <IssueList issues={data.issues} />
        </>
      )}
    </div>
  );
}
