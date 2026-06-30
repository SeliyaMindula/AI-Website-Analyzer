import { SectionError, SpeedResult, isSectionError } from '@/types/analysis';
import { ScoreBadge } from './ScoreBadge';

function VitalRow({ label, metric }: { label: string; metric: { value: string; pass: boolean } }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className={metric.pass ? 'text-emerald-600' : 'text-red-600'}>
        {metric.value} {metric.pass ? '✓' : '✗'}
      </span>
    </div>
  );
}

export function SpeedCard({ data }: { data: SpeedResult | SectionError }) {
  return (
    <div className="wp-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Speed</h3>
        {!isSectionError(data) && <ScoreBadge score={data.performanceScore} />}
      </div>
      {isSectionError(data) ? (
        <p className="text-red-600 text-sm">{data.error}</p>
      ) : (
        <>
          <div className="space-y-2">
            <VitalRow label="LCP" metric={data.lcp} />
            <VitalRow label="CLS" metric={data.cls} />
            <VitalRow label="INP" metric={data.inp} />
          </div>
          {data.opportunities.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {data.opportunities.map((opp, i) => (
                <li key={i}>
                  {opp.title}
                  {opp.savings && <span className="text-amber-600 ml-2">({opp.savings})</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
