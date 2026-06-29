import { SeoResult, SectionError, isSectionError } from '@/types/analysis';
import { ScoreBadge } from './ScoreBadge';
import { IssueList } from './IssueList';

export function SeoCard({ data }: { data: SeoResult | SectionError }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">SEO</h3>
        {!isSectionError(data) && <ScoreBadge score={data.score} />}
      </div>
      {isSectionError(data) ? (
        <p className="text-red-400 text-sm">{data.error}</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-2 text-sm text-zinc-400">
            <div>
              <dt>Title</dt>
              <dd className={data.title.present ? 'text-green-400' : 'text-red-400'}>
                {data.title.present ? data.title.content ?? 'Present' : 'Missing'}
              </dd>
            </div>
            <div>
              <dt>Meta description</dt>
              <dd className={data.metaDescription.present ? 'text-green-400' : 'text-red-400'}>
                {data.metaDescription.present ? 'Present' : 'Missing'}
              </dd>
            </div>
            <div>
              <dt>H1 count</dt>
              <dd className="text-zinc-300">{data.h1Count}</dd>
            </div>
            <div>
              <dt>Images with alt</dt>
              <dd className="text-zinc-300">
                {data.images.withAlt}/{data.images.total}
              </dd>
            </div>
          </dl>
          <IssueList issues={data.issues} />
        </>
      )}
    </div>
  );
}
