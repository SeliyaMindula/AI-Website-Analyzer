import { SectionError, SpeedResult, isSectionError } from '@/types/analysis';
import { ScoreBadge } from './ScoreBadge';

function VitalRow({ label, metric }: { label: string; metric: { value: string; pass: boolean } }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={metric.pass ? 'text-green-400' : 'text-red-400'}>
        {metric.value} {metric.pass ? '✓' : '✗'}
      </span>
    </div>
  );
}

export function SpeedCard({ data }: { data: SpeedResult | SectionError }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Speed</h3>
        {!isSectionError(data) && <ScoreBadge score={data.performanceScore} />}
      </div>
      {isSectionError(data) ? (
        <p className="text-red-400 text-sm">{data.error}</p>
      ) : (
        <>
          <div className="space-y-2">
            <VitalRow label="LCP" metric={data.lcp} />
            <VitalRow label="CLS" metric={data.cls} />
            <VitalRow label="INP" metric={data.inp} />
          </div>
          {data.opportunities.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-zinc-400">
              {data.opportunities.map((opp, i) => (
                <li key={i}>
                  {opp.title}
                  {opp.savings && <span className="text-amber-400 ml-2">({opp.savings})</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
